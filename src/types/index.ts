export type OptionKey = 'A' | 'B' | 'C' | 'D';

export type VisualBadgeType =
  | 'none'
  | 'tanda_jabatan_sulung'
  | 'tanda_jabatan_pinrung'
  | 'tanda_jabatan_wapinrung'
  | 'tku_mula'
  | 'tku_bantu'
  | 'tku_tata'
  | 'kompas_8_arah'
  | 'simbol_pancasila_1'
  | 'simbol_pancasila_2'
  | 'simbol_pancasila_3'
  | 'simbol_pancasila_4'
  | 'simbol_pancasila_5'
  | 'tkk_merah_patriotisme'
  | 'tkk_putih_kesehatan'
  | 'tkk_wajib_berkemah'
  | 'tkk_wajib_menabung'
  | 'tkk_wajib_p3k'
  | 'simpul_mati'
  | 'simpul_hidup'
  | 'simpul_anyam'
  | 'simpul_pangkal'
  | 'simpul_jangkar'
  | 'sandi_angka'
  | 'tunas_kelapa';

export interface Question {
  id: string;
  no: number; // 1 to 50
  elemen: string;
  materi: string;
  indikator: string;
  soal: string;
  pilihan: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  kunci: OptionKey;
  pembahasan: string;
  visualBadge?: VisualBadgeType;
  gambarUrl?: string; // Optional custom image URL
}

export interface QuizPackage {
  id: string;
  code: string; // e.g. "paket-1", "paket-2"
  title: string;
  subtitle: string;
  description: string;
  targetKategori: string;
  createdAt: string;
  isCustom?: boolean;
  questions: Question[];
}

export interface UserAnswer {
  questionId: string;
  selectedOption?: OptionKey;
  isFlagged?: boolean;
}

export interface Participant {
  nama: string;
  barung: string;
  warnaBarung: string;
  pangkalan: string;
  kwarran: string;
  noPeserta?: string;
}

export interface QuizSessionResult {
  id: string;
  packageId: string;
  packageTitle: string;
  timestamp: string;
  durationSeconds: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  score: number; // 0 to 100
  answers: Record<string, OptionKey>;
  categoryScores: Record<string, { total: number; correct: number; percentage: number }>;
  participant?: Participant;
}

export interface KisiKisiItem {
  no: number;
  elemen: string;
  materi: string;
  indikator: string;
  bentuk: 'PG';
}
