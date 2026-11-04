import React, { useState } from 'react';
import { KWARCAB_KENDAL_KISIKISI } from '../data/kisiKisiData';
import { Search, BookOpen, ExternalLink, Filter, CheckCircle2, FileText } from 'lucide-react';

interface KisiKisiViewProps {
  onSelectQuestionNumber?: (no: number) => void;
}

export const KisiKisiView: React.FC<KisiKisiViewProps> = ({ onSelectQuestionNumber }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<string>('all');

  const elements = ['all', ...Array.from(new Set(KWARCAB_KENDAL_KISIKISI.map((k) => k.elemen)))];

  const filteredItems = KWARCAB_KENDAL_KISIKISI.filter((item) => {
    const matchesSearch =
      `${item.no} ${item.elemen} ${item.materi} ${item.indikator}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesElement = selectedElement === 'all' || item.elemen === selectedElement;
    return matchesSearch && matchesElement;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md w-fit mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Dokumen Resmi Kwarcab Kendal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Kisi-Kisi Soal Siaga Cepat (Cerdas dan Tepat)
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Pesta Siaga Kwartir Cabang Kendal Tahun 2026. Memuat 50 nomor butir soal pilihan ganda (PG) terstandarisasi untuk pembinaan dan latihan adik-adik Siaga.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/public/assets/aistudio/kisi_kisi_siaga_pintar_b060bdab.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-800 hover:bg-amber-900 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Buka Dokumen PDF Asli</span>
            </a>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari materi, indikator, kata kunci (misal: Kompas, Toga, Semboyan)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-medium placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-800/20"
            />
          </div>

          {/* Element Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {elements.map((el) => (
              <button
                key={el}
                onClick={() => setSelectedElement(el)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedElement === el
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {el === 'all' ? 'Semua Elemen' : el}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of 50 Indicator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.no}
            className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs hover:border-amber-400 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-stone-100">
                <span className="font-extrabold text-xs px-2 py-0.5 bg-amber-100 text-amber-950 rounded-md">
                  No. {item.no}
                </span>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  {item.bentuk}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-[11px] font-bold text-amber-900/80 block">
                  {item.elemen}
                </span>
                <h3 className="text-sm font-bold text-stone-900">{item.materi}</h3>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                {item.indikator}
              </p>
            </div>

            {onSelectQuestionNumber && (
              <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => onSelectQuestionNumber(item.no)}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Kerjakan di Latihan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
