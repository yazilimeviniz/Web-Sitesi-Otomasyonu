import React, { useState, useEffect } from "react";
import { ClientMatrixInput, GeneratedWebsite } from "./types";
import CreateMatrixForm from "./components/CreateMatrixForm";
import OrchestratorLogs from "./components/OrchestratorLogs";
import WebsitePreview from "./components/WebsitePreview";
import ExportHub from "./components/ExportHub";
import { Sparkles, Terminal, Activity, FileCode, CheckCircle2, ShieldAlert, BadgeInfo, Zap, Layers, Globe } from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentWebsite, setCurrentWebsite] = useState<GeneratedWebsite | null>(null);
  const [savedSites, setSavedSites] = useState<GeneratedWebsite[]>([]);
  const [activeSource, setActiveSource] = useState<string>("");
  const [showManifest, setShowManifest] = useState(true);

  // Initialize and load saved clients from localStorage on startup
  useEffect(() => {
    try {
      const persisted = localStorage.getItem("otonom-web-saveds");
      if (persisted) {
        const parsed = JSON.parse(persisted);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedSites(parsed);
          setCurrentWebsite(parsed[0]);
          setActiveSource("Çevrimdışı Portfolyo Sunucusu");
        }
      }
    } catch (err) {
      console.error("Failed to load saved portfolios:", err);
    }
  }, []);

  const handleGenerateWebsite = async (input: ClientMatrixInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const payload = await response.json();
      if (payload.success && payload.data) {
        const generated: GeneratedWebsite = payload.data;
        setCurrentWebsite(generated);
        setActiveSource(payload.source === "gemini-3.5-flash-intelligence" ? "🤖 Gemini Pro-Intel AI" : "⚙️ Otonom Lokal Şablon Mekanizması");

        // Save layout structure to saved list and update local storage
        const updatedList = [generated, ...savedSites.filter(site => site.companyName !== generated.companyName)];
        setSavedSites(updatedList);
        localStorage.setItem("otonom-web-saveds", JSON.stringify(updatedList));
      } else {
        console.error("Production response was unsuccessful", payload);
      }
    } catch (error) {
      console.error("Autonomous production line error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPortfolioItem = (site: GeneratedWebsite) => {
    setCurrentWebsite(site);
    setActiveSource("Çevrimdışı Portfolyo Sunucusu");
  };

  const deleteSite = (index: number) => {
    const updated = savedSites.filter((_, i) => i !== index);
    setSavedSites(updated);
    localStorage.setItem("otonom-web-saveds", JSON.stringify(updated));
    if (currentWebsite && savedSites[index] && currentWebsite.companyName === savedSites[index].companyName) {
      setCurrentWebsite(updated[0] || null);
    }
  };

  const clearAllSites = () => {
    setSavedSites([]);
    localStorage.removeItem("otonom-web-saveds");
    setCurrentWebsite(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans p-4 sm:p-6 md:p-8 border-4 md:border-8 border-[#1a1a1a]" id="app-workspace-root">
      
      {/* Top Professional Admin Bar */}
      <header className="flex flex-col lg:flex-row justify-between lg:items-end border-b border-white/10 pb-6 mb-8 gap-4">
        <div className="flex items-center gap-3.5 group">
          <div className="relative flex items-center justify-center w-12 h-12 bg-zinc-950 border border-white/15 rounded-xl shadow-lg transition-all duration-300">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2005/svg">
              {/* Glowing Code Roof (House structure) */}
              <path d="M6 16L16 6L26 16" stroke="url(#logo-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              
              {/* Laptop/Screen base representing "Software" (Yazılım) under the roof (Eviniz) */}
              <rect x="9" y="15" width="14" height="9" rx="1.5" stroke="url(#logo-grad)" strokeWidth="2" fill="#090d16" />
              <path d="M7 25H25" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
              
              {/* Clean glowing "Y" letter contour inside the screen */}
              <path d="M13 18L16 20L19 18" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 20V22" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round"/>

              <defs>
                <linearGradient id="logo-grad" x1="16" y1="6" x2="16" y2="25" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00ff88" />
                  <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff88] to-[#3b82f6] rounded-xl opacity-20 blur-[2px] -z-10 animate-pulse"></div>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-baseline gap-2">
              <span className="text-[19px] sm:text-[22px] font-black tracking-[-0.03em] text-white uppercase font-sans">
                YAZILIM<span className="text-zinc-400 font-light">EVİNİZ</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.15em] text-[#00ff88] bg-[#00ff88]/10 px-2 py-0.5 border border-[#00ff88]/20 uppercase font-bold">
                OTONOM
              </span>
            </div>
            <p className="text-[9px] text-white/40 tracking-[0.2em] uppercase mt-0.5 font-mono">Yazılım Eviniz Yapay Zeka Dijital Ajans Üretim Bandı</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[11px] tracking-widest uppercase font-mono text-white/60">
          <div>Sistem Durumu: <span className="text-[#00ff88] font-bold">Aktif</span></div>
          <div>Aktif Portfolyo: <span className="text-white font-bold">{savedSites.length}</span></div>
          <div>SEO Skoru: <span className="text-[#00ff88] font-bold">%100</span></div>
          <div>Model: <span className="text-[#00ff88] font-bold">Gemini Pro-Intel</span></div>
          <div>Versiyon: <span className="text-white/40">4.0.2</span></div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto space-y-6">

        {/* Agency Manifesto Banner (Kullanıcı Vizyonu & Projenin Özü) */}
        {showManifest && (
          <div className="bg-[#0d0d0d] border border-white/10 p-8 relative rounded-none overflow-hidden text-left shadow-2xl" id="manifest-banner">
            <button 
              onClick={() => setShowManifest(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1 transition-all font-mono text-xs border border-white/10 hover:border-white/30 px-2 py-0.5 tracking-wider uppercase"
              title="Manifestoyu Gizle"
            >
              Kapat ✕
            </button>
            <div className="absolute -top-4 right-8 opacity-5 font-serif italic text-8xl pointer-events-none select-none">
              Manifesto
            </div>
            <div className="max-w-4xl relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#00ff88]"></span>
                <span className="text-[10px] uppercase font-mono text-[#00ff88] tracking-widest font-bold">00 // STRATEJİK VİZYON MANİFESTOSU</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl italic leading-relaxed text-white relative z-10 underline underline-offset-8 decoration-white/10">
                "İnsan vizyonu kurar, yapay zeka tuğlaları dizer."
              </h3>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-light font-sans max-w-3xl">
                Operasyonel yükü sıfıra indiren bir üretim bandı. Kararsız kalınan veya boş bırakılan tüm alanlarda kurumsal zeka devreye girerek dönüşüm oranı en yüksek renk, font ve yerleşim kararlarını otonom verir. Teknik SEO standartları arka planda otomatik yapılandırılır. Kod ameleliği bitti, otonom çağ başladı.
              </p>
            </div>
            {/* Minimal neon accent details */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00ff88] to-transparent"></div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Creator inputs and settings (xl:col-span-5) */}
          <div className="xl:col-span-5 space-y-6">
            
            {/* Input Form Card */}
            <CreateMatrixForm onSubmit={handleGenerateWebsite} isLoading={isLoading} />
            
            {/* Stratejik Kurgu ve AI Seçim Bilgilendirmesi */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-left space-y-3">
              <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                Akıllı "AI Seçsin" Algoritması
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Giriş matrisinde herhangi bir kriter belirtmediğinizde veya <strong>"🤖 AI Seçsin"</strong> seçeneğini bıraktığınızda sistem, firmanın sektörünü analiz ederek en yüksek dönüşüm getiren renk paletini, sektörel UX tasarım şemasını ve hedef kitle metodolojisini otonom hesaplar ve uygular.
              </p>
              <div className="grid grid-cols-3 gap-2.5 pt-1.5 text-center text-[10px] font-mono font-bold text-slate-300">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="block text-indigo-400 text-xs font-extrabold">%0</span>
                  Kod Ameleliği
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="block text-teal-400 text-xs font-extrabold">%100</span>
                  Teknik SEO
                </div>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="block text-amber-500 text-xs font-extrabold">&lt;15sn</span>
                  Otonom Süre
                </div>
              </div>
            </div>

            {/* Orchestrator Logs monitor (Only seen/placed on the left when we are busy or logs have messages) */}
            <OrchestratorLogs 
              logs={currentWebsite?.aiOrchestratorLogs || []} 
              isLoading={isLoading} 
              source={activeSource}
            />
          </div>

          {/* Right Column: Visual output, responsive previews and asset exports (xl:col-span-7) */}
          <div className="xl:col-span-7 space-y-6">
            
            {/* Visual preview or placeholder */}
            {currentWebsite ? (
              <WebsitePreview 
                website={currentWebsite} 
                whatsappEnabled={currentWebsite.resolvedWhatsappType !== undefined && currentWebsite.resolvedWhatsappType !== ("none" as any)}
                leadFormEnabled={true}
                newsletterEnabled={true}
              />
            ) : (
              <div className="bg-slate-950 border border-dashed border-slate-800 rounded-3xl p-16 text-center text-slate-500 min-h-[500px] flex flex-col justify-center items-center space-y-4 shadow-inner" id="visual-preview-placeholder">
                <div className="w-16 h-16 rounded-2xl bg-slate-900/60 flex items-center justify-center text-slate-700 border border-slate-800/80 animate-pulse">
                  <Layers className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-base font-bold text-slate-300 font-sans">Üretim Önizleme Platformu Boş Korumada</h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    Soldaki Müşteri Talep Matrisini doldurup otonom motoru çalıştırdığınızda, yapay zekanın tasarladığı ve kodla ördüğü yüksek dönüşümlü canlı web sitesi bu panel üzerinde responsive viewports seçimi ile görünecektir.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] bg-slate-900 text-slate-400 px-3 py-1 rounded-md font-mono">Bekliyor: canli-onizleme-hub</span>
                </div>
              </div>
            )}

            {/* Copy code files, structured schemas and sitemap export hub */}
            <ExportHub 
              currentWebsite={currentWebsite} 
              onSelectPortfolio={selectPortfolioItem}
              savedSites={savedSites}
              onDeleteSite={deleteSite}
              onClearAll={clearAllSites}
            />

          </div>

        </div>

      </main>

      {/* Workspace Footer */}
      <footer className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center bg-transparent gap-4">
        <div className="flex gap-8 text-left">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/30 uppercase tracking-widest">Render Motoru</span>
            <span className="text-xs font-mono text-white/80">Gemini Core v4</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-white/30 uppercase tracking-widest">Görsel Format</span>
            <span className="text-xs font-mono text-[#00ff88]">Auto-WebP</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-white/30 uppercase tracking-widest">Sitemap Status</span>
            <span className="text-xs font-mono text-[#00ff88]">Generated</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-white/30 uppercase tracking-widest">SEO Altyapısı</span>
            <span className="text-xs font-mono text-white/80">JSON-LD / Schema</span>
          </div>
        </div>
        <div className="text-[10px] text-white/20 italic font-serif tracking-widest text-right">
          Maksimum Performans, Sıfır Amelelik. © 2026
        </div>
      </footer>

    </div>
  );
}
