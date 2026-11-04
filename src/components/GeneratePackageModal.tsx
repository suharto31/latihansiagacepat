import React, { useState } from 'react';
import { Sparkles, X, Loader2, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { aiGeneratorService } from '../services/aiGenerator';
import { QuizPackage, Question } from '../types';

interface GeneratePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextPackageNumber: number;
  onPackageGenerated: (newPackage: QuizPackage) => void;
}

export const GeneratePackageModal: React.FC<GeneratePackageModalProps> = ({
  isOpen,
  onClose,
  nextPackageNumber,
  onPackageGenerated,
}) => {
  const [packageName, setPackageName] = useState(`Paket ${nextPackageNumber}: Simulasi Baru Siaga Cepat`);
  const [theme, setTheme] = useState('Standar Pesta Siaga Kwarcab Kendal 2026');
  const [questionCount, setQuestionCount] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[] | null>(null);

  if (!isOpen) return null;

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setProgressPercent(5);
    setStatusText('Memulai proses penyusunan soal...');

    try {
      const questions = await aiGeneratorService.generatePackageQuestions({
        theme,
        count: questionCount,
        onProgress: (percent, text) => {
          setProgressPercent(percent);
          setStatusText(text);
        },
      });

      setGeneratedQuestions(questions);
      setIsGenerating(false);
    } catch (err) {
      console.error('Error during package generation:', err);
      setIsGenerating(false);
      setStatusText('Terjadi kesalahan saat membuat paket soal.');
    }
  };

  const handleSavePackage = () => {
    if (!generatedQuestions || generatedQuestions.length === 0) return;

    const newId = `paket-${Date.now()}`;
    const newPkg: QuizPackage = {
      id: newId,
      code: `Paket ${nextPackageNumber}`,
      title: packageName.trim() || `Paket ${nextPackageNumber}`,
      subtitle: `${generatedQuestions.length} Soal Hasil Generate Kisi-Kisi Kendal 2026`,
      description: `Paket latihan disusun dengan tema "${theme}" sesuai standar indikator Pesta Siaga Kwarcab Kendal.`,
      targetKategori: 'Hasil Generate AI',
      createdAt: new Date().toISOString(),
      isCustom: true,
      questions: generatedQuestions,
    };

    onPackageGenerated(newPkg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Generate Paket Soal Baru
              </h3>
              <p className="text-xs text-stone-500">
                Buat paket soal otomatis berdasarkan 50 indikator kisi-kisi resmi
              </p>
            </div>
          </div>
          {!isGenerating && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* State: Form configuration */}
        {!generatedQuestions && !isGenerating && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Nama / Judul Paket
              </label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Fokus / Tema Soal
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Contoh: Simulasi Kecepatan Cepat Tepat, Penguatan Scouting Skills..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Jumlah Butir Soal yang Disusun
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { count: 10, label: '10 Soal Kilat' },
                  { count: 25, label: '25 Soal Paruh' },
                  { count: 50, label: '50 Soal Lengkap' },
                ].map((opt) => (
                  <button
                    key={opt.count}
                    type="button"
                    onClick={() => setQuestionCount(opt.count)}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                      questionCount === opt.count
                        ? 'bg-amber-800 text-white border-amber-900 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-[10px] opacity-80 mt-0.5">
                      {opt.count === 50 ? 'Indikator 1-50' : `Indikator 1-${opt.count}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Info Penyusunan Soal:</span> Setiap nomor soal akan otomatis dipetakan sesuai kisi-kisi resmi (PUK Siaga, Upacara, Tokoh Pramuka, Lambang, Salam, TOGA, Tanda Jabatan, Kepribadian, TKU/TKK, Pramuka Garuda, Kompas, Sandi, Tali Temali, hingga Asta Cita).
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleStartGeneration}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Mulai Generate Paket Soal</span>
              </button>
            </div>
          </div>
        )}

        {/* State: Generating in progress */}
        {isGenerating && (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-5 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
            </div>

            <h4 className="text-base font-bold text-stone-900 mb-1">
              Sedang Menyusun Butir Soal Siaga Cepat...
            </h4>
            <p className="text-xs text-stone-500 mb-6">{statusText}</p>

            {/* Progress bar */}
            <div className="w-full max-w-md bg-stone-100 h-3 rounded-full overflow-hidden border border-stone-200 mb-2">
              <div
                className="bg-amber-800 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-900">
              {progressPercent}%
            </span>
          </div>
        )}

        {/* State: Finished Preview */}
        {generatedQuestions && !isGenerating && (
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-950">
                  {generatedQuestions.length} Butir Soal Berhasil Disusun!
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Semua soal telah siap dengan 4 opsi pilihan ganda, kunci jawaban, dan pembahasan mendidik.
                </p>
              </div>
            </div>

            {/* Quick Preview List */}
            <div className="max-h-56 overflow-y-auto divide-y divide-stone-100 border border-stone-200 rounded-xl bg-stone-50/50 p-2 text-xs">
              {generatedQuestions.slice(0, 10).map((q) => (
                <div key={q.id} className="p-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded text-[10px]">
                      No. {q.no}
                    </span>
                    <span className="font-semibold text-stone-700">{q.materi}</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-emerald-700 font-bold">Kunci: {q.kunci}</span>
                  </div>
                  <p className="text-stone-800 font-medium line-clamp-1">{q.soal}</p>
                </div>
              ))}
              {generatedQuestions.length > 10 && (
                <div className="p-2 text-center text-stone-500 text-[11px] font-semibold italic">
                  + {generatedQuestions.length - 10} butir soal lainnya siap digunakan.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setGeneratedQuestions(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Generate Ulang
              </button>
              <button
                type="button"
                onClick={handleSavePackage}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Sebagai Paket {nextPackageNumber}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
