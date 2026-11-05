import { Award, BookOpen, Clock, Settings, Shield, Lock, Unlock, UserCheck, User } from 'lucide-react';
import { Participant } from '../types';

export type NavTab = 'quiz' | 'kisikisi' | 'history' | 'admin';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activePackageCode?: string;
  isAdminAuthenticated?: boolean;
  onLogoutAdmin?: () => void;
  participant: Participant | null;
  onOpenLoginModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  activePackageCode,
  isAdminAuthenticated = false,
  onLogoutAdmin,
  participant,
  onOpenLoginModal,
}) => {
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

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-stone-600 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => onSelectTab('quiz')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-amber-800 text-white font-semibold'
                  : 'hover:text-amber-900 hover:bg-stone-100/80'
              }`}
            >
              {isAdminAuthenticated ? (
                <Unlock className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-4 h-4 text-stone-400" />
              )}
              <span>Kelola Soal</span>
            </button>
          </nav>

          {/* Zone 3: Participant Profile & Admin Mode */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Participant Pill Button */}
            {participant ? (
              <button
                onClick={onOpenLoginModal}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-950 border border-amber-200 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                title="Klik untuk mengubah identitas peserta"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
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
                        ? '#cbd5e1'
                        : participant.warnaBarung === 'hitam'
                        ? '#1e293b'
                        : '#22c55e',
                  }}
                />
                <span className="max-w-[120px] sm:max-w-[160px] truncate font-bold text-[11px] sm:text-xs">
                  {participant.nama}
                </span>
                <span className="text-[10px] text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded-md font-medium hidden sm:inline">
                  {participant.barung}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Login Peserta</span>
              </button>
            )}

            {isAdminAuthenticated && activeTab === 'admin' ? (
              <button
                onClick={onLogoutAdmin}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 cursor-pointer flex items-center gap-1"
                title="Kunci kembali mode admin"
              >
                <Lock className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Kunci</span>
              </button>
            ) : null}

            <button
              onClick={() => onSelectTab(activeTab === 'admin' ? 'quiz' : 'admin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-amber-800 text-white hover:bg-amber-900 shadow-xs'
                  : 'bg-stone-800 text-stone-100 hover:bg-stone-900 shadow-xs'
              }`}
            >
              {activeTab === 'admin' ? (
                'Kembali'
              ) : (
                <>
                  <Lock className="w-3 h-3 text-stone-400" />
                  <span className="hidden sm:inline">Mode Admin</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
