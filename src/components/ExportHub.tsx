import React, { useState } from "react";
import { GeneratedWebsite } from "../types";
import { FolderArchive, Clipboard, CheckCircle, FileCode, Landmark, RefreshCw, Trash2, Code, Plus } from "lucide-react";

interface ExportHubProps {
  currentWebsite: GeneratedWebsite | null;
  onSelectPortfolio: (website: GeneratedWebsite) => void;
  savedSites: GeneratedWebsite[];
  onDeleteSite: (index: number) => void;
  onClearAll: () => void;
}

export default function ExportHub({ currentWebsite, onSelectPortfolio, savedSites, onDeleteSite, onClearAll }: ExportHubProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  const codeBlocks = currentWebsite ? [
    {
      title: "1. Tasarım Değişkenleri (Tailwind & CSS Variables)",
      desc: "Dönüşüm odaklı renk ve font tanımlarını içerir.",
      code: `/* CSS Variables & Theme Definitions */
:root {
  --primary: ${currentWebsite.design.primaryColor};
  --secondary: ${currentWebsite.design.secondaryColor};
  --background: ${currentWebsite.design.backgroundColor};
  --text: ${currentWebsite.design.textColor};
  --font-heading: "${currentWebsite.design.fontFamilyHeading}", sans-serif;
  --font-body: "${currentWebsite.design.fontFamilyBody}", sans-serif;
  --layout-structure: "${currentWebsite.design.layoutStructure}";
}`
    },
    {
      title: "2. Yapılandırılmış Veri Kod Blokları (LocalBusiness Schema)",
      desc: "Teknik SEO için head etiketleri arasına yerleştireceğiniz JSON-LD verisidir.",
      code: `<script type="application/ld+json">
${currentWebsite.seo.structuredDataJson}
</script>`
    },
    {
      title: "3. Sitemap XML Yapısı",
      desc: "Arama motoru dizinine indeks göndermek için sitemap.xml dosyanızın içeriğidir.",
      code: currentWebsite.seo.sitemapXml
    }
  ] : [];

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-none shadow-2xl overflow-hidden p-6 text-slate-300 text-left space-y-6" id="export-hub-container">
      {/* Title */}
      <div className="border-b border-white/10 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#00ff88]">03 // Portfolyo & Çıktı Envanteri</span>
        </div>
        <span className="text-[9px] font-mono tracking-widest text-white/40">OTONOM İHRACAT // EXPORT</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Save Portfolio List (Left side) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0d0d0d] border border-white/5 rounded-none p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest font-mono">Üretilen Müşteri Portföyü</span>
              {savedSites.length > 0 && (
                <button 
                  onClick={onClearAll}
                  className="text-[9px] text-[#00ff88] hover:text-[#00ff88]/80 cursor-pointer uppercase tracking-widest font-mono"
                >
                  Tümünü Sil
                </button>
              )}
            </div>

            {savedSites.length === 0 ? (
              <div className="text-center py-8 text-white/30 text-xs font-mono space-y-2">
                <Landmark className="w-8 h-8 mx-auto text-white/20" />
                <p className="uppercase tracking-widest text-[10px]">Kayıt Yok</p>
                <p className="text-[9px] opacity-75">Otonom bandı çalıştırınca kayıtlar burada toplanır.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {savedSites.map((site, index) => {
                  const isActive = currentWebsite?.companyName === site.companyName;
                  return (
                    <div 
                      key={index}
                      className={`p-3 rounded-none border transition-all flex justify-between items-center gap-2 group ${isActive ? "bg-white text-black border-white" : "bg-[#050505] text-white/80 border-white/10 hover:bg-[#121212] hover:border-white/20"}`}
                    >
                      <button
                        onClick={() => onSelectPortfolio(site)}
                        className="flex-1 text-left cursor-pointer"
                      >
                        <span className="font-bold font-mono text-xs block truncate">{site.companyName}</span>
                        <span className={`text-[9px] block font-mono mt-0.5 truncate uppercase tracking-wider ${isActive ? "text-black/60" : "text-white/40"}`}>{site.sector}</span>
                      </button>
                      <button
                        onClick={() => onDeleteSite(index)}
                        className={`p-1 rounded-none hover:text-rose-500 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer`}
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Ready to Export Code Blocks (Right side) */}
        <div className="lg:col-span-2 space-y-4 bg-[#0d0d0d] border border-white/5 rounded-none p-5">
          <div className="border-b border-white/10 pb-2 flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest font-mono">EXPORT / ENTEGRASYON BLOKLARI</span>
            <span className="text-[9px] text-white/30 uppercase tracking-wider font-mono">Copy & Paste</span>
          </div>

          {!currentWebsite ? (
            <div className="text-center py-16 text-white/30 text-xs font-mono space-y-2">
              <Code className="w-10 h-10 mx-auto text-white/20" />
              <p className="uppercase tracking-wider">Web Sitesi Seçilmedi</p>
              <p className="text-[10px]">Önizleme ve çıktı kodlarını almak için soldaki listeden seçin veya üretimi çalıştırın.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {codeBlocks.map((block, idx) => (
                <div key={idx} className="space-y-2 text-xs bg-[#050505] p-4 rounded-none border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-mono font-bold text-white flex items-center gap-1">
                        {block.title}
                      </h4>
                      <p className="text-[10px] text-white/40 font-sans mt-0.5">{block.desc}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(block.code, `section-${idx}`)}
                      className="bg-white text-black font-mono font-bold uppercase tracking-wider text-[9px] px-2.5 py-1 rounded-none hover:bg-[#00ff88] transition-colors cursor-pointer shrink-0"
                    >
                      {copiedSection === `section-${idx}` ? "Kopyalandı!" : "Kopyala"}
                    </button>
                  </div>
                  <pre className="bg-[#0a0a0a] border border-white/5 text-white/80 text-[10px] p-3 rounded-none overflow-x-auto font-mono max-h-40 line-clamp-4 select-all">
                    {block.code}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
