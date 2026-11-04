import React, { useState, useEffect } from 'react';
import { QuizPackage, QuizSessionResult, OptionKey } from '../types';
import { VisualBadge } from './VisualAssets';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Printer,
  ChevronRight,
  TrendingUp,
  Clock,
  Filter,
  ArrowRight,
  Share2
} from 'lucide-react';

interface ResultViewProps {
  result: QuizSessionResult;
  quizPackage: QuizPackage;
  onRetakeQuiz: () => void;
  onSelectNextPackage?: () => void;
  onBackToPackages: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  quizPackage,
  onRetakeQuiz,
  onSelectNextPackage,
  onBackToPackages,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');

  // Trigger confetti for high score!
  useEffect(() => {
    if (result.score >= 75) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#15803d', '#d97706', '#92400e', '#facc15'],
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [result.score]);

  // Determine Predicate
  let predikat = 'Barung Perunggu (Perlu Latihan Lagi)';
  let predikatBadgeColor = 'bg-stone-100 text-stone-800 border-stone-300';
  let predikatPesan = 'Tetap semangat adik-adik Siaga! Pelajari lagi pembahasan di bawah ini dan coba lagi.';

  if (result.score >= 85) {
    predikat = 'Barung Tergiat I (Tunas Emas)';
    predikatBadgeColor = 'bg-amber-100 text-amber-950 border-amber-300';
    predikatPesan = 'Luar biasa! Skor sangat memuaskan, siap bertanding dan berprestasi di Pesta Siaga Kwarcab Kendal 2026!';
  } else if (result.score >= 70) {
    predikat = 'Barung Tergiat II (Tunas Perak)';
    predikatBadgeColor = 'bg-emerald-100 text-emerald-950 border-emerald-300';
    predikatPesan = 'Bagus sekali! Sudah menguasai sebagian besar kisi-kisi, tingkatkan sedikit lagi untuk mencapai nilai sempurna!';
  }

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} Menit ${secs} Detik`;
  };

  // Filter questions
  const filteredQuestions = quizPackage.questions.filter((q) => {
    const userAns = result.answers[q.id];
    const isCorrect = userAns === q.kunci;
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return !isCorrect;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner / Score Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-md mb-8 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-100/60 via-emerald-50/40 to-transparent rounded-bl-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Score circle & details */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Score Ring */}
            <div className="relative w-36 h-36 rounded-full bg-amber-50 border-4 border-amber-800 flex flex-col items-center justify-center shadow-inner shrink-0">
              <span className="text-4xl font-extrabold text-amber-950 tracking-tight">
                {result.score}
              </span>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest mt-0.5">
                Skor Akhir
              </span>
              <span className="absolute -bottom-2 text-[10px] font-bold px-2 py-0.5 bg-amber-900 text-amber-100 rounded-full shadow-xs">
                Skala 100
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${predikatBadgeColor}`}>
                  {predikat}
                </span>
                <span className="text-xs text-stone-400 font-medium">·</span>
                <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {formatDuration(result.durationSeconds)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Hasil Koreksi: {result.packageTitle}
              </h1>
              <p className="text-sm text-stone-600 mt-1 max-w-xl">
                {predikatPesan}
              </p>

              {/* Statistics Pill Cluster */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{result.correctCount} Soal Benar</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-900 border border-rose-200">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>{result.incorrectCount} Soal Salah</span>
                </div>
                {result.unansweredCount > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 border border-stone-200">
                    <HelpCircle className="w-4 h-4 text-stone-500" />
                    <span>{result.unansweredCount} Kosong</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0 no-print">
            <button
              onClick={onRetakeQuiz}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-800 hover:bg-amber-900 text-white shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Latihan Paket Ini</span>
            </button>

            {onSelectNextPackage && (
              <button
                onClick={onSelectNextPackage}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Coba Paket Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span>Cetak Hasil / Piagam</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs mb-8">
        <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-700" />
          <span>Analisis Penguasaan Materi Berdasarkan Elemen Kisi-Kisi</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(result.categoryScores).map(([cat, data]) => {
            const isHigh = data.percentage >= 80;
            const isMid = data.percentage >= 60 && data.percentage < 80;

            return (
              <div
                key={cat}
                className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/60 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-stone-800 line-clamp-1">{cat}</span>
                  <span
                    className={`text-xs font-extrabold ${
                      isHigh ? 'text-emerald-700' : isMid ? 'text-amber-700' : 'text-rose-600'
                    }`}
                  >
                    {data.percentage}%
                  </span>
                </div>

                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHigh ? 'bg-emerald-600' : isMid ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${data.percentage}%` }}
                  ></div>
                </div>

                <span className="text-[11px] text-stone-500 font-medium">
                  {data.correct} benar dari {data.total} soal
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Answer Review Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Pembahasan & Koreksi Tiap Butir Soal</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Menampilkan {filteredQuestions.length} dari {quizPackage.questions.length} butir soal
          </p>
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs no-print">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semua Soal ({quizPackage.questions.length})
          </button>
          <button
            onClick={() => setFilterMode('incorrect')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterMode === 'incorrect'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-rose-700'
            }`}
          >
            Salah Saja ({result.incorrectCount + result.unansweredCount})
          </button>
          <button
            onClick={() => setFilterMode('correct')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterMode === 'correct'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-emerald-800'
            }`}
          >
            Benar Saja ({result.correctCount})
          </button>
        </div>
      </div>

      {/* Question Review Cards List */}
      <div className="flex flex-col gap-4">
        {filteredQuestions.map((q) => {
          const userAns = result.answers[q.id];
          const isCorrect = userAns === q.kunci;
          const isAnswered = !!userAns;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl p-6 border transition-all ${
                isCorrect
                  ? 'border-emerald-200/90 shadow-xs'
                  : 'border-rose-200 shadow-xs'
              }`}
            >
              {/* Question Card Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-sm px-2.5 py-0.5 bg-stone-100 text-stone-800 rounded-md">
                    No. {q.no}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="font-semibold text-stone-600">{q.elemen}</span>
                  <span className="text-stone-300">·</span>
                  <span className="font-medium text-amber-800">{q.materi}</span>
                </div>

                {/* Status Badge */}
                <div>
                  {isCorrect ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Jawaban Benar (+1)
                    </span>
                  ) : isAnswered ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Jawaban Salah (Kamu pilih {userAns})
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
                      Tidak Dijawab
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Badge if Present */}
              {q.visualBadge && q.visualBadge !== 'none' && (
                <div className="mb-4 flex justify-center">
                  <VisualBadge type={q.visualBadge} className="w-full max-w-xs" />
                </div>
              )}

              {/* Question Text */}
              <h3 className="text-base font-bold text-stone-900 mb-4 leading-relaxed">
                {q.soal}
              </h3>

              {/* Options 4 Grid / Stack */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 text-xs sm:text-sm">
                {(['A', 'B', 'C', 'D'] as OptionKey[]).map((optKey) => {
                  const optText = q.pilihan[optKey];
                  const isUserSelection = userAns === optKey;
                  const isCorrectKey = q.kunci === optKey;

                  let optBoxClass = 'bg-stone-50 border-stone-200 text-stone-700';
                  if (isCorrectKey) {
                    optBoxClass = 'bg-emerald-50 border-emerald-400 font-bold text-emerald-950 ring-1 ring-emerald-400';
                  } else if (isUserSelection && !isCorrectKey) {
                    optBoxClass = 'bg-rose-50 border-rose-300 font-bold text-rose-950 ring-1 ring-rose-300';
                  }

                  return (
                    <div
                      key={optKey}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 ${optBoxClass}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center shrink-0 ${
                          isCorrectKey
                            ? 'bg-emerald-600 text-white'
                            : isUserSelection
                            ? 'bg-rose-600 text-white'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {optKey}
                      </span>
                      <span className="flex-1 leading-relaxed">{optText}</span>
                      {isCorrectKey && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 self-center" />}
                      {isUserSelection && !isCorrectKey && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 self-center" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pembahasan & Triks */}
              <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl text-xs text-amber-950">
                <span className="font-bold text-amber-900 block mb-0.5">
                  Kunci Jawaban: {q.kunci} — Pembahasan Lengkap:
                </span>
                <p className="leading-relaxed text-amber-900/90">{q.pembahasan}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
