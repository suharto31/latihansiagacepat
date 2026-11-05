import React, { useState } from 'react';
import { Participant } from '../types';
import { UserCheck, Shield, School, MapPin, Sparkles, X, ChevronDown } from 'lucide-react';

interface ParticipantLoginModalProps {
  isOpen: boolean;
  currentParticipant: Participant | null;
  onClose?: () => void;
  onLogin: (participant: Participant) => void;
  requiredBeforeQuiz?: boolean;
}

const BARUNG_COLORS = [
  { name: 'Barung Merah', color: 'merah', hex: '#ef4444', ring: 'ring-red-400' },
  { name: 'Barung Hijau', color: 'hijau', hex: '#22c55e', ring: 'ring-green-400' },
  { name: 'Barung Kuning', color: 'kuning', hex: '#eab308', ring: 'ring-yellow-400' },
  { name: 'Barung Biru', color: 'biru', hex: '#3b82f6', ring: 'ring-blue-400' },
  { name: 'Barung Cokelat', color: 'cokelat', hex: '#854d0e', ring: 'ring-amber-700' },
  { name: 'Barung Putih', color: 'putih', hex: '#f8fafc', border: '#cbd5e1', ring: 'ring-slate-300' },
  { name: 'Barung Hitam', color: 'hitam', hex: '#1e293b', ring: 'ring-slate-700' },
];

const KWARRAN_KENDAL = [
  'Kwarran Kendal',
  'Kwarran Pegandon',
  'Kwarran Weleri',
  'Kwarran Patebon',
  'Kwarran Cepiring',
  'Kwarran Kaliwungu',
  'Kwarran Kaliwungu Selatan',
  'Kwarran Brangsong',
  'Kwarran Boja',
  'Kwarran Limbangan',
  'Kwarran Singorojo',
  'Kwarran Sukorejo',
  'Kwarran Pageruyung',
  'Kwarran Patean',
  'Kwarran Plantungan',
  'Kwarran Ringinarum',
  'Kwarran Ngampel',
  'Kwarran Kangkung',
  'Kwarran Rowosari',
  'Kwarran Gemuh'
];

export const ParticipantLoginModal: React.FC<ParticipantLoginModalProps> = ({
  isOpen,
  currentParticipant,
  onClose,
  onLogin,
  requiredBeforeQuiz = false,
}) => {
  const [nama, setNama] = useState(currentParticipant?.nama || '');
  const [selectedBarung, setSelectedBarung] = useState(
    currentParticipant?.barung || 'Barung Hijau'
  );
  const [selectedWarna, setSelectedWarna] = useState(
    currentParticipant?.warnaBarung || 'hijau'
  );
  const [pangkalan, setPangkalan] = useState(currentParticipant?.pangkalan || '');
  const [kwarran, setKwarran] = useState(
    currentParticipant?.kwarran || 'Kwarran Kendal'
  );
  const [noPeserta, setNoPeserta] = useState(currentParticipant?.noPeserta || '');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg('Silakan isi Nama Lengkap atau Panggilan Peserta.');
      return;
    }
    if (!pangkalan.trim()) {
      setErrorMsg('Silakan isi Asal Sekolah / Pangkalan Gugusdepan.');
      return;
    }

    const participant: Participant = {
      nama: nama.trim(),
      barung: selectedBarung,
      warnaBarung: selectedWarna,
      pangkalan: pangkalan.trim(),
      kwarran,
      noPeserta: noPeserta.trim() || undefined,
    };

    setErrorMsg('');
    onLogin(participant);
  };

  const handleSelectBarung = (item: typeof BARUNG_COLORS[0]) => {
    setSelectedBarung(item.name);
    setSelectedWarna(item.color);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header Modal */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-xs shrink-0">
              <UserCheck className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-stone-900 tracking-tight">
                  Identitas Peserta Siaga
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  Wajib Diisi
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Masukkan data diri adik Siaga sebelum mengerjakan latihan soal
              </p>
            </div>
          </div>

          {!requiredBeforeQuiz && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Nama Lengkap Peserta / Barung <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Contoh: Muhammad Rizky / Barung Hijau Putra"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-stone-50/50"
              autoFocus
            />
          </div>

          {/* 2. Pilihan Barung (Visual Color Selector) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Pilihan Barung & Warna <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BARUNG_COLORS.map((b) => {
                const isSelected = selectedBarung === b.name;
                return (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => handleSelectBarung(b)}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50/70 text-amber-950 ring-2 ring-amber-700/30 font-bold shadow-xs'
                        : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{
                        backgroundColor: b.hex,
                        border: b.border ? `1px solid ${b.border}` : 'none',
                      }}
                    />
                    <span className="truncate text-[11px]">{b.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Asal Sekolah / Pangkalan */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Pangkalan / Asal Sekolah (Gugusdepan) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <School className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={pangkalan}
                onChange={(e) => {
                  setPangkalan(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Contoh: SDN 2 Ringinarum/ SD IT Robbi Rodhiya"
                className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-stone-50/50"
              />
            </div>
          </div>

          {/* 4. Kwarran & Nomor Peserta (2 Kolom) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Kwartir Ranting (Kecamatan)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <select
                  value={kwarran}
                  onChange={(e) => setKwarran(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-stone-50/50 appearance-none cursor-pointer"
                >
                  {KWARRAN_KENDAL.map((kw) => (
                    <option key={kw} value={kw}>
                      {kw}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Nomor Dada / Peserta (Opsional)
              </label>
              <input
                type="text"
                value={noPeserta}
                onChange={(e) => setNoPeserta(e.target.value)}
                placeholder="Contoh: 01-PA / 08-PI"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-stone-50/50"
              />
            </div>
          </div>

          {/* Banner Info Piagam */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/90 rounded-2xl flex items-center gap-2.5 text-[11px] text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Nama, Barung, dan Pangkalan Anda akan otomatis tercetak di <strong>Piagam Hasil Latihan Siaga Cepat</strong> setelah selesai.
            </span>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            {!requiredBeforeQuiz && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Simpan Identitas & Mulai Soal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
