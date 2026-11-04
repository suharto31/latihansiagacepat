import React from 'react';
import { Award, BookOpen, Clock, Settings, Shield } from 'lucide-react';

export type NavTab = 'quiz' | 'kisikisi' | 'history' | 'admin';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activePackageCode?: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab, activePackageCode }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center font-bold text-lg shadow-sm border border-amber-700/60">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-stone-900 whitespace-nowrap">
                Siaga Cepat Kendal 2026
              </span>
              <span className="text-[11px] font-medium text-amber-800/80 -mt-0.5 whitespace-nowrap hidden sm:inline">
                Pesta Siaga Kwarcab Kendal
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (single line, text with clean active indicator) */}
          <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-stone-600 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => onSelectTab('quiz')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'hover:text-amber-900 hover:bg-stone-100/80'
              }`}
            >
              <Award className="w-4 h-4 text-amber-700" />
              <span>Latihan {activePackageCode || 'Paket'}</span>
            </button>

            <button
              onClick={() => onSelectTab('kisikisi')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                activeTab === 'kisikisi'
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'hover:text-amber-900 hover:bg-stone-100/80'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Kisi-Kisi Resmi</span>
            </button>

            <button
              onClick={() => onSelectTab('history')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'hover:text-amber-900 hover:bg-stone-100/80'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Riwayat Skor</span>
            </button>

            <button
              onClick={() => onSelectTab('admin')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-amber-800 text-white font-semibold'
                  : 'hover:text-amber-900 hover:bg-stone-100/80'
              }`}
            >
              <Settings className="w-4 h-4 text-amber-500" />
              <span>Kelola Soal</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab(activeTab === 'admin' ? 'quiz' : 'admin')}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 bg-stone-900 text-stone-100 hover:bg-stone-800 shadow-xs"
            >
              {activeTab === 'admin' ? 'Kembali ke Soal' : 'Mode Admin'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
