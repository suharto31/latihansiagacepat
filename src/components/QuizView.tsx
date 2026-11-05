import React, { useState, useEffect, useMemo } from 'react';
import { QuizPackage, OptionKey, QuizSessionResult, Participant } from '../types';
import { VisualBadge } from './VisualAssets';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle,
  HelpCircle,
  Send,
  RotateCcw,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Timer as TimerIcon,
  UserCheck,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';

interface QuizViewProps {
  quizPackage: QuizPackage;
  onFinishQuiz: (result: QuizSessionResult) => void;
  onSwitchPackage?: () => void;
  participant: Participant | null;
  onOpenLoginModal: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  quizPackage,
  onFinishQuiz,
  participant,
  onOpenLoginModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [quizMode, setQuizMode] = useState<'simulation' | 'practice'>('simulation');
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // 25 minutes simulation limit (1500 seconds) as requested
  const TOTAL_TIME_SECONDS = 25 * 60;

  // Reset quiz state when package changes
  useEffect(() => {
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setShowExplanation({});
    setSecondsElapsed(0);
    setIsTimerRunning(true);
  }, [quizPackage.id]);

  // Timer effect with auto-submit when 25 minutes are up
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => {
        const next = prev + 1;
        if (quizMode === 'simulation' && next >= TOTAL_TIME_SECONDS) {
          clearInterval(interval);
          setIsTimerRunning(false);
          // Trigger submit automatically when 25 minutes expire
          setTimeout(() => {
            handleSubmitQuiz();
          }, 100);
          return TOTAL_TIME_SECONDS;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, quizMode]);

