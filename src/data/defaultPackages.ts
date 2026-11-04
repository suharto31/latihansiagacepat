import { QuizPackage } from '../types';
import { paket1Questions } from './paket1';
import { paket2Questions } from './paket2';
import { paket3Questions } from './paket3';

export const DEFAULT_PACKAGES: QuizPackage[] = [
  {
    id: 'paket-1',
    code: 'Paket 1',
    title: 'Paket 1: Standar Kisi-Kisi Kwarcab Kendal',
    subtitle: '50 Soal Lengkap Sesuai Nomor Indikator Resmi 1-50',
    description: 'Paket simulasi komprehensif mencakup materi PUK Siaga, Upacara, Wawasan Kebangsaan, Kompas, Sandi, Tali Temali, hingga Asta Cita.',
    targetKategori: 'Simulasi Utama',
    createdAt: '2026-01-15T08:00:00Z',
    questions: paket1Questions
  },
  {
    id: 'paket-2',
    code: 'Paket 2',
    title: 'Paket 2: Pendalaman & Pengayaan Siaga',
    subtitle: '50 Soal Variasi A - Uji Ketelitian Barung',
    description: 'Paket variasi dengan fokus pada skenario praktis harian Siaga, pengenalan tanaman obat, kabupaten Jawa Tengah, serta kepemimpinan.',
    targetKategori: 'Pengayaan',
    createdAt: '2026-01-18T09:30:00Z',
    questions: paket2Questions
  },
  {
    id: 'paket-3',
    code: 'Paket 3',
    title: 'Paket 3: Cerdas & Tangkas Siaga Cepat',
    subtitle: '50 Soal Variasi B - Simulasi Kompetisi Cepat Tepat',
    description: 'Paket uji kecepatan dan ketepatan menjawab soal Siaga Cepat Pesta Siaga, mengasah ketajaman wawasan pramuka dan berita nasional.',
    targetKategori: 'Kompetisi',
    createdAt: '2026-01-20T10:00:00Z',
    questions: paket3Questions
  }
];
