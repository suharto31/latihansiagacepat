import React, { useState } from 'react';
import { QuizSessionResult } from '../types';
import { Clock, Award, CheckCircle2, XCircle, Trash2, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

interface HistoryViewProps {
  history: QuizSessionResult[];
  onClearHistory: () => void;
  onReviewResult?: (result: QuizSessionResult) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onClearHistory,
  onReviewResult,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const averageScore =
    history.length > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length)
      : 0;

  const highestScore = history.length > 0 ? Math.max(...history.map((h) => h.score)) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Summary Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md w-fit mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Rekam Jejak Prestasi Barung</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Riwayat Sesi Latihan Siaga Cepat
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Catatan hasil pengerjaan setiap paket latihan untuk memantau peningkatan kompetensi peserta.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Riwayat</span>
            </button>
          )}
        </div>

        {/* Aggregate Stats */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
              <span className="text-xs font-bold text-amber-900 block mb-1">Rata-rata Skor</span>
              <span className="text-3xl font-extrabold text-amber-950">{averageScore}</span>
              <span className="text-[11px] text-stone-500 block mt-0.5">dari {history.length} kali latihan</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70">
              <span className="text-xs font-bold text-emerald-900 block mb-1">Skor Tertinggi</span>
              <span className="text-3xl font-extrabold text-emerald-950">{highestScore}</span>
              <span className="text-[11px] text-stone-500 block mt-0.5">Predikat Tunas Emas</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs font-bold text-stone-700 block mb-1">Total Sesi Latihan</span>
              <span className="text-3xl font-extrabold text-stone-900">{history.length}</span>
              <span className="text-[11px] text-stone-500 block mt-0.5">Terus giat berlatih!</span>
            </div>
          </div>
        )}
      </div>

      {/* History Items List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {history.length === 0 ? (
          <div className="p-12 text-center">
            <Award className="w-12 h-12 text-amber-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">Belum Ada Riwayat Latihan</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              Pilih salah satu Paket Latihan (Paket 1, Paket 2, atau Paket 3) dan selesaikan 50 soal untuk melihat skor dan hasil koreksi di sini.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {history.map((item) => {
              const isExcellent = item.score >= 85;
              const isGood = item.score >= 70 && item.score < 85;

              return (
                <div
                  key={item.id}
                  className="p-5 hover:bg-stone-50/60 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Score badge */}
                    <div
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-extrabold border shrink-0 ${
                        isExcellent
                          ? 'bg-amber-100 text-amber-950 border-amber-300'
                          : isGood
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                          : 'bg-stone-100 text-stone-800 border-stone-300'
                      }`}
                    >
                      <span className="text-lg leading-none">{item.score}</span>
                      <span className="text-[9px] font-semibold text-stone-500 uppercase mt-0.5">
                        Skor
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-stone-900">{item.packageTitle}</h3>
                        {item.participant && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                            {item.participant.nama} ({item.participant.barung})
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {formatDate(item.timestamp)}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {formatDuration(item.durationSeconds)}
                        </span>
                        <span>·</span>
                        <span className="text-emerald-700 font-semibold">
                          {item.correctCount} Benar
                        </span>
                        <span>/</span>
                        <span className="text-rose-600 font-semibold">
                          {item.incorrectCount} Salah
                        </span>
                      </div>
                    </div>
                  </div>

                  {onReviewResult && (
                    <button
                      onClick={() => onReviewResult(item)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer self-end sm:self-center"
                    >
                      Buka Rincian Koreksi
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>

            <h3 className="text-lg font-bold text-stone-900 mb-2">
              Bersihkan Seluruh Riwayat?
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-6">
              Semua catatan skor latihan adik-adik Siaga yang tersimpan akan dihapus secara permanen.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors cursor-pointer"
              >
                Ya, Bersihkan Riwayat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
