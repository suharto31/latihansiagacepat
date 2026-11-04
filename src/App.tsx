import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { PackageNavigator } from './components/PackageNavigator';
import { QuizView } from './components/QuizView';
import { ResultView } from './components/ResultView';
import { AdminPanel } from './components/AdminPanel';
import { KisiKisiView } from './components/KisiKisiView';
import { HistoryView } from './components/HistoryView';
import { GeneratePackageModal } from './components/GeneratePackageModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { storageService } from './services/storage';
import { DEFAULT_PACKAGES } from './data/defaultPackages';
import { QuizPackage, QuizSessionResult } from './types';
import { HelpCircle, CheckCircle2, Github, ExternalLink, X } from 'lucide-react';

export default function App() {
  // Synchronous state initialization ensures no white flash or loading deadlocks
  const [packages, setPackages] = useState<QuizPackage[]>(() => {
    try {
      const loaded = storageService.getPackages();
      return loaded && loaded.length > 0 ? loaded : DEFAULT_PACKAGES;
    } catch {
      return DEFAULT_PACKAGES;
    }
  });

  const [activePackageId, setActivePackageId] = useState<string>(() => {
    try {
      const loaded = storageService.getPackages();
      return loaded && loaded.length > 0 ? loaded[0].id : 'paket-1';
    } catch {
      return 'paket-1';
    }
  });

  const [activeTab, setActiveTab] = useState<NavTab>('quiz');
  const [currentResult, setCurrentResult] = useState<QuizSessionResult | null>(null);
  const [history, setHistory] = useState<QuizSessionResult[]>(() => {
    try {
      return storageService.getHistory();
    } catch {
      return [];
    }
  });

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('siaga_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [showGithubHelpModal, setShowGithubHelpModal] = useState(false);

  // Sync to ensure active package exists
  const activePackage =
    packages.find((p) => p.id === activePackageId) || packages[0] || DEFAULT_PACKAGES[0];

  const handleSelectPackage = (packageId: string) => {
    setActivePackageId(packageId);
    setCurrentResult(null);
    if (activeTab !== 'quiz' && activeTab !== 'admin') {
      setActiveTab('quiz');
    }
  };

  const handleTabChange = (targetTab: NavTab) => {
    if (targetTab === 'admin') {
      if (isAdminAuthenticated) {
        setActiveTab('admin');
      } else {
        // Prompt password modal
        setIsAdminAuthModalOpen(true);
      }
    } else {
      setActiveTab(targetTab);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem('siaga_admin_auth', 'true');
    } catch {
      // ignore
    }
    setIsAdminAuthModalOpen(false);
    setActiveTab('admin');
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('siaga_admin_auth');
    } catch {
      // ignore
    }
    if (activeTab === 'admin') {
      setActiveTab('quiz');
    }
  };

  const handleAddManualPackage = () => {
    const nextNumber = packages.length + 1;
    const newPkg = storageService.createNewPackageFromKisiKisi(nextNumber);
    const updated = storageService.addPackage(newPkg);
    setPackages(updated);
    setActivePackageId(newPkg.id);
    setCurrentResult(null);
    handleTabChange('admin');
  };

  const handlePackageGenerated = (newPkg: QuizPackage) => {
    const updated = storageService.addPackage(newPkg);
    setPackages(updated);
    setActivePackageId(newPkg.id);
    setCurrentResult(null);
    setActiveTab('quiz');
  };

  const handleUpdatePackage = (updatedPkg: QuizPackage) => {
    const updated = storageService.updatePackage(updatedPkg);
    setPackages(updated);
  };

  const handleDeletePackage = (packageId: string) => {
    const updated = storageService.deletePackage(packageId);
    setPackages(updated);
    if (activePackageId === packageId && updated.length > 0) {
      setActivePackageId(updated[0].id);
      setCurrentResult(null);
    }
  };

  const handleResetDefault = () => {
    const resetPkgs = storageService.resetToDefault();
    setPackages(resetPkgs);
    if (resetPkgs.length > 0) {
      setActivePackageId(resetPkgs[0].id);
      setCurrentResult(null);
    }
  };

  const handleFinishQuiz = (result: QuizSessionResult) => {
    setCurrentResult(result);
    const updatedHistory = storageService.saveHistory(result);
    setHistory(updatedHistory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeQuiz = () => {
    setCurrentResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNextPackage = () => {
    const currentIndex = packages.findIndex((p) => p.id === activePackageId);
    if (currentIndex >= 0 && currentIndex < packages.length - 1) {
      const nextPkg = packages[currentIndex + 1];
      setActivePackageId(nextPkg.id);
      setCurrentResult(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearHistory = () => {
    storageService.clearHistory();
    setHistory([]);
  };

  const handleExportJSON = () => {
    const jsonStr = storageService.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kisi_kisi_siaga_kendal_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (jsonStr: string) => {
    const res = storageService.importDatabaseJSON(jsonStr);
    if (res.success) {
      const updated = storageService.getPackages();
      setPackages(updated);
      if (updated.length > 0) {
        setActivePackageId(updated[0].id);
        setCurrentResult(null);
      }
    }
    return res;
  };

  const handleSelectQuestionNumberFromKisiKisi = (no: number) => {
    setActiveTab('quiz');
    setCurrentResult(null);
  };

  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col font-sans">
      {/* Header bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        activePackageCode={activePackage?.code}
        isAdminAuthenticated={isAdminAuthenticated}
        onLogoutAdmin={handleLogoutAdmin}
      />

      {/* Package Navigator visible in Quiz & Admin tabs */}
      {(activeTab === 'quiz' || activeTab === 'admin') && (
        <PackageNavigator
          packages={packages}
          activePackageId={activePackageId}
          onSelectPackage={handleSelectPackage}
          onAddPackage={handleAddManualPackage}
          onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
          onDeletePackage={handleDeletePackage}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'quiz' && (
          <>
            {currentResult ? (
              <ResultView
                result={currentResult}
                quizPackage={activePackage}
                onRetakeQuiz={handleRetakeQuiz}
                onSelectNextPackage={
                  packages.findIndex((p) => p.id === activePackageId) < packages.length - 1
                    ? handleSelectNextPackage
                    : undefined
                }
                onBackToPackages={() => setCurrentResult(null)}
              />
            ) : (
              <QuizView
                quizPackage={activePackage}
                onFinishQuiz={handleFinishQuiz}
                onSwitchPackage={() => setActiveTab('quiz')}
              />
            )}
          </>
        )}

        {activeTab === 'kisikisi' && (
          <KisiKisiView onSelectQuestionNumber={handleSelectQuestionNumberFromKisiKisi} />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onClearHistory={handleClearHistory}
            onReviewResult={(item) => {
              setCurrentResult(item);
              setActiveTab('quiz');
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            packages={packages}
            activePackageId={activePackageId}
            onSelectPackage={setActivePackageId}
            onUpdatePackage={handleUpdatePackage}
            onAddPackage={handleAddManualPackage}
            onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
            onDeletePackage={handleDeletePackage}
            onResetDefault={handleResetDefault}
            onExportJSON={handleExportJSON}
            onImportJSON={handleImportJSON}
          />
        )}
      </main>

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Generate Package Modal */}
      <GeneratePackageModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        nextPackageNumber={packages.length + 1}
        onPackageGenerated={handlePackageGenerated}
      />

      {/* GitHub Pages Setup Guide Modal */}
      {showGithubHelpModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-stone-900" />
                <h3 className="text-base font-bold text-stone-900">
                  Panduan Deploy GitHub Pages Anti-Blank
                </h3>
              </div>
              <button
                onClick={() => setShowGithubHelpModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
              <p>
                Jika di GitHub Pages hanya muncul animasi <em>loading</em> terus-menerus atau blank putih, penyebabnya adalah GitHub Pages membuka berkas mentah <code>/src/main.tsx</code> bukannya berkas kompilasi yang siap pakai.
              </p>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-medium">
                <span className="font-bold text-emerald-900 block mb-1">Cara 1 (Paling Mudah &amp; Cepat - Folder /docs):</span>
                1. Buka Repositori Anda di GitHub.<br />
                2. Klik <strong>Settings</strong> &gt; menu <strong>Pages</strong>.<br />
                3. Pada <em>Source</em>: pilih <strong>Deploy from a branch</strong>.<br />
                4. Pada <em>Branch</em>: pilih <strong>main</strong> (atau <strong>master</strong>) dan pilih folder <strong>/docs</strong> (bukan /root).<br />
                5. Klik <strong>Save</strong>. Web akan aktif normal dalam hitungan detik!
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-medium">
                <span className="font-bold text-amber-900 block mb-1">Cara 2 (Otomatis via GitHub Actions):</span>
                1. Pada <em>Settings &gt; Pages &gt; Source</em>: pilih <strong>GitHub Actions</strong>.<br />
                2. GitHub akan otomatis menjalankan berkas alur kerja <code>.github/workflows/deploy.yml</code> yang sudah disiapkan untuk mengompilasi folder <code>dist/</code>.
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-100 mt-4">
              <button
                onClick={() => setShowGithubHelpModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-6 text-xs text-stone-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-stone-700">
            <span className="font-bold text-amber-950">Siaga Cepat 2026</span>
            <span>·</span>
            <span>Kwartir Cabang Gerakan Pramuka Kendal</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold">Durasi: 25 Menit</span>
          </div>
          <div className="flex items-center gap-4 text-stone-500">
            <button
              onClick={() => setShowGithubHelpModal(true)}
              className="text-stone-600 hover:text-amber-900 underline flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Bantuan Deploy GitHub Pages</span>
            </button>
            <span>·</span>
            <button
              onClick={() => handleTabChange('kisikisi')}
              className="text-amber-800 hover:underline cursor-pointer"
            >
              Lihat Kisi-kisi
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
