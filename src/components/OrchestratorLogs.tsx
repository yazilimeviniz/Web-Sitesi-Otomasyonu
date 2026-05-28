import React, { useState, useEffect } from "react";
import { Terminal, Check, ShieldCheck, Activity, Cpu, Sparkles } from "lucide-react";

interface LogMessage {
  role: string;
  message: string;
  timestamp: string;
}

interface OrchestratorLogsProps {
  logs: LogMessage[];
  isLoading: boolean;
  source?: string;
}

export default function OrchestratorLogs({ logs, isLoading, source }: OrchestratorLogsProps) {
  const [visibleLogs, setVisibleLogs] = useState<LogMessage[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setVisibleLogs([]);
      setCurrentProgress(5);
      
      // Simulating a fast progressing terminal in load state
      const interval = setInterval(() => {
        setCurrentProgress(prev => (prev < 90 ? prev + 15 : prev));
      }, 500);

      return () => clearInterval(interval);
    } else {
      setCurrentProgress(100);
      // When done, show log messages immediately
      setVisibleLogs(logs);
    }
  }, [isLoading, logs]);

  // Map roles to distinctive color chips
  const getRoleStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case "ux analyst":
        return "bg-teal-500/10 text-teal-300 border border-teal-500/20";
      case "creative director":
        return "bg-amber-400/10 text-amber-300 border border-amber-400/20";
      case "copywriter":
        return "bg-emerald-500/10 text-[#00ff88] border border-[#00ff88]/20";
      case "seo specialist":
        return "bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/25";
      case "developer team":
        return "bg-rose-500/10 text-rose-300 border border-rose-500/20";
      default:
        return "bg-white/5 text-white/60 border border-white/15";
    }
  };

  const complianceStandards = [
    { title: "Sektörel Dönüşüm (CRO) Analizi", desc: "Müşteri ve hedef kitle eşleştirme formülü" },
    { title: "Mobil Uyumluluk & Grid Yerleşimi", desc: "Tüm cihazlara duyarlı CSS esnek yapısı" },
    { title: "JSON-LD Yapılandırılmış Veri", desc: "Google Schema saniyeler içinde entegre" },
    { title: "WebP Format Dönüştürücü", desc: "Hız optimizasyonu için verimli görsel altyapısı" },
    { title: "Otomatik Xml Sitemap Derleyicisi", desc: "Arama botları için hazır optimizasyon haritası" },
  ];

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-none shadow-2xl overflow-hidden p-6 font-mono text-slate-300 text-left" id="orchestrator-logs-panel">
      {/* Terminal Title Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block"></span>
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
            <span className="w-2.5 h-2.5 bg-[#00ff88] rounded-full inline-block"></span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-[#00ff88]">02 // Otonom Ajans Günlükleri</span>
          </div>
        </div>
        <div className="text-[10px] text-white/40 flex items-center gap-2 font-mono">
          <Activity className="w-3.5 h-3.5 text-[#00ff88]" />
          <span>PORT: 3000 // INGRESS: LIVE</span>
        </div>
      </div>

      {/* Progress Monitor */}
      <div className="mb-6 bg-[#0d0d0d] border border-white/5 rounded-none p-4">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-white/60 flex items-center gap-1.5 font-bold uppercase font-mono tracking-wider text-[11px]">
            <Cpu className="w-4 h-4 text-[#00ff88]" />
            Bant Motoru Hızı:
          </span>
          <span className="text-[#00ff88] font-mono font-bold text-[11px]">{currentProgress}% {isLoading ? "ÜRETİLİYOR..." : "TAMAMLANDI"}</span>
        </div>
        <div className="w-full bg-[#050505] h-1.5 rounded-none overflow-hidden border border-white/5">
          <div 
            className="bg-gradient-to-r from-[#00ff88]/20 via-[#00ff88]/80 to-[#00ff88] h-full transition-all duration-300"
            style={{ width: `${currentProgress}%` }}
          ></div>
        </div>
        {source && !isLoading && (
          <div className="mt-2 text-[10px] text-white/30 flex items-center justify-between font-mono">
            <span>Zeka Kaynağı: <strong className="text-white font-mono">{source}</strong></span>
            <span>Uptime: %100</span>
          </div>
        )}
      </div>

      {/* Terminal Output */}
      <div className="bg-[#050505] border border-white/10 rounded-none p-4 h-64 overflow-y-auto space-y-3 text-xs text-left font-mono">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-3">
            <Cpu className="w-8 h-8 text-[#00ff88] animate-spin" />
            <div className="text-center font-bold font-mono">
              <p className="text-[#00ff88] text-xs uppercase tracking-widest text-[11px]">Yapay Zeka Destekli Üretim Sürüyor...</p>
              <p className="text-[10px] text-white/30 mt-1 uppercase">Sektörel dönüm noktaları taranıyor • Görseller WebP formatına çevriliyor</p>
            </div>
          </div>
        ) : visibleLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40 font-mono">
            <div className="text-center">
              <p className="font-bold text-white/80 uppercase tracking-widest">Üretim Hattı Beklemede</p>
              <p className="text-[10px] text-white/30 mt-1.5 uppercase">Müşteri taleplerini ayarlayıp otonom üretimi tetikleyin.</p>
            </div>
          </div>
        ) : (
          visibleLogs.map((log, idx) => (
            <div key={idx} className="border-b border-white/5 pb-2.5 last:border-0 last:pb-0 font-mono animate-fadeIn">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] text-white/30">[{log.timestamp}]</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-none font-bold uppercase tracking-wide font-mono ${getRoleStyle(log.role)}`}>
                  {log.role}
                </span>
                <span className="text-[9px] text-[#00ff88]/80 font-mono">✓ PROCESS ON</span>
              </div>
              <p className="text-white/80 pl-1 font-sans text-xs leading-relaxed">{log.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Autonomous Compliances checklist */}
      <div className="mt-6 border-t border-white/10 pt-5 text-left">
        <h3 className="text-[10px] uppercase font-mono tracking-widest text-white/40 mb-3 flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#00ff88]" />
          OTONOM AJANS ENTEGRASYON STANDARTLARI
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {complianceStandards.map((st, idx) => (
            <div key={idx} className="flex gap-2.5 bg-[#0d0d0d] p-3 rounded-none border border-white/5">
              <div className="w-4 h-4 rounded-none bg-[#00ff88]/10 border border-[#00ff88]/40 text-[#00ff88] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                ✓
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-white block">{st.title}</span>
                <span className="text-[10px] text-white/40 block font-sans">{st.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
