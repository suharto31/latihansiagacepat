import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { PackageNavigator } from './components/PackageNavigator';
import { QuizView } from './components/QuizView';
import { ResultView } from './components/ResultView';
import { AdminPanel } from './components/AdminPanel';
import { KisiKisiView } from './components/KisiKisiView';
import { HistoryView } from './components/HistoryView';
import { GeneratePackageModal } from './components/GeneratePackageModal';
import { storageService } from './services/storage';
import { QuizPackage, QuizSessionResult } from './types';

export default function App() {
  const [packages, setPackages] = useState<QuizPackage[]>([]);
  const [activePackageId, setActivePackageId] = useState<string>('paket-1');
  const [activeTab, setActiveTab] = useState<NavTab>('quiz');
  const [currentResult, setCurrentResult] = useState<QuizSessionResult | null>(null);
  const [history, setHistory] = useState<QuizSessionResult[]>([]);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const loadedPackages = storageService.getPackages();
    setPackages(loadedPackages);
    if (loadedPackages.length > 0) {
      setActivePackageId(loadedPackages[0].id);
    }
    const loadedHistory = storageService.getHistory();
    setHistory(loadedHistory);
  }, []);

  const activePackage =
    packages.find((p) => p.id === activePackageId) || packages[0];

  const handleSelectPackage = (packageId: string) => {
    setActivePackageId(packageId);
    setCurrentResult(null); // Return to quiz view if viewing results
    if (activeTab !== 'quiz' && activeTab !== 'admin') {
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
    setActiveTab('admin');
  };

  const handlePackageGenerated = (newPkg: QuizPackage) => {
    const updated = storageService.addPackage(newPkg);
    setPackages(updated);
    setActivePackageId(newPkg.id);
    setCurrentResult(null);
    setActiveTab('quiz'); // Direct to quiz so they can immediately test the new package!
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

  if (packages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-amber-50/40">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-amber-800 border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold text-stone-700">Memuat Bank Soal Siaga Cepat 2026...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col font-sans">
      {/* Header bar adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'quiz' && currentResult) {
            // keep current view
          }
        }}
        activePackageCode={activePackage?.code}
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

      {/* Generate Package Modal */}
      <GeneratePackageModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        nextPackageNumber={packages.length + 1}
        onPackageGenerated={handlePackageGenerated}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-6 text-xs text-stone-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-stone-700">
            <span className="font-bold text-amber-950">Siaga Cepat 2026</span>
            <span>·</span>
            <span>Kwartir Cabang Gerakan Pramuka Kendal</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold">Tahun 2026</span>
          </div>
          <div className="flex items-center gap-4 text-stone-500">
            <span>Disesuaikan dengan Kisi-kisi Pesta Siaga 50 Butir PG</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('kisikisi')}
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