  const questions = quizPackage.questions;
  const currentQ = questions[currentIndex] || questions[0];

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  const handleSelectOption = (opt: OptionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: opt,
    }));
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleToggleExplanation = () => {
    setShowExplanation((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const countdownSeconds = Math.max(0, TOTAL_TIME_SECONDS - secondsElapsed);

  // Automated grading calculation
  const handleSubmitQuiz = () => {
    setIsTimerRunning(false);
    setShowSubmitModal(false);

    let correctCount = 0;
    const categoryScores: Record<string, { total: number; correct: number; percentage: number }> = {};

    questions.forEach((q) => {
      const userAns = answers[q.id];
      const isCorrect = userAns === q.kunci;
      if (isCorrect) correctCount++;

      // Category breakdown
      const cat = q.elemen || 'Umum';
      if (!categoryScores[cat]) {
        categoryScores[cat] = { total: 0, correct: 0, percentage: 0 };
      }
      categoryScores[cat].total += 1;
      if (isCorrect) {
        categoryScores[cat].correct += 1;
      }
    });

    Object.keys(categoryScores).forEach((cat) => {
      const entry = categoryScores[cat];
      entry.percentage = entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0;
    });

    const incorrectCount = answeredCount - correctCount;
    const score = Math.round((correctCount / questions.length) * 100);

    const sessionResult: QuizSessionResult = {
      id: `session-${Date.now()}`,
      packageId: quizPackage.id,
      packageTitle: quizPackage.title,
      timestamp: new Date().toISOString(),
      durationSeconds: secondsElapsed,
      totalQuestions: questions.length,
      correctCount,
      incorrectCount,
      unansweredCount,
      score,
      answers,
      categoryScores,
      participant: participant || undefined,
    };

    onFinishQuiz(sessionResult);
  };

  const progressPercent = Math.round((answeredCount / (questions.length || 1)) * 100);

  // GATEKEEPER: If participant is not yet logged in, show mandatory login screen before starting quiz
  if (!participant) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-xl text-center relative overflow-hidden">
          {/* Decorative background accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-100/70 via-emerald-50/40 to-transparent rounded-bl-full pointer-events-none" />

          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <UserCheck className="w-8 h-8 text-amber-800" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Pesta Siaga Kwarcab Kendal 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
            Pintu Masuk Latihan: {quizPackage.title}
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto mb-8 leading-relaxed">
            Sesuai ketentuan latihan Siaga Cepat, adik-adik Siaga wajib mengisi identitas peserta terlebih dahulu agar skor dan piagam penghargaan tercatat atas nama Anda.
          </p>

          {/* Quick Rules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-8 text-left">
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-xs">
                50
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block">50 Butir Soal</span>
                <span className="text-[11px] text-stone-500">Sesuai indikator kisi-kisi resmi</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                25'
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block">Waktu 25 Menit</span>
                <span className="text-[11px] text-stone-500">Koreksi otomatis saat selesai</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold text-xs">
                🎖️
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block">Cetak Piagam</span>
                <span className="text-[11px] text-stone-500">Tercetak nama &amp; barung</span>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenLoginModal}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-amber-800 hover:bg-amber-900 shadow-md transition-all flex items-center justify-center gap-2.5 mx-auto cursor-pointer ring-4 ring-amber-800/20"
          >
            <UserCheck className="w-5 h-5" />
            <span>Isi Identitas Peserta &amp; Mulai Mengerjakan</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Participant Active Banner */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200/90 shadow-2xs mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-white shadow-xs"
            style={{
              backgroundColor:
                participant.warnaBarung === 'merah'
                  ? '#ef4444'
                  : participant.warnaBarung === 'kuning'
                  ? '#eab308'
                  : participant.warnaBarung === 'biru'
                  ? '#3b82f6'
                  : participant.warnaBarung === 'cokelat'
                  ? '#854d0e'
                  : participant.warnaBarung === 'putih'
                  ? '#94a3b8'
                  : participant.warnaBarung === 'hitam'
                  ? '#1e293b'
                  : '#16a34a',
            }}
          >
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-stone-900 truncate">
                {participant.nama}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 shrink-0">
                {participant.barung}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 truncate mt-0.5">
              {participant.pangkalan} · {participant.kwarran}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenLoginModal}
          className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer"
        >
          Ganti Peserta
        </button>
      </div>

      {/* Quiz Top Action Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Mode toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 hidden sm:inline">Mode Latihan:</span>
          <div className="flex items-center p-1 bg-stone-100 rounded-lg">
            <button
              onClick={() => setQuizMode('simulation')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                quizMode === 'simulation'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Simulasi Ujian
            </button>
            <button
              onClick={() => setQuizMode('practice')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                quizMode === 'practice'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Belajar Mandiri
            </button>
          </div>
        </div>

        {/* Center: Timer & Progress info */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/60 font-mono font-bold text-amber-900">
            <TimerIcon className="w-3.5 h-3.5 text-amber-700" />
            <span>
              {quizMode === 'simulation'
                ? `Sisa Waktu: ${formatTimer(countdownSeconds)}`
                : `Waktu Berjalan: ${formatTimer(secondsElapsed)}`}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="w-24 bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="font-semibold text-stone-700">{progressPercent}%</span>
          </div>
        </div>

        {/* Right: Submit Button */}
        <div>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Koreksi & Kumpulkan</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question Card & Controls (8 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            {/* Question Header & Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-100 mb-6">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-base px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg">
                  Soal No. {currentQ.no}
                </span>
                <span className="text-stone-300">/</span>
                <span className="font-medium text-stone-600">{currentQ.elemen}</span>
                <span className="text-stone-300">·</span>
                <span className="font-medium text-amber-800">{currentQ.materi}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleFlag}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    flagged[currentQ.id]
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-current' : ''}`} />
                  <span>{flagged[currentQ.id] ? 'Ditandai Ragu' : 'Tandai Ragu'}</span>
                </button>

                {quizMode === 'practice' && (
                  <button
                    onClick={handleToggleExplanation}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Intip Kunci</span>
                  </button>
                )}
              </div>
            </div>

            {/* Indikator Kisi-kisi Context Kicker */}
            <div className="text-xs text-stone-500 italic bg-amber-50/50 p-3 rounded-xl border border-amber-100 mb-6">
              <span className="font-semibold text-amber-900 not-italic">Indikator Kisi-kisi: </span>
              {currentQ.indikator}
            </div>

            {/* Visual Badge Illustration if Present */}
            {currentQ.visualBadge && currentQ.visualBadge !== 'none' && (
              <div className="mb-6 flex justify-center">
                <VisualBadge type={currentQ.visualBadge} className="w-full max-w-sm" />
              </div>
            )}

            {/* Question Text */}
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-relaxed mb-6">
              {currentQ.soal}
            </h2>

            {/* Options List */}
            <div className="flex flex-col gap-3">
              {(['A', 'B', 'C', 'D'] as OptionKey[]).map((optKey) => {
                const optText = currentQ.pilihan[optKey];
                const isSelected = answers[currentQ.id] === optKey;
                const isCorrect = currentQ.kunci === optKey;
                const showInstantResult = quizMode === 'practice' && (isSelected || showExplanation[currentQ.id]);

                let optStyle = 'border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50/20 text-stone-800';
                if (isSelected) {
                  optStyle = 'border-amber-800 bg-amber-50/70 text-amber-950 font-medium ring-2 ring-amber-800/20';
                }

                if (showInstantResult) {
                  if (isCorrect) {
                    optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-2 ring-emerald-500/20';
                  } else if (isSelected && !isCorrect) {
                    optStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400/20';
                  }
                }

                return (
                  <button
                    key={optKey}
                    onClick={() => handleSelectOption(optKey)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${optStyle}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-amber-800 text-white'
                          : 'bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      {optKey}
                    </div>
                    <span className="flex-1 text-sm sm:text-base leading-relaxed">{optText}</span>
                    {showInstantResult && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 self-center" />
                    )}
                    {showInstantResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 self-center" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Explanation in Practice Mode */}
            {quizMode === 'practice' && (showExplanation[currentQ.id] || answers[currentQ.id]) && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-950">
                <div className="font-bold mb-1 flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle className="w-4 h-4" />
                  <span>Kunci Jawaban: {currentQ.kunci}</span>
                </div>
                <p className="leading-relaxed text-emerald-900">{currentQ.pembahasan}</p>
              </div>
            )}
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-xs font-semibold text-stone-500">
              {currentIndex + 1} dari {questions.length} Soal
            </span>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-800 hover:bg-amber-900 text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Selesai & Kumpulkan</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Number Matrix (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-sm font-bold text-stone-900">Navigasi Nomor Soal</h3>
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md">
                {answeredCount}/{questions.length} Terjawab
              </span>
            </div>

            {/* Status Legend */}
            <div className="grid grid-cols-3 gap-2 text-[11px] font-medium text-stone-600 mb-4 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-600"></span>
                <span>Terjawab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-400"></span>
                <span>Ragu-ragu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-stone-100 border border-stone-300"></span>
                <span>Belum</span>
              </div>
            </div>

            {/* 50-Number Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-1.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!answers[q.id];
                const isRagu = !!flagged[q.id];

                let bgClass = 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100';
                if (isAnswered) {
                  bgClass = 'bg-emerald-600 border-emerald-700 text-white font-semibold';
                }
                if (isRagu) {
                  bgClass = 'bg-amber-400 border-amber-500 text-amber-950 font-bold';
                }
                if (isCurrent) {
                  bgClass += ' ring-2 ring-stone-900 ring-offset-1 scale-105 z-10';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg border text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${bgClass}`}
                  >
                    <span>{idx + 1}</span>
                    {isAnswered && (
                      <span className="text-[9px] leading-none opacity-80 uppercase">
                        {answers[q.id]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action inside navigator card */}
            <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col gap-2">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Koreksi Lembar Jawaban</span>
              </button>
              <div className="text-[11px] text-stone-400 text-center">
                Sistem mengoreksi secara instan dan menampilkan analisis skor per elemen.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Before Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-amber-800" />
            </div>

            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Kumpulkan Lembar Jawaban?
            </h3>
            <p className="text-xs text-stone-600 mb-5">
              Apakah adik-adik Siaga / Yanda Bunda sudah yakin ingin menyelesaikan latihan {quizPackage.code}?
            </p>

            {/* Summary statistics */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 mb-5 text-center">
              <div>
                <span className="block text-base font-bold text-emerald-700">{answeredCount}</span>
                <span className="text-[10px] text-stone-500 font-medium">Sudah Terjawab</span>
              </div>
              <div>
                <span className="block text-base font-bold text-amber-600">{flaggedCount}</span>
                <span className="text-[10px] text-stone-500 font-medium">Ragu-ragu</span>
              </div>
              <div>
                <span className="block text-base font-bold text-rose-600">{unansweredCount}</span>
                <span className="text-[10px] text-stone-500 font-medium">Belum Dijawab</span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 mb-5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
                <span>Masih terdapat {unansweredCount} butir soal yang belum adik-adik jawab.</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Periksa Kembali
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs transition-colors cursor-pointer"
              >
                Ya, Koreksi Otomatis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
