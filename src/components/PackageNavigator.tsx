import React, { useState } from 'react';
import { QuizPackage } from '../types';
import { Plus, Sparkles, CheckCircle2, Trash2, AlertTriangle } from 'lucide-react';

interface PackageNavigatorProps {
  packages: QuizPackage[];
  activePackageId: string;
  onSelectPackage: (packageId: string) => void;
  onAddPackage: () => void;
  onOpenGenerateModal?: () => void;
  onDeletePackage?: (packageId: string) => void;
}

export const PackageNavigator: React.FC<PackageNavigatorProps> = ({
  packages,
  activePackageId,
  onSelectPackage,
  onAddPackage,
  onOpenGenerateModal,
  onDeletePackage,
}) => {
  const currentPkg = packages.find((p) => p.id === activePackageId) || packages[0];
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="bg-white border-b border-amber-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Scrollable Package Pills / Buttons */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider whitespace-nowrap shrink-0 mr-1">
              Pilih Paket:
            </span>

            {packages.map((pkg, idx) => {
              const isActive = pkg.id === activePackageId;
              return (
                <button
                  key={pkg.id}
                  onClick={() => onSelectPackage(pkg.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-800 text-white shadow-xs ring-2 ring-amber-800/30'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-stone-200/60'
                  }`}
                >
                  <span>{pkg.code || `Paket ${idx + 1}`}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-amber-900 text-amber-200' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {pkg.questions.length} Soal
                  </span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />}
                </button>
              );
            })}

            {/* AI Generate Package Button */}
            {onOpenGenerateModal && (
              <button
                onClick={onOpenGenerateModal}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Generate paket soal baru otomatis dengan Gemini AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Generate Paket</span>
              </button>
            )}

            {/* Quick Add Blank/Template Package Button */}
            <button
              onClick={onAddPackage}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors bg-emerald-50 text-emerald-800 border border-dashed border-emerald-300 hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
              title="Tambah Paket Baru dengan 50 Soal Kisi-Kisi"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>Tambah Manual</span>
            </button>
          </div>

          {/* Tagline / Subtitle */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-stone-500 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Kisi-Kisi Siaga Cepat Kwarcab Kendal 2026 (50 Butir PG)</span>
          </div>
        </div>

        {/* Current Active Package Description Bar */}
        {currentPkg && (
          <div className="mt-2 pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <span className="font-bold text-amber-950">{currentPkg.title}</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-600 line-clamp-1">{currentPkg.subtitle}</span>
            </div>
            <div className="flex items-center gap-3 text-stone-500">
              <span className="text-emerald-700 font-medium">
                Indikator 1 s.d 50 Terpetakan
              </span>

              {/* Delete button directly from description bar if packages > 1 */}
              {packages.length > 1 && onDeletePackage && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-stone-400 hover:text-rose-600 flex items-center gap-1 text-[11px] font-semibold cursor-pointer transition-colors"
                  title="Hapus paket yang sedang aktif ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Paket</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Package Deletion in Navigator */}
      {showDeleteConfirm && currentPkg && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>

            <h3 className="text-lg font-bold text-stone-900 mb-2">
              Hapus {currentPkg.title}?
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus paket "{currentPkg.title}" beserta seluruh {currentPkg.questions.length} butir soal di dalamnya? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeletePackage) {
                    onDeletePackage(currentPkg.id);
                  }
                  setShowDeleteConfirm(false);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors cursor-pointer"
              >
                Ya, Hapus Paket Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
