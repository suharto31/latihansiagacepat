import { QuizPackage, QuizSessionResult, Question, OptionKey } from '../types';
import { DEFAULT_PACKAGES } from '../data/defaultPackages';
import { KWARCAB_KENDAL_KISIKISI } from '../data/kisiKisiData';

const PACKAGES_STORAGE_KEY = 'siaga_cepat_packages_v1';
const HISTORY_STORAGE_KEY = 'siaga_cepat_history_v1';

export const storageService = {
  getPackages(): QuizPackage[] {
    try {
      const data = localStorage.getItem(PACKAGES_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(DEFAULT_PACKAGES));
        return DEFAULT_PACKAGES;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return DEFAULT_PACKAGES;
    } catch (err) {
      console.error('Error loading packages from storage:', err);
      return DEFAULT_PACKAGES;
    }
  },

  savePackages(packages: QuizPackage[]): void {
    try {
      localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
    } catch (err) {
      console.error('Error saving packages to storage:', err);
    }
  },

  addPackage(pkg: QuizPackage): QuizPackage[] {
    const packages = this.getPackages();
    const updated = [...packages, pkg];
    this.savePackages(updated);
    return updated;
  },

  updatePackage(updatedPkg: QuizPackage): QuizPackage[] {
    const packages = this.getPackages();
    const updated = packages.map((p) => (p.id === updatedPkg.id ? updatedPkg : p));
    this.savePackages(updated);
    return updated;
  },

  deletePackage(packageId: string): QuizPackage[] {
    const packages = this.getPackages();
    const updated = packages.filter((p) => p.id !== packageId);
    this.savePackages(updated);
    return updated;
  },

  resetToDefault(): QuizPackage[] {
    localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(DEFAULT_PACKAGES));
    return DEFAULT_PACKAGES;
  },

  createNewPackageFromKisiKisi(pkgNumber: number): QuizPackage {
    const newId = `paket-${Date.now()}`;
    const code = `Paket ${pkgNumber}`;

    // Auto-generate 50 template questions mapped to the 50 kisi-kisi indicators
    const questions: Question[] = KWARCAB_KENDAL_KISIKISI.map((k) => ({
      id: `${newId}-q${k.no}`,
      no: k.no,
      elemen: k.elemen,
      materi: k.materi,
      indikator: k.indikator,
      soal: `[${k.materi}] Soal latihan Siaga Cepat nomor ${k.no}: Berdasarkan materi ${k.materi}, tentukan jawaban yang paling tepat sesuai kaidah kepramukaan Siaga...`,
      pilihan: {
        A: 'Pilihan Jawaban A (Kunci)',
        B: 'Pilihan Jawaban B',
        C: 'Pilihan Jawaban C',
        D: 'Pilihan Jawaban D'
      },
      kunci: 'A' as OptionKey,
      pembahasan: `Pembahasan untuk indikator nomor ${k.no} (${k.materi}): Sesuai petunjuk kisi-kisi Pesta Siaga Kwarcab Kendal 2026.`,
      visualBadge: 'none'
    }));

    const newPackage: QuizPackage = {
      id: newId,
      code,
      title: `${code}: Latihan Tambahan Siaga Cepat`,
      subtitle: `50 Soal Sesuai Kisi-Kisi Pesta Siaga Kwarcab Kendal 2026`,
      description: `Paket soal tambahan baru yang disesuaikan secara dinamis untuk memperkaya bank soal Siaga Cepat.`,
      targetKategori: 'Paket Kustom',
      createdAt: new Date().toISOString(),
      isCustom: true,
      questions
    };

    return newPackage;
  },

  // History management
  getHistory(): QuizSessionResult[] {
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveHistory(result: QuizSessionResult): QuizSessionResult[] {
    const history = this.getHistory();
    const updated = [result, ...history].slice(0, 50); // keep last 50 attempts
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving history:', err);
    }
    return updated;
  },

  clearHistory(): void {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  },

  // Export / Import
  exportDatabaseJSON(): string {
    const packages = this.getPackages();
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        appName: 'Siaga Cepat Pesta Siaga Kwarcab Kendal 2026',
        packages
      },
      null,
      2
    );
  },

  importDatabaseJSON(jsonStr: string): { success: boolean; count?: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonStr);
      let pkgs: QuizPackage[] = [];
      if (Array.isArray(parsed)) {
        pkgs = parsed;
      } else if (parsed && Array.isArray(parsed.packages)) {
        pkgs = parsed.packages;
      } else {
        return { success: false, error: 'Format JSON tidak valid. Harus berisi array paket soal.' };
      }

      if (pkgs.length === 0) {
        return { success: false, error: 'Tidak ada data paket di dalam file JSON.' };
      }

      this.savePackages(pkgs);
      return { success: true, count: pkgs.length };
    } catch (err) {
      return { success: false, error: 'Gagal membaca format JSON: ' + (err as Error).message };
    }
  }
};
