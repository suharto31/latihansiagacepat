import React from 'react';
import { VisualBadgeType } from '../types';

interface VisualBadgeProps {
  type: VisualBadgeType;
  label?: string;
  className?: string;
}

export const VisualBadge: React.FC<VisualBadgeProps> = ({ type, label, className = '' }) => {
  if (type === 'none') return null;

  switch (type) {
    case 'tunas_kelapa':
      return (
        <div className={`flex flex-col items-center justify-center p-4 bg-amber-50 rounded-xl border border-amber-200/80 ${className}`}>
          <svg viewBox="0 0 100 120" className="w-24 h-28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 110 C50 85 46 65 38 48 C32 34 22 25 10 18 C30 18 42 30 46 45 C49 32 55 18 72 8 C66 22 62 36 56 48 C72 32 86 34 94 40 C80 48 68 55 58 64 C54 78 52 95 50 110 Z"
              fill="#92400e"
            />
            <circle cx="50" cy="85" r="14" fill="#78350f" />
            <path d="M42 90 C46 95 54 95 58 90" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-xs font-semibold text-amber-900 mt-2">{label || 'Siluet Tunas Kelapa'}</span>
        </div>
      );

    case 'tanda_jabatan_sulung':
      return (
        <div className={`flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-xl border border-emerald-200 ${className}`}>
          <div className="w-28 h-20 bg-emerald-800 rounded-lg flex flex-col justify-center items-center gap-2 p-2 shadow-inner border border-emerald-900">
            <div className="w-20 h-2.5 bg-emerald-400 rounded-sm shadow-sm"></div>
            <div className="w-20 h-2.5 bg-emerald-400 rounded-sm shadow-sm"></div>
            <div className="w-20 h-2.5 bg-emerald-400 rounded-sm shadow-sm"></div>
          </div>
          <span className="text-xs font-semibold text-emerald-950 mt-2.5">{label || 'Tanda Jabatan: 3 Garis Hijau'}</span>
        </div>
      );

    case 'tanda_jabatan_pinrung':
      return (
        <div className={`flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-xl border border-emerald-200 ${className}`}>
          <div className="w-28 h-20 bg-emerald-800 rounded-lg flex flex-col justify-center items-center gap-2.5 p-2 shadow-inner border border-emerald-900">
            <div className="w-20 h-2.5 bg-emerald-400 rounded-sm shadow-sm"></div>
            <div className="w-20 h-2.5 bg-emerald-400 rounded-sm shadow-sm"></div>
          </div>
          <span className="text-xs font-semibold text-emerald-950 mt-2.5">{label || 'Tanda Jabatan: 2 Garis Hijau'}</span>
        </div>
      );

    case 'tanda_jabatan_wapinrung':
      return (
        <div className={`flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-xl border border-emerald-200 ${className}`}>
          <div className="w-28 h-20 bg-emerald-800 rounded-lg flex flex-col justify-center items-center p-2 shadow-inner border border-emerald-900">
            <div className="w-20 h-2.5 bg-emerald-400 rounded-sm shadow-sm"></div>
          </div>
          <span className="text-xs font-semibold text-emerald-950 mt-2.5">{label || 'Tanda Jabatan: 1 Garis Hijau'}</span>
        </div>
      );

    case 'tku_mula':
      return (
        <div className={`flex flex-col items-center justify-center p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 ${className}`}>
          <div className="w-28 h-20 bg-emerald-700 rounded-lg flex items-center justify-center shadow border border-emerald-800">
            <svg viewBox="0 0 60 70" className="w-12 h-14" fill="none">
              <path d="M30 10 C35 25 45 40 45 55 C45 62 38 65 30 65 C22 65 15 62 15 55 C15 40 25 25 30 10 Z" fill="#ffffff" />
              <path d="M30 10 L30 65" stroke="#15803d" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-emerald-950 mt-2.5">{label || 'TKU: 1 Kelopak Mancung (Siaga Mula)'}</span>
        </div>
      );

    case 'tku_bantu':
      return (
        <div className={`flex flex-col items-center justify-center p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 ${className}`}>
          <div className="w-28 h-20 bg-emerald-700 rounded-lg flex items-center justify-center gap-2 shadow border border-emerald-800">
            <svg viewBox="0 0 45 70" className="w-8 h-12" fill="none">
              <path d="M22 10 C27 25 35 40 35 55 C35 62 29 65 22 65 C15 65 9 62 9 55 C9 40 17 25 22 10 Z" fill="#ffffff" />
            </svg>
            <svg viewBox="0 0 45 70" className="w-8 h-12" fill="none">
              <path d="M22 10 C27 25 35 40 35 55 C35 62 29 65 22 65 C15 65 9 62 9 55 C9 40 17 25 22 10 Z" fill="#ffffff" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-emerald-950 mt-2.5">{label || 'TKU: 2 Kelopak Mancung (Siaga Bantu)'}</span>
        </div>
      );

    case 'tku_tata':
      return (
        <div className={`flex flex-col items-center justify-center p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 ${className}`}>
          <div className="w-28 h-20 bg-emerald-700 rounded-lg flex items-center justify-center gap-1.5 shadow border border-emerald-800">
            <svg viewBox="0 0 40 70" className="w-7 h-11" fill="none">
              <path d="M20 10 C25 25 32 40 32 55 C32 62 26 65 20 65 C14 65 8 62 8 55 C8 40 15 25 20 10 Z" fill="#ffffff" />
            </svg>
            <svg viewBox="0 0 40 70" className="w-7 h-11" fill="none">
              <path d="M20 10 C25 25 32 40 32 55 C32 62 26 65 20 65 C14 65 8 62 8 55 C8 40 15 25 20 10 Z" fill="#ffffff" />
            </svg>
            <svg viewBox="0 0 40 70" className="w-7 h-11" fill="none">
              <path d="M20 10 C25 25 32 40 32 55 C32 62 26 65 20 65 C14 65 8 62 8 55 C8 40 15 25 20 10 Z" fill="#ffffff" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-emerald-950 mt-2.5">{label || 'TKU: 3 Kelopak Mancung (Siaga Tata)'}</span>
        </div>
      );

    case 'kompas_8_arah':
      return (
        <div className={`flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 ${className}`}>
          <div className="relative w-44 h-44 bg-white rounded-full border-2 border-slate-700 shadow-md flex items-center justify-center">
            {/* Compass degree markings */}
            <div className="absolute inset-1 rounded-full border border-dashed border-slate-300"></div>

            {/* Needle */}
            <svg className="w-36 h-36" viewBox="0 0 100 100">
              {/* Dial markings */}
              <circle cx="50" cy="50" r="46" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              {/* Lines */}
              <line x1="50" y1="8" x2="50" y2="92" stroke="#94a3b8" strokeWidth="1" />
              <line x1="8" y1="50" x2="92" y2="50" stroke="#94a3b8" strokeWidth="1" />
              <line x1="20" y1="20" x2="80" y2="80" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="20" y1="80" x2="80" y2="20" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />

              {/* Arrow North Red */}
              <polygon points="50,14 44,50 56,50" fill="#dc2626" />
              {/* Arrow South Dark */}
              <polygon points="50,86 44,50 56,50" fill="#334155" />
              <circle cx="50" cy="50" r="4" fill="#0f172a" />
            </svg>

            {/* Direction Labels */}
            <span className="absolute top-1 text-[11px] font-bold text-red-600">U (0°/360°)</span>
            <span className="absolute top-5 right-5 text-[10px] font-semibold text-slate-700">TL (45°)</span>
            <span className="absolute right-1 text-[11px] font-bold text-slate-800">T (90°)</span>
            <span className="absolute bottom-5 right-5 text-[10px] font-semibold text-slate-700">TG (135°)</span>
            <span className="absolute bottom-1 text-[11px] font-bold text-slate-800">S (180°)</span>
            <span className="absolute bottom-5 left-5 text-[10px] font-semibold text-slate-700">BD (225°)</span>
            <span className="absolute left-1 text-[11px] font-bold text-slate-800">B (270°)</span>
            <span className="absolute top-5 left-5 text-[10px] font-semibold text-slate-700">BL (315°)</span>
          </div>
          <span className="text-xs font-semibold text-slate-700 mt-2.5">{label || '8 Arah Mata Angin dan Derajat Kompas'}</span>
        </div>
      );

    case 'simbol_pancasila_1':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-neutral-900 rounded-xl border border-neutral-700 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            <polygon points="40,8 49,30 73,30 54,45 61,68 40,53 19,68 26,45 7,30 31,30" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          </svg>
          <span className="text-xs font-semibold text-amber-300 mt-2">{label || 'Sila Ke-1: Bintang Tunggal'}</span>
        </div>
      );

    case 'simbol_pancasila_2':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-rose-50 rounded-xl border border-rose-200 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            <rect width="80" height="80" rx="8" fill="#e11d48" />
            <circle cx="40" cy="40" r="26" fill="none" stroke="#facc15" strokeWidth="6" strokeDasharray="9 4" />
          </svg>
          <span className="text-xs font-semibold text-rose-950 mt-2">{label || 'Sila Ke-2: Rantai Emas'}</span>
        </div>
      );

    case 'simbol_pancasila_3':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-stone-50 rounded-xl border border-stone-200 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            <rect width="80" height="80" rx="8" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
            <path d="M40 18 C30 18 22 28 22 38 C22 46 28 52 35 54 L35 70 L45 70 L45 54 C52 52 58 46 58 38 C58 28 50 18 40 18 Z" fill="#15803d" />
            <path d="M37 54 L37 70 L43 70 L43 54 Z" fill="#78350f" />
            <line x1="33" y1="42" x2="33" y2="58" stroke="#166534" strokeWidth="1.5" />
            <line x1="47" y1="42" x2="47" y2="58" stroke="#166534" strokeWidth="1.5" />
          </svg>
          <span className="text-xs font-semibold text-emerald-950 mt-2">{label || 'Sila Ke-3: Pohon Beringin'}</span>
        </div>
      );

    case 'simbol_pancasila_4':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-rose-50 rounded-xl border border-rose-200 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            <rect width="80" height="80" rx="8" fill="#e11d48" />
            {/* Banteng Head Siluet */}
            <path d="M22 26 C28 26 33 34 33 42 C33 50 36 60 40 60 C44 60 47 50 47 42 C47 34 52 26 58 26 C53 30 50 38 49 46 C48 55 45 64 40 64 C35 64 32 55 31 46 C30 38 27 30 22 26 Z" fill="#0f172a" />
            <path d="M24 28 C20 20 28 14 36 22 C32 23 28 25 24 28 Z" fill="#0f172a" />
            <path d="M56 28 C60 20 52 14 44 22 C48 23 52 25 56 28 Z" fill="#0f172a" />
          </svg>
          <span className="text-xs font-semibold text-rose-950 mt-2">{label || 'Sila Ke-4: Kepala Banteng'}</span>
        </div>
      );

    case 'simbol_pancasila_5':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-stone-50 rounded-xl border border-stone-200 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            <rect width="80" height="80" rx="8" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
            {/* Padi (kiri) */}
            <path d="M30 65 Q25 45 32 20" stroke="#ca8a04" strokeWidth="2.5" fill="none" />
            <circle cx="28" cy="22" r="3" fill="#eab308" />
            <circle cx="26" cy="30" r="3" fill="#eab308" />
            <circle cx="27" cy="38" r="3" fill="#eab308" />
            <circle cx="29" cy="46" r="3" fill="#eab308" />
            {/* Kapas (kanan) */}
            <path d="M50 65 Q55 45 48 20" stroke="#16a34a" strokeWidth="2.5" fill="none" />
            <circle cx="51" cy="24" r="4.5" fill="#f8fafc" stroke="#16a34a" strokeWidth="1.5" />
            <circle cx="53" cy="34" r="4.5" fill="#f8fafc" stroke="#16a34a" strokeWidth="1.5" />
            <circle cx="52" cy="44" r="4.5" fill="#f8fafc" stroke="#16a34a" strokeWidth="1.5" />
          </svg>
          <span className="text-xs font-semibold text-stone-900 mt-2">{label || 'Sila Ke-5: Padi dan Kapas'}</span>
        </div>
      );

    case 'tkk_merah_patriotisme':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-rose-50 rounded-xl border border-rose-200 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            {/* Siaga TKK: Inverted Triangle with point at bottom */}
            <polygon points="10,15 70,15 40,70" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
            <circle cx="40" cy="32" r="10" fill="#ffffff" />
            <path d="M35 32 L40 27 L45 32" stroke="#dc2626" strokeWidth="2" fill="none" />
          </svg>
          <span className="text-xs font-semibold text-rose-950 mt-2">{label || 'TKK Siaga: Dasar Merah (Patriotisme & Seni Budaya)'}</span>
        </div>
      );

    case 'tkk_putih_kesehatan':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            {/* Siaga TKK: Inverted Triangle with point at bottom */}
            <polygon points="10,15 70,15 40,70" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            {/* Running / Foot / Cross symbol */}
            <circle cx="40" cy="27" r="4" fill="#0284c7" />
            <path d="M36 34 L40 37 L44 32 L42 45 L38 48" stroke="#0284c7" strokeWidth="2.5" fill="none" />
          </svg>
          <span className="text-xs font-semibold text-slate-800 mt-2">{label || 'TKK Siaga: Dasar Putih (Ketangkasan & Kesehatan)'}</span>
        </div>
      );

    case 'tkk_wajib_berkemah':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-blue-50 rounded-xl border border-blue-200 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            <polygon points="10,15 70,15 40,70" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
            {/* Tent symbol */}
            <polygon points="40,24 25,48 55,48" fill="#ffffff" />
            <polygon points="40,24 40,48 50,48" fill="#e2e8f0" />
            <line x1="37" y1="48" x2="43" y2="48" stroke="#1e293b" strokeWidth="2" />
          </svg>
          <span className="text-xs font-semibold text-blue-950 mt-2">{label || 'TKK Wajib: Berkemah'}</span>
        </div>
      );

    case 'tkk_wajib_menabung':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-amber-50 rounded-xl border border-amber-200 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            <polygon points="10,15 70,15 40,70" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
            {/* Piggy bank / Celengan / Coin */}
            <ellipse cx="40" cy="36" rx="14" ry="10" fill="#ffffff" />
            <rect x="36" y="29" width="8" height="2" fill="#713f12" />
            <circle cx="45" cy="34" r="1.5" fill="#713f12" />
          </svg>
          <span className="text-xs font-semibold text-amber-950 mt-2">{label || 'TKK Wajib: Menabung'}</span>
        </div>
      );

    case 'tkk_wajib_p3k':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200 ${className}`}>
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            <polygon points="10,15 70,15 40,70" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            {/* Red Cross */}
            <rect x="36" y="24" width="8" height="22" fill="#dc2626" />
            <rect x="29" y="31" width="22" height="8" fill="#dc2626" />
          </svg>
          <span className="text-xs font-semibold text-slate-800 mt-2">{label || 'TKK Wajib: P3K (Pertolongan Pertama)'}</span>
        </div>
      );

    case 'simpul_mati':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-amber-50/60 rounded-xl border border-amber-200 ${className}`}>
          <svg viewBox="0 0 100 70" className="w-28 h-18">
            <path d="M15 35 C25 20 40 20 50 35 C60 50 75 50 85 35" stroke="#92400e" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M85 35 C75 20 60 20 50 35 C40 50 25 50 15 35" stroke="#b45309" strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="6 3" />
          </svg>
          <span className="text-xs font-semibold text-amber-950 mt-2">{label || 'Simpul Mati (Menyambung 2 tali sama besar & tidak licin)'}</span>
        </div>
      );

    case 'simpul_hidup':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-amber-50/60 rounded-xl border border-amber-200 ${className}`}>
          <svg viewBox="0 0 100 70" className="w-28 h-18">
            <rect x="45" y="10" width="10" height="50" rx="3" fill="#78350f" />
            <path d="M20 35 Q40 25 50 35 Q60 45 80 35" stroke="#d97706" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="35" r="7" stroke="#b45309" strokeWidth="4" fill="none" />
          </svg>
          <span className="text-xs font-semibold text-amber-950 mt-2">{label || 'Simpul Hidup (Mengikat tiang, mudah dilepas)'}</span>
        </div>
      );

    case 'simpul_anyam':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-amber-50/60 rounded-xl border border-amber-200 ${className}`}>
          <svg viewBox="0 0 100 70" className="w-28 h-18">
            <path d="M15 35 C30 25 35 45 50 35 C65 25 70 45 85 35" stroke="#92400e" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M85 35 C70 15 45 15 30 35" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
          <span className="text-xs font-semibold text-amber-950 mt-2">{label || 'Simpul Anyam (Menyambung 2 tali beda ukuran)'}</span>
        </div>
      );

    case 'simpul_pangkal':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-amber-50/60 rounded-xl border border-amber-200 ${className}`}>
          <svg viewBox="0 0 100 70" className="w-28 h-18">
            <rect x="44" y="8" width="12" height="54" rx="2" fill="#78350f" />
            {/* Cross turn around pole */}
            <line x1="25" y1="28" x2="75" y2="42" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />
            <line x1="25" y1="42" x2="75" y2="28" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="text-xs font-semibold text-amber-950 mt-2">{label || 'Simpul Pangkal (Memulai atau mengakhiri ikatan)'}</span>
        </div>
      );

    case 'simpul_jangkar':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-amber-50/60 rounded-xl border border-amber-200 ${className}`}>
          <svg viewBox="0 0 100 70" className="w-28 h-18">
            <rect x="44" y="8" width="12" height="54" rx="2" fill="#78350f" />
            <path d="M25 28 L75 28" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
            <path d="M25 42 L75 42" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <span className="text-xs font-semibold text-amber-950 mt-2">{label || 'Simpul Jangkar (Membuat tandu / mengikat ember)'}</span>
        </div>
      );

    case 'sandi_angka':
      return (
        <div className={`flex flex-col items-center justify-center p-3 bg-slate-900 text-white rounded-xl border border-slate-700 ${className}`}>
          <div className="font-mono text-center tracking-wider text-amber-400 font-bold text-sm bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
            A=1, B=2, C=3, ... Z=26
          </div>
          <span className="text-xs text-slate-300 mt-2 font-mono">{label || 'Sandi Angka Dasar'}</span>
        </div>
      );

    default:
      return null;
  }
};
