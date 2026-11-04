import React, { useState } from 'react';
import { QuizPackage, Question, OptionKey, VisualBadgeType } from '../types';
import { VisualBadge } from './VisualAssets';
import { aiGeneratorService } from '../services/aiGenerator';
import {
  Plus,
  Trash2,
  Edit3,
  Download,
  Upload,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
  X,
  Sparkles,
  Layers,
  Loader2,
  AlertTriangle
} from 'lucide-react';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}

interface AdminPanelProps {
  packages: QuizPackage[];
  activePackageId: string;
  onSelectPackage: (packageId: string) => void;
  onUpdatePackage: (pkg: QuizPackage) => void;
  onAddPackage: () => void;
  onOpenGenerateModal?: () => void;
  onDeletePackage: (packageId: string) => void;
  onResetDefault: () => void;
  onExportJSON: () => void;
  onImportJSON: (jsonStr: string) => { success: boolean; count?: number; error?: string };
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  packages,
  activePackageId,
  onSelectPackage,
  onUpdatePackage,
  onAddPackage,
  onOpenGenerateModal,
  onDeletePackage,
  onResetDefault,
  onExportJSON,
  onImportJSON,
}) => {
  const currentPkg = packages.find((p) => p.id === activePackageId) || packages[0];
  const [searchQuery, setSearchQuery] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditingPackageMeta, setIsEditingPackageMeta] = useState(false);
  const [pkgTitle, setPkgTitle] = useState(currentPkg?.title || '');
  const [pkgSubtitle, setPkgSubtitle] = useState(currentPkg?.subtitle || '');
  const [pkgDescription, setPkgDescription] = useState(currentPkg?.description || '');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isRegeneratingSingle, setIsRegeneratingSingle] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);

  // Sync state when active package changes
  React.useEffect(() => {
    if (currentPkg) {
      setPkgTitle(currentPkg.title);
      setPkgSubtitle(currentPkg.subtitle);
      setPkgDescription(currentPkg.description);
    }
  }, [currentPkg?.id]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSavePackageMeta = () => {
    if (!currentPkg) return;
    const updated: QuizPackage = {
      ...currentPkg,
      title: pkgTitle.trim() || currentPkg.title,
      subtitle: pkgSubtitle.trim() || currentPkg.subtitle,
      description: pkgDescription.trim() || currentPkg.description,
    };
    onUpdatePackage(updated);
    setIsEditingPackageMeta(false);
    showToast('success', 'Informasi paket berhasil diperbarui!');
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion || !currentPkg) return;
    const updatedQuestions = currentPkg.questions.map((q) =>
      q.id === editingQuestion.id ? editingQuestion : q
    );
    const updatedPkg: QuizPackage = {
      ...currentPkg,
      questions: updatedQuestions,
    };
    onUpdatePackage(updatedPkg);
    setEditingQuestion(null);
    showToast('success', `Soal No. ${editingQuestion.no} berhasil disimpan!`);
  };

  const promptDeleteQuestion = (qId: string, qNo: number) => {
    if (!currentPkg) return;
    setConfirmDialog({
      isOpen: true,
      title: `Hapus Soal No. ${qNo}?`,
      message: `Apakah Anda yakin ingin menghapus butir soal No. ${qNo} dari ${currentPkg.title}? Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: 'Ya, Hapus Soal Ini',
      onConfirm: () => {
        const updatedQuestions = currentPkg.questions.filter((q) => q.id !== qId);
        onUpdatePackage({
          ...currentPkg,
          questions: updatedQuestions,
        });
        setConfirmDialog(null);
        showToast('success', `Soal No. ${qNo} telah dihapus.`);
      },
    });
  };

  const promptDeleteCurrentPackage = () => {
    if (!currentPkg) return;
    if (packages.length <= 1) {
      showToast('error', 'Minimal harus ada 1 paket soal yang tersisa dalam sistem.');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: `Hapus ${currentPkg.title}?`,
      message: `Apakah Anda yakin ingin menghapus paket "${currentPkg.title}" beserta seluruh ${currentPkg.questions.length} butir soal di dalamnya?`,
      confirmLabel: 'Ya, Hapus Paket Ini',
      onConfirm: () => {
        const pkgTitleDeleted = currentPkg.title;
        const targetId = currentPkg.id;
        setConfirmDialog(null);
        onDeletePackage(targetId);
        showToast('success', `"${pkgTitleDeleted}" telah berhasil dihapus.`);
      },
    });
  };

  const promptResetDatabase = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset ke 3 Paket Standar?',
      message: 'Perhatian: Tindakan ini akan mengembalikan database bank soal ke Paket 1, Paket 2, dan Paket 3 standar bawaan sesuai kisi-kisi resmi Kwarcab Kendal. Paket tambahan kustom yang Anda buat akan dihapus.',
      confirmLabel: 'Ya, Reset Standar Sekarang',
      onConfirm: () => {
        setConfirmDialog(null);
        onResetDefault();
        showToast('success', 'Database berhasil direset ke 3 paket standar awal.');
      },
    });
  };

  const handleAddNewQuestion = () => {
    if (!currentPkg) return;
    const nextNo = currentPkg.questions.length + 1;
    const newQ: Question = {
      id: `${currentPkg.id}-q${Date.now()}`,
      no: nextNo,
      elemen: 'Wawasan Kebangsaan',
      materi: 'Materi Baru',
      indikator: 'Indikator soal latihan baru',
      soal: 'Tuliskan teks pertanyaan soal baru di sini...',
      pilihan: {
        A: 'Pilihan Jawaban A',
        B: 'Pilihan Jawaban B',
        C: 'Pilihan Jawaban C',
        D: 'Pilihan Jawaban D',
      },
      kunci: 'A',
      pembahasan: 'Tuliskan kunci pembahasan lengkap soal di sini.',
      visualBadge: 'none',
    };

    onUpdatePackage({
      ...currentPkg,
      questions: [...currentPkg.questions, newQ],
    });
    setEditingQuestion(newQ);
    showToast('success', `Soal baru No. ${nextNo} ditambahkan. Silakan lengkapi detail soal.`);
  };

  const handleRegenerateCurrentQuestion = async () => {
    if (!editingQuestion) return;
    setIsRegeneratingSingle(true);
    try {
      const freshQ = await aiGeneratorService.generateSingleQuestion(
        editingQuestion.no,
        editingQuestion.elemen,
        editingQuestion.materi,
        editingQuestion.indikator,
        currentPkg?.title
      );
      setEditingQuestion({
        ...editingQuestion,
        soal: freshQ.soal,
        pilihan: freshQ.pilihan,
        kunci: freshQ.kunci,
        pembahasan: freshQ.pembahasan,
        visualBadge: freshQ.visualBadge || editingQuestion.visualBadge,
      });
      showToast('success', `Soal No. ${editingQuestion.no} berhasil digenerate ulang!`);
    } catch (e) {
      showToast('error', 'Gagal menyusun soal otomatis.');
    } finally {
      setIsRegeneratingSingle(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = onImportJSON(content);
      if (res.success) {
        showToast('success', `Berhasil mengimpor ${res.count} paket soal!`);
      } else {
        showToast('error', res.error || 'Gagal mengimpor file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset file input
  };

  // Filter questions by query
  const filteredQuestions = (currentPkg?.questions || []).filter((q) => {
    if (!searchQuery) return true;
    const qStr = `${q.no} ${q.elemen} ${q.materi} ${q.soal} ${q.indikator}`.toLowerCase();
    return qStr.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : 'bg-rose-900 text-rose-100 border-rose-700'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Title & Toolbar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md w-fit mb-2">
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>Sistem Manajemen Bank Soal Dinamis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Kelola Database Paket & Soal Siaga
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-xl">
              Tambah paket baru kapan saja, gunakan fitur generate paket otomatis, edit butir soal 1 s.d 50, sesuaikan kunci jawaban & pembahasan, serta unduh/unggah cadangan database JSON.
            </p>
          </div>

          {/* Backup & Reset Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenGenerateModal && (
              <button
                onClick={onOpenGenerateModal}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-800 hover:bg-amber-900 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Generate paket soal baru otomatis"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Generate Paket Baru</span>
              </button>
            )}

            <button
              onClick={onExportJSON}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Unduh seluruh database paket dalam format JSON"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>Ekspor JSON</span>
            </button>

            <label className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-stone-600" />
              <span>Impor JSON</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={promptResetDatabase}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset ke 3 paket bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset Standar</span>
            </button>
          </div>
        </div>

        {/* Package Tabs Selector in Admin */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-bold text-stone-500 uppercase mr-1">Pilih Paket:</span>
            {packages.map((pkg) => {
              const isSelected = pkg.id === activePackageId;
              return (
                <button
                  key={pkg.id}
                  onClick={() => onSelectPackage(pkg.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>{pkg.code}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-amber-900 text-amber-200' : 'bg-stone-200 text-stone-600'}`}>
                    {pkg.questions.length} Soal
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => {
                onAddPackage();
                showToast('success', 'Paket baru berhasil dibuat!');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Manual</span>
            </button>
          </div>

          {/* Delete Package Button */}
          {packages.length > 1 && currentPkg && (
            <button
              onClick={promptDeleteCurrentPackage}
              className="text-xs font-bold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Hapus paket soal ini dari sistem"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus {currentPkg.code || 'Paket Ini'}</span>
            </button>
          )}
        </div>

        {/* Active Package Info / Meta Edit */}
        {currentPkg && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60">
            {isEditingPackageMeta ? (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Judul Paket</label>
                    <input
                      type="text"
                      value={pkgTitle}
                      onChange={(e) => setPkgTitle(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Subjudul / Sasaran</label>
                    <input
                      type="text"
                      value={pkgSubtitle}
                      onChange={(e) => setPkgSubtitle(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Deskripsi Paket</label>
                  <textarea
                    rows={2}
                    value={pkgDescription}
                    onChange={(e) => setPkgDescription(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingPackageMeta(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-200 text-stone-700 hover:bg-stone-300 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSavePackageMeta}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-800 text-white hover:bg-amber-900 cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-stone-900">{currentPkg.title}</h3>
                  <p className="text-xs text-stone-600 mt-0.5">{currentPkg.subtitle}</p>
                  <p className="text-xs text-stone-500 mt-1">{currentPkg.description}</p>
                </div>
                <button
                  onClick={() => setIsEditingPackageMeta(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                  <span>Ubah Info Paket</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Questions Search & Add Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor, materi, kata kunci soal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-stone-200 text-xs font-medium placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-800/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500">
            Total {filteredQuestions.length} Butir Soal
          </span>
          <button
            onClick={handleAddNewQuestion}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-800 hover:bg-amber-900 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Soal</span>
          </button>
        </div>
      </div>

      {/* Question Table / List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-stone-100">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="p-4 sm:p-5 hover:bg-stone-50/60 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Question Preview Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                  <span className="font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md">
                    No. {q.no}
                  </span>
                  <span className="font-semibold text-stone-600">{q.elemen}</span>
                  <span className="text-stone-300">·</span>
                  <span className="font-medium text-amber-800">{q.materi}</span>
                  <span className="text-stone-300">·</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Kunci: {q.kunci}
                  </span>
                  {q.visualBadge && q.visualBadge !== 'none' && (
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-medium">
                      Bergambar
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2">
                  {q.soal}
                </p>

                <p className="text-[11px] text-stone-500 mt-1 line-clamp-1 italic">
                  Indikator: {q.indikator}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => setEditingQuestion(q)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                  <span>Edit Soal</span>
                </button>
                <button
                  onClick={() => promptDeleteQuestion(q.id, q.no)}
                  className="p-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus Soal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="p-12 text-center text-xs text-stone-500">
              Tidak ada soal yang cocok dengan pencarian "{searchQuery}".
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>

            <h3 className="text-lg font-bold text-stone-900 mb-2">
              {confirmDialog.title}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-6">
              {confirmDialog.message}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors cursor-pointer"
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Editor Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Edit Soal No. {editingQuestion.no} ({currentPkg?.code})
                </h3>
                <span className="text-xs text-stone-500">{editingQuestion.elemen} · {editingQuestion.materi}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* AI Regenerate Single Question Button */}
                <button
                  type="button"
                  onClick={handleRegenerateCurrentQuestion}
                  disabled={isRegeneratingSingle}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Buat ulang pertanyaan dan opsi soal ini secara otomatis"
                >
                  {isRegeneratingSingle ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  )}
                  <span>{isRegeneratingSingle ? 'Menyusun...' : 'Generate Soal Ini'}</span>
                </button>

                <button
                  onClick={() => setEditingQuestion(null)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* No & Category Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Nomor Soal</label>
                  <input
                    type="number"
                    value={editingQuestion.no}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, no: parseInt(e.target.value) || 1 })
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Elemen Kisi-kisi</label>
                  <input
                    type="text"
                    value={editingQuestion.elemen}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, elemen: e.target.value })
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Materi</label>
                  <input
                    type="text"
                    value={editingQuestion.materi}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, materi: e.target.value })
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              {/* Indikator */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Indikator Soal Resmi</label>
                <textarea
                  rows={2}
                  value={editingQuestion.indikator}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, indikator: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              {/* Soal */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Teks Pertanyaan Soal</label>
                <textarea
                  rows={3}
                  value={editingQuestion.soal}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, soal: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-medium"
                />
              </div>

              {/* Visual Badge Selector */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Ilustrasi / Simbol Diagram Visual (Opsional)
                </label>
                <select
                  value={editingQuestion.visualBadge || 'none'}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      visualBadge: e.target.value as VisualBadgeType,
                    })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="none">Tanpa Ilustrasi Visual</option>
                  <option value="tunas_kelapa">Siluet Tunas Kelapa</option>
                  <option value="tanda_jabatan_sulung">Tanda Jabatan: 3 Garis Hijau (Sulung)</option>
                  <option value="tanda_jabatan_pinrung">Tanda Jabatan: 2 Garis Hijau (Pinrung)</option>
                  <option value="tanda_jabatan_wapinrung">Tanda Jabatan: 1 Garis Hijau (Wapinrung)</option>
                  <option value="tku_mula">TKU Siaga Mula (1 Kelopak)</option>
                  <option value="tku_bantu">TKU Siaga Bantu (2 Kelopak)</option>
                  <option value="tku_tata">TKU Siaga Tata (3 Kelopak)</option>
                  <option value="kompas_8_arah">8 Arah Kompas & Derajat</option>
                  <option value="simbol_pancasila_1">Simbol Sila 1: Bintang Emas</option>
                  <option value="simbol_pancasila_2">Simbol Sila 2: Rantai Emas</option>
                  <option value="simbol_pancasila_3">Simbol Sila 3: Pohon Beringin</option>
                  <option value="simbol_pancasila_4">Simbol Sila 4: Kepala Banteng</option>
                  <option value="simbol_pancasila_5">Simbol Sila 5: Padi dan Kapas</option>
                  <option value="tkk_merah_patriotisme">TKK Siaga Dasar Merah (Patriotisme)</option>
                  <option value="tkk_putih_kesehatan">TKK Siaga Dasar Putih (Ketangkasan & Kesehatan)</option>
                  <option value="tkk_wajib_berkemah">TKK Wajib: Berkemah</option>
                  <option value="tkk_wajib_menabung">TKK Wajib: Menabung</option>
                  <option value="tkk_wajib_p3k">TKK Wajib: P3K</option>
                  <option value="simpul_mati">Simpul Tali: Simpul Mati</option>
                  <option value="simpul_hidup">Simpul Tali: Simpul Hidup</option>
                  <option value="simpul_anyam">Simpul Tali: Simpul Anyam</option>
                  <option value="simpul_pangkal">Simpul Tali: Simpul Pangkal</option>
                  <option value="simpul_jangkar">Simpul Tali: Simpul Jangkar</option>
                  <option value="sandi_angka">Sandi Angka Dasar</option>
                </select>

                {editingQuestion.visualBadge && editingQuestion.visualBadge !== 'none' && (
                  <div className="mt-2 p-2 bg-stone-50 rounded-xl border border-stone-200 flex justify-center">
                    <VisualBadge type={editingQuestion.visualBadge} className="w-full max-w-xs" />
                  </div>
                )}
              </div>

              {/* Options A, B, C, D */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-bold text-stone-700">Pilihan Jawaban (A, B, C, D):</span>
                {(['A', 'B', 'C', 'D'] as OptionKey[]).map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-stone-100 border border-stone-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {key}
                    </span>
                    <input
                      type="text"
                      value={editingQuestion.pilihan[key]}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          pilihan: {
                            ...editingQuestion.pilihan,
                            [key]: e.target.value,
                          },
                        })
                      }
                      className="flex-1 text-xs p-2.5 rounded-xl border border-stone-300"
                    />
                  </div>
                ))}
              </div>

              {/* Correct Key Selector */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Kunci Jawaban Benar</label>
                <div className="flex items-center gap-3">
                  {(['A', 'B', 'C', 'D'] as OptionKey[]).map((k) => (
                    <label key={k} className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold">
                      <input
                        type="radio"
                        name="kunciJawaban"
                        checked={editingQuestion.kunci === k}
                        onChange={() => setEditingQuestion({ ...editingQuestion, kunci: k })}
                        className="text-amber-800"
                      />
                      <span>Pilihan {k}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pembahasan */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Penjelasan / Pembahasan Lengkap
                </label>
                <textarea
                  rows={3}
                  value={editingQuestion.pembahasan}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, pembahasan: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-stone-100 mt-5">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveQuestion}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Soal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
