import React, { useState, useEffect } from "react";
import { GeneratedWebsite, BlogPost, ProductItem, GalleryItem, GoogleReview } from "../types";
import { 
  Monitor, Smartphone, Tablet, ExternalLink, Globe, Clipboard, Check, 
  Send, Sparkles, AlertTriangle, Eye, ArrowRight, X, Phone, MessageSquare,
  Search, FileCode, CheckCheck, Landmark, ShieldCheck, HeartPulse, RefreshCw,
  Star, ThumbsUp, Calendar, Heart, MessageCircle, ShoppingCart, UserCheck, HelpCircle,
  FileText, Mail, MapPin, Shield, Layers, Award, Laptop, Settings, Terminal
} from "lucide-react";
import * as Icons from "lucide-react";

interface WebsitePreviewProps {
  website: GeneratedWebsite;
  whatsappEnabled: boolean;
  leadFormEnabled: boolean;
  newsletterEnabled: boolean;
}

export default function WebsitePreview({ website, whatsappEnabled, leadFormEnabled, newsletterEnabled }: WebsitePreviewProps) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"preview" | "seo" | "webp">("preview");
  const [showPopup, setShowPopup] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Custom Interaction States
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsappText, setWhatsappText] = useState("");
  const [leadFormSubmitted, setLeadFormSubmitted] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [is404Active, setIs404Active] = useState(false);

  // Multi-page routing simulator state
  const [currentPreviewPage, setCurrentPreviewPage] = useState<"anasayfa" | "hizmetler" | "galeri" | "blog" | "katalog" | "iletisim" | "gizlilik">("anasayfa");

  // E-commerce purchase simulation popup state
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [checkoutSimulated, setCheckoutSimulated] = useState(false);

  // Reading blog post state
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const [sliderIdx, setSliderIdx] = useState(0);
  const design = website.design;

  // Periodic slider timer for interactive-slider heroStyle
  useEffect(() => {
    if (website.heroStyle === "interactive-slider") {
      const interval = setInterval(() => {
        setSliderIdx((prev) => (prev + 1) % 3);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [website.heroStyle]);

  // Initialize popup if enabled on landing
  useEffect(() => {
    if (website.popupContent) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [website]);

  // Reset to home page when a new website configuration loads
  useEffect(() => {
    setCurrentPreviewPage("anasayfa");
    setIs404Active(false);
    setReadingPost(null);
  }, [website]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const getLucideIcon = (name: string, primaryColor: string) => {
    const IconComponent = (Icons as any)[name];
    if (IconComponent) {
      return <IconComponent className="w-5 h-5" style={{ color: primaryColor }} />;
    }
    // Context smart fallbacks
    const nameLower = name.toLowerCase();
    if (nameLower.includes("spark") || nameLower.includes("star") || nameLower.includes("özgün")) {
      return <Icons.Sparkles className="w-5 h-5" style={{ color: primaryColor }} />;
    }
    if (nameLower.includes("zap") || nameLower.includes("energy") || nameLower.includes("dönüşüm")) {
      return <Icons.Zap className="w-5 h-5" style={{ color: primaryColor }} />;
    }
    if (nameLower.includes("search") || nameLower.includes("seo") || nameLower.includes("find")) {
      return <Icons.Search className="w-5 h-5" style={{ color: primaryColor }} />;
    }
    if (nameLower.includes("activity") || nameLower.includes("health") || nameLower.includes("med") || nameLower.includes("klinik")) {
      return <Icons.HeartPulse className="w-5 h-5" style={{ color: primaryColor }} />;
    }
    if (nameLower.includes("utensil") || nameLower.includes("food") || nameLower.includes("cook") || nameLower.includes("kafe")) {
      return <Icons.Utensils className="w-5 h-5" style={{ color: primaryColor }} />;
    }
    if (nameLower.includes("build") || nameLower.includes("construct") || nameLower.includes("home") || nameLower.includes("villa") || nameLower.includes("emlak")) {
      return <Icons.Home className="w-5 h-5" style={{ color: primaryColor }} />;
    }
    return <Icons.Layers className="w-5 h-5" style={{ color: primaryColor }} />;
  };

  // Automatic Monogram Logo Generator
  const generateMonogramLogo = () => {
    const isYazilimEviniz = website.companyName.toLowerCase().includes("yazılım") || website.companyName.toLowerCase().includes("yazilim") || website.companyName.toLowerCase().includes("yolcu");
    
    if (isYazilimEviniz) {
      return (
        <div className="flex items-center gap-2 select-none">
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2005/svg">
            {/* Glowing Code Roof */}
            <path d="M6 16L16 6L26 16" stroke="url(#preview-logo-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Screen base */}
            <rect x="9" y="15" width="14" height="9" rx="1" stroke="url(#preview-logo-grad)" strokeWidth="2" fill="#090d16" />
            <path d="M7 25H25" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
            {/* "Y" letter contour inside */}
            <path d="M13 18L16 20L19 18" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 20V22" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round"/>
            <defs>
              <linearGradient id="preview-logo-grad" x1="16" y1="6" x2="16" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00ff88" />
                <stop offset="1" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="relative flex flex-col text-left font-sans tracking-tight">
            <span className="text-[13px] sm:text-[14px] font-black tracking-[-0.03em] uppercase text-zinc-100">
              YAZILIM<span className="text-zinc-500 font-light">EVİNİZ</span>
            </span>
            <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-extrabold tracking-[0.24em] uppercase -mt-1" style={{ color: "#3b82f6" }}>
              <span>OTONOM</span>
            </div>
          </div>
        </div>
      );
    }

    const letters = website.companyName
      .split(/\s+/)
      .map(word => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    return (
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-[#00ff88] text-xs shadow-md border-2" 
          style={{ 
            borderColor: design.primaryColor, 
            backgroundColor: `${design.primaryColor}15`,
            color: design.primaryColor,
            fontFamily: design.fontFamilyHeading 
          }}
        >
          {letters}
        </div>
        <span className="text-sm sm:text-base font-extrabold tracking-tight generated-heading" style={{ color: design.textColor }}>
          {website.companyName}
        </span>
      </div>
    );
  };

  // Safe parsed JSON Link validation
  let structuredDataString = website.seo.structuredDataJson;
  try {
    if (typeof structuredDataString === "object") {
      structuredDataString = JSON.stringify(structuredDataString, null, 2);
    }
  } catch (e) {
    // Already safe
  }

  const headingFont = design.fontFamilyHeading || "Outfit";
  const bodyFont = design.fontFamilyBody || "Inter";
  const formattedHeading = headingFont.replace(/\s+/g, '+');
  const formattedBody = bodyFont.replace(/\s+/g, '+');
  
  const customTypographyRules = `
    @import url('https://fonts.googleapis.com/css2?family=${formattedHeading}:wght@600;700;800&family=${formattedBody}:wght@400;500;600&display=swap');
    
    .generated-site-wrapper {
      font-family: '${bodyFont}', sans-serif;
    }
    .generated-heading {
      font-family: '${headingFont}', sans-serif;
    }
    #website-live-preview a:hover { opacity: 0.95; }
    #website-live-preview select, #website-live-preview input, #website-live-preview textarea {
      color: #0f172a !important;
      background-color: #f8fafc !important;
    }
    #website-live-preview select::placeholder, #website-live-preview input::placeholder, #website-live-preview textarea::placeholder {
      color: #64748b !important;
    }
  `;

  // Filter gallery list
  const [galleryFilter, setGalleryFilter] = useState("Hepsi");
  const categories = ["Hepsi", ...Array.from(new Set(website.galleryList?.map(item => item.category) || []))];
  const filteredGallery = galleryFilter === "Hepsi" 
    ? website.galleryList 
    : website.galleryList?.filter(item => item.category === galleryFilter);

  // Active Interactive Tabs Service state
  const [activeServiceTabIdx, setActiveServiceTabIdx] = useState(0);

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-none shadow-2xl overflow-hidden flex flex-col h-full" id="website-preview-container">
      {/* Top Simulated Browser Controller */}
      <div className="bg-[#0b0b0b] border-b border-white/10 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Responsive viewport selectors */}
        <div className="flex items-center gap-1 bg-[#050505] p-1 border border-white/5 rounded-none self-start md:self-auto font-mono">
          <button
            onClick={() => setViewport("desktop")}
            className={`p-2 rounded-none transition-all flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold ${viewport === "desktop" ? "bg-white text-black" : "text-white/30 hover:text-white"}`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Masaüstü</span>
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`p-2 rounded-none transition-all flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold ${viewport === "tablet" ? "bg-white text-black" : "text-white/30 hover:text-white"}`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`p-2 rounded-none transition-all flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold ${viewport === "mobile" ? "bg-white text-black" : "text-white/30 hover:text-white"}`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobil</span>
          </button>
        </div>

        {/* Address URL simulator */}
        <div className="flex-1 max-w-lg bg-[#050505] px-4 py-2 border border-white/10 rounded-none flex items-center gap-2.5 mx-0 md:mx-4 font-mono text-[11px]">
          <span className="shrink-0">🗂️</span>
          <Globe className="w-3.5 h-3.5 text-white/30 shrink-0" />
          <span className="text-white/50 select-all truncate flex-1 leading-none">
            https://{website.companyName.toLowerCase().replace(/\s+/g, "-")}.com/{website.pageType === "multi-page" && currentPreviewPage !== "anasayfa" ? currentPreviewPage : ""}
          </span>
          {is404Active && <span className="text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-none shrink-0 uppercase tracking-widest leading-none">404</span>}
        </div>

        {/* Action Panel Tab Selector */}
        <div className="flex bg-[#050505] p-1 border border-white/5 rounded-none self-end md:self-auto font-mono">
          <button
            onClick={() => { setActiveTab("preview"); setIs404Active(false); }}
            className={`px-3 py-1.5 rounded-none text-[10px] uppercase tracking-wider font-bold transition-all ${activeTab === "preview" ? "bg-[#00ff88] text-black" : "text-white/30 hover:text-white"}`}
          >
            Önizleme
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`px-3 py-1.5 rounded-none text-[10px] uppercase tracking-wider font-bold transition-all ${activeTab === "seo" ? "bg-[#00ff88] text-black" : "text-white/30 hover:text-white"}`}
          >
            SEO Özeti
          </button>
          <button
            onClick={() => setActiveTab("webp")}
            className={`px-3 py-1.5 rounded-none text-[10px] uppercase tracking-wider font-bold transition-all ${activeTab === "webp" ? "bg-[#00ff88] text-black" : "text-white/30 hover:text-white"}`}
          >
            Hız & WebP
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-950 p-2 sm:p-5 transition-all duration-300">
        <style dangerouslySetInnerHTML={{ __html: customTypographyRules }} />

        {/* Tab 1: Live Interactive Preview */}
        {activeTab === "preview" && (
          <div 
            className="mx-auto bg-white rounded-none shadow-2xl border border-gray-100/10 overflow-hidden transition-all duration-300 flex flex-col text-left generated-site-wrapper"
            style={{ 
              maxWidth: viewport === "desktop" ? "100%" : viewport === "tablet" ? "768px" : "385px",
              minHeight: "750px",
              backgroundColor: design.backgroundColor,
              color: design.textColor
            }}
          >
            {/* Simulated Banner for 404 test */}
            <div className="bg-gradient-to-r from-neutral-900 via-slate-900 to-neutral-900 text-white text-[10px] sm:text-xs text-center px-4 py-2 flex items-center justify-between border-b border-white/5 font-sans">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" />
                <span className="font-mono text-white/60">Otonom Arayüz Canlı Deney Portu ({website.pageType === "single-page" ? "Tek Sayfa / Landing" : "Çok Sayfa / Portal"})</span>
              </span>
              <button
                onClick={() => setIs404Active(!is404Active)}
                className="bg-white/10 hover:bg-white/20 text-[#00ff88] px-2.5 py-1 rounded font-mono font-bold transition-all shrink-0 ml-2 border border-white/10 text-[9px] cursor-pointer"
              >
                {is404Active ? "AKTİF SİTEYE DÖN ➔" : "404 HATA TESTİ / DEMO ➔"}
              </button>
            </div>

            {is404Active ? (
              /* Simulated Custom SEO-optimized 404 screen */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[500px] m-4 rounded-xl" style={{ backgroundColor: design.backgroundColor }}>
                <div className="w-16 h-16 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center mb-4 border border-rose-500/20">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight generated-heading mb-3 animate-fadeIn" style={{ color: design.textColor }}>
                  {website.seo.errorContent404.heading}
                </h1>
                <p className="text-sm max-w-md mx-auto leading-relaxed mb-6 opacity-75">
                  {website.seo.errorContent404.body}
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => setIs404Active(false)}
                    className="px-6 py-2.5 rounded-full text-white text-xs font-bold shadow-md hover:opacity-90 transition-all cursor-pointer"
                    style={{ backgroundColor: design.primaryColor }}
                  >
                    {website.seo.errorContent404.recoveryCta}
                  </button>
                  <p className="text-[10px] opacity-40 font-mono">
                    Hatalı bağlantı otonom SEO motoru tarafından yakalandı ve yeniden yapılandırıldı.
                  </p>
                </div>
              </div>
            ) : (
              /* Normal Website preview layout */
              <div id="website-live-preview" className="flex flex-col flex-1 h-full relative font-sans leading-relaxed">
                
                {/* Simulated Header Navigation */}
                <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100/10 backdrop-blur-md sticky top-0 z-40" style={{ backgroundColor: design.backgroundColor }}>
                  <button onClick={() => setCurrentPreviewPage("anasayfa")} className="text-left cursor-pointer focus:outline-none">
                    {website.logoUrl ? (
                      <img src={website.logoUrl} alt={website.companyName} className="h-8 w-auto object-contain max-w-[200px]" referrerPolicy="no-referrer" />
                    ) : (
                      generateMonogramLogo()
                    )}
                  </button>
                  
                  {/* Dynamic Page Switcher Header links */}
                  <nav className="hidden md:flex items-center gap-5 text-xs sm:text-[13px] font-semibold">
                    {website.pageType === "single-page" ? (
                      <>
                        <a href="#hizmetler" className="hover:opacity-80 transition-opacity">Hizmetlerimiz</a>
                        {website.galleryList && <a href="#galeri" className="hover:opacity-80 transition-opacity">Galeri</a>}
                        {website.blogPosts && <a href="#blog" className="hover:opacity-80 transition-opacity">Yazılar</a>}
                        {website.ecommerceProducts && <a href="#katalog" className="hover:opacity-80 transition-opacity">Katalog</a>}
                        {website.googleReviews && <a href="#yorumlar" className="hover:opacity-80 transition-opacity">Yorumlar</a>}
                        <a href="#iletisim" className="hover:opacity-80 transition-opacity">İletişim</a>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setCurrentPreviewPage("anasayfa"); setReadingPost(null); }} 
                          className={`cursor-pointer transition-all ${currentPreviewPage === "anasayfa" ? "font-bold text-emerald-400" : "opacity-75 hover:opacity-100"}`}
                        >
                          Ana Sayfa
                        </button>
                        <button 
                          onClick={() => { setCurrentPreviewPage("hizmetler"); setReadingPost(null); }} 
                          className={`cursor-pointer transition-all ${currentPreviewPage === "hizmetler" ? "font-bold text-emerald-400" : "opacity-75 hover:opacity-100"}`}
                        >
                          Hizmetlerimiz
                        </button>
                        {website.galleryList && (
                          <button 
                            onClick={() => { setCurrentPreviewPage("galeri"); setReadingPost(null); }} 
                            className={`cursor-pointer transition-all ${currentPreviewPage === "galeri" ? "font-bold text-emerald-400" : "opacity-75 hover:opacity-100"}`}
                          >
                            Galeri
                          </button>
                        )}
                        {website.blogPosts && (
                          <button 
                            onClick={() => { setCurrentPreviewPage("blog"); setReadingPost(null); }} 
                            className={`cursor-pointer transition-all ${currentPreviewPage === "blog" ? "font-bold text-emerald-400" : "opacity-75 hover:opacity-100"}`}
                          >
                            Yazılar
                          </button>
                        )}
                        {website.ecommerceProducts && (
                          <button 
                            onClick={() => { setCurrentPreviewPage("katalog"); setReadingPost(null); }} 
                            className={`cursor-pointer transition-all ${currentPreviewPage === "katalog" ? "font-bold text-emerald-400" : "opacity-75 hover:opacity-100"}`}
                          >
                            Mağaza & Paketler
                          </button>
                        )}
                        <button 
                          onClick={() => { setCurrentPreviewPage("iletisim"); setReadingPost(null); }} 
                          className={`cursor-pointer transition-all ${currentPreviewPage === "iletisim" ? "font-bold text-emerald-400" : "opacity-75 hover:opacity-100"}`}
                        >
                          İletişim
                        </button>
                        <button 
                          onClick={() => { setCurrentPreviewPage("gizlilik"); setReadingPost(null); }} 
                          className={`cursor-pointer transition-all ${currentPreviewPage === "gizlilik" ? "font-bold text-emerald-400" : "opacity-75 hover:opacity-100"}`}
                        >
                          KVKK & Gizlilik
                        </button>
                      </>
                    )}
                  </nav>
                  
                  {whatsappEnabled && (
                    <button 
                      onClick={() => {
                        setIsWhatsAppOpen(true);
                        setWhatsappText(website.whatsappMessage);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-full shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all bg-emerald-600 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Yazın
                    </button>
                  )}
                </header>

                {/* Simulated Content Rendering Module */}
                <main className="flex-1">

                  {/* SUB SECTION: Individual Blog Reader Mode (If reading a blog post) */}
                  {readingPost ? (
                    <article className="px-6 py-12 max-w-2xl mx-auto space-y-6 animate-fadeIn text-left">
                      <button 
                        onClick={() => setReadingPost(null)} 
                        className="text-xs font-mono font-bold flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                      >
                        ← BLOG LISTESİNE DÖN
                      </button>
                      <img src={readingPost.imageUrl} alt={readingPost.title} className="w-full h-80 object-cover rounded-2xl border border-white/10 shadow-lg" referrerPolicy="no-referrer" />
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-[#00ff88] block uppercase">{readingPost.date} // YAZAR: {readingPost.author}</span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight generated-heading leading-tight" style={{ color: design.textColor }}>{readingPost.title}</h1>
                      </div>
                      <div className="text-xs sm:text-sm opacity-85 leading-relaxed space-y-4">
                        <p className="font-bold">{readingPost.summary}</p>
                        <p>{website.companyName} otonom makale motoru tarafından yazılan bu rehber, {website.sector} alanındaki en güncel sektörel trendleri, teknik analizleri ve stratejik planlamaları ele alır.</p>
                        <p>Web sitemiz, ziyaretçilerimize en yüksek düzeyde profesyonel ve SEO-friendly veri akışı sağlamak amacıyla tamamen yapay zeka tarafından yönetilmektedir. Sunduğumuz tüm hizmetleri dinamik olarak yapılandırabilir, işletmenizdeki dijital dönüşümü derhal başlatabilirsiniz.</p>
                        <p>Sorularınız veya iş birliği talepleriniz için bize ulaşmaktan çekinmeyin.</p>
                      </div>
                      <div className="pt-6 border-t border-white/5 flex gap-3">
                        <button 
                          onClick={() => { setCurrentPreviewPage("iletisim"); setReadingPost(null); }}
                          className="px-5 py-2.5 text-xs font-bold text-black font-mono uppercase tracking-wider rounded cursor-pointer hover:opacity-90 transition-all"
                          style={{ backgroundColor: design.primaryColor }}
                        >
                          İletişime Geçin
                        </button>
                      </div>
                    </article>
                  ) : (
                    /* NORMAL PREVIEW RENDERING FLOW BASED ON SELECTIONS */
                    <>
                      {/* PAGE VIEW 1: ANA SAYFA (Home and Hero section variations) */}
                      {(currentPreviewPage === "anasayfa" || website.pageType === "single-page") && (
                        <>
                          {/* HERO LAYOUT 1: Split Screen Modern Grid */}
                          {website.heroStyle === "split-image" && (
                            <section className="px-6 py-12 md:py-20 border-b border-gray-100/10 animate-fadeIn" id="hero-banner">
                              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <div className="space-y-5 text-left">
                                  <span className="px-3.5 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-400 inline-block font-sans border border-emerald-500/20">
                                    {website.sector}
                                  </span>
                                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight generated-heading" style={{ color: design.textColor }}>
                                    {website.heroHeadline}
                                  </h1>
                                  <p className="text-sm sm:text-base opacity-80 !leading-relaxed">
                                    {website.heroSubheadline}
                                  </p>
                                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                                    <button 
                                      onClick={() => setCurrentPreviewPage("iletisim")} 
                                      className="px-7 py-3.5 rounded-full text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all w-full sm:w-auto text-center cursor-pointer"
                                      style={{ backgroundColor: design.primaryColor }}
                                    >
                                      {website.heroCtaText}
                                    </button>
                                    <button 
                                      onClick={() => setCurrentPreviewPage("hizmetler")} 
                                      className="px-7 py-3.5 rounded-full border text-xs sm:text-sm font-bold bg-white/5 backdrop-blur-xs hover:bg-white/10 transition-all w-full sm:w-auto text-center border-white/10 cursor-pointer"
                                    >
                                      Çözümleri İncele ➔
                                    </button>
                                  </div>
                                </div>
                                <div className="relative">
                                  <div className="absolute inset-0 -m-2 rounded-2xl bg-gradient-to-tr from-[#00ff88]/20 to-indigo-505/20 blur-xl opacity-35"></div>
                                  <img 
                                    src={website.resolvedUnsplashHeroUrl} 
                                    alt={website.companyName} 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-80 md:h-[400px] object-cover rounded-2xl shadow-2xl relative border border-white/15" 
                                  />
                                </div>
                              </div>
                            </section>
                          )}

                          {/* HERO LAYOUT 2: Neo-Brutalist flat pop art */}
                          {website.heroStyle === "neo-brutalist" && (
                            <section className="px-6 py-12 md:py-20 border-4 border-black m-6 animate-fadeIn" style={{ backgroundColor: "#ffdf3f", color: "#000050" }} id="hero-banner">
                              <div className="max-w-3xl mx-auto text-center space-y-6">
                                <span className="border-2 border-black bg-white text-black px-4 py-1 text-xs uppercase font-mono font-black tracking-wider inline-block">
                                  {website.sector}
                                </span>
                                <h1 className="text-3xl sm:text-4.5xl md:text-6xl font-black uppercase tracking-tight leading-none generated-heading border-black pb-2 text-black">
                                  {website.heroHeadline}
                                </h1>
                                <p className="text-xs sm:text-sm font-medium border-2 border-black bg-white p-4 text-black text-left leading-relaxed">
                                  {website.heroSubheadline}
                                </p>
                                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                                  <button 
                                    onClick={() => setCurrentPreviewPage("iletisim")} 
                                    className="px-8 py-4 border-4 border-black bg-black text-white hover:bg-white hover:text-black font-mono font-black uppercase tracking-widest transition-all w-full sm:w-auto text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                                  >
                                    {website.heroCtaText}
                                  </button>
                                  <button 
                                    onClick={() => setCurrentPreviewPage("hizmetler")} 
                                    className="px-8 py-4 border-4 border-black bg-white text-black font-mono font-black uppercase tracking-widest hover:bg-[#00ff88] transition-all w-full sm:w-auto text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                                  >
                                    Hizmetler ➔
                                  </button>
                                </div>
                              </div>
                            </section>
                          )}

                          {/* HERO LAYOUT 3: Centered Elegant Editorial Serif */}
                          {website.heroStyle === "centered-elegant" && (
                            <section className="px-6 py-16 md:py-28 text-center relative border-b border-gray-100/10 animate-fadeIn" id="hero-banner">
                              <div className="max-w-3xl mx-auto space-y-6">
                                <span className="text-xs uppercase tracking-[0.25em] font-mono italic block text-slate-400 font-bold">
                                  {website.sector}
                                </span>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight generated-heading font-serif italic font-normal" style={{ color: design.textColor }}>
                                  {website.heroHeadline}
                                </h1>
                                <div className="w-16 h-[2px] mx-auto opacity-35" style={{ backgroundColor: design.primaryColor }}></div>
                                <p className="text-sm sm:text-base md:text-lg italic opacity-85 max-w-xl mx-auto leading-relaxed">
                                  {website.heroSubheadline}
                                </p>
                                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 font-serif">
                                  <button 
                                    onClick={() => setCurrentPreviewPage("iletisim")} 
                                    className="px-8 py-3.5 text-white text-xs sm:text-sm font-bold shadow-sm hover:opacity-90 transition-all w-full sm:w-auto text-center rounded-none cursor-pointer"
                                    style={{ backgroundColor: design.primaryColor }}
                                  >
                                    {website.heroCtaText}
                                  </button>
                                  <button 
                                    onClick={() => setCurrentPreviewPage("hizmetler")} 
                                    className="px-8 py-3.5 border text-xs sm:text-sm font-bold bg-transparent hover:bg-slate-500/5 transition-all w-full sm:w-auto text-center border-slate-400/35 rounded-none cursor-pointer"
                                  >
                                    Hizmet Şemaları ➔
                                  </button>
                                </div>
                              </div>
                            </section>
                          )}

                          {/* HERO LAYOUT 4: Glassmorphism Glow Spheres */}
                          {website.heroStyle === "glassmorphism-glow" && (
                            <section className="px-6 py-16 md:py-28 text-center relative overflow-hidden border-b border-white/5 animate-fadeIn" id="hero-banner">
                              <div className="absolute top-10 left-10 w-64 h-64 rounded-full blur-[100px] opacity-20 animate-pulse" style={{ backgroundColor: design.primaryColor }}></div>
                              <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full blur-[100px] opacity-25 animate-pulse" style={{ backgroundColor: design.secondaryColor, animationDelay: "2.5s" }}></div>
                              
                              <div className="max-w-3xl mx-auto space-y-6 relative z-10 bg-[#121212]/20 backdrop-blur-md p-8 sm:p-12 border border-white/10 rounded-2xl shadow-2xl">
                                <span className="px-3.5 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-widest text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/20 inline-block font-sans">
                                  {website.sector}
                                </span>
                                <h1 className="text-3.5xl sm:text-4.5xl md:text-5.5xl font-black tracking-tight leading-tight generated-heading" style={{ color: design.textColor }}>
                                  {website.heroHeadline}
                                </h1>
                                <p className="text-xs sm:text-sm opacity-80 max-w-xl mx-auto !leading-relaxed">
                                  {website.heroSubheadline}
                                </p>
                                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                                  <button 
                                    onClick={() => setCurrentPreviewPage("iletisim")} 
                                    className="px-6 py-3 bg-white text-black hover:bg-opacity-95 text-xs sm:text-sm font-bold shadow-md transition-all w-full sm:w-auto text-center cursor-pointer"
                                    style={{ backgroundColor: design.primaryColor, color: design.backgroundColor === "#ffffff" ? "#ffffff" : "#000000" }}
                                  >
                                    {website.heroCtaText}
                                  </button>
                                  <button 
                                    onClick={() => setCurrentPreviewPage("hizmetler")} 
                                    className="px-6 py-3 border text-xs sm:text-sm font-white hover:bg-white/10 transition-all w-full sm:w-auto text-center border-white/10 text-white cursor-pointer"
                                  >
                                    Keşfet ➔
                                  </button>
                                </div>
                              </div>
                            </section>
                          )}

                          {/* HERO LAYOUT 5: Apple Minimalist */}
                          {website.heroStyle === "apple-minimalist" && (
                            <section className="px-6 py-16 md:py-28 text-center border-b border-gray-100/10 animate-fadeIn" style={{ backgroundColor: "#ffffff", color: "#000000" }} id="hero-banner">
                              <div className="max-w-4xl mx-auto space-y-6">
                                <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#86868b] uppercase block">
                                  {website.sector}
                                </span>
                                <h1 className="text-4xl sm:text-5.5xl md:text-7xl font-semibold tracking-tight leading-none text-black generated-heading">
                                  {website.heroHeadline}
                                </h1>
                                <p className="text-sm sm:text-base text-[#86868b] max-w-2xl mx-auto leading-relaxed">
                                  {website.heroSubheadline}
                                </p>
                                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                                  <button 
                                    onClick={() => setCurrentPreviewPage("iletisim")} 
                                    className="px-7 py-3 bg-black text-white hover:bg-[#1a1a1a] transition-all text-xs sm:text-sm font-bold rounded-full w-full sm:w-auto text-center cursor-pointer"
                                  >
                                    {website.heroCtaText}
                                  </button>
                                  <button 
                                    onClick={() => setCurrentPreviewPage("hizmetler")} 
                                    className="px-7 py-3 text-neutral-800 hover:underline transition-all text-xs sm:text-sm font-bold w-full sm:w-auto text-center cursor-pointer"
                                  >
                                    Daha Fazla Bilgi Edinin ➔
                                  </button>
                                </div>
                              </div>
                            </section>
                          )}

                          {/* HERO LAYOUT 6: Futuristic SaaS Dashboard */}
                          {website.heroStyle === "futuristic-dashboard" && (
                            <section className="px-6 py-12 md:py-24 border-b border-white/5 relative overflow-hidden animate-fadeIn" id="hero-banner">
                              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6 text-left relative z-10">
                                  <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/15 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-indigo-400 font-bold">
                                    <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse"></span>
                                    <span>{website.sector}</span>
                                  </div>
                                  <h1 className="text-3.5xl sm:text-4.5xl md:text-5.5xl font-black tracking-tight leading-tight generated-heading" style={{ color: design.textColor }}>
                                    {website.heroHeadline}
                                  </h1>
                                  <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
                                    {website.heroSubheadline}
                                  </p>
                                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 font-mono">
                                    <button 
                                      onClick={() => setCurrentPreviewPage("iletisim")} 
                                      className="px-6 py-3 text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-90 transition-all w-full sm:w-auto text-center cursor-pointer"
                                      style={{ backgroundColor: design.primaryColor }}
                                    >
                                      {website.heroCtaText}
                                    </button>
                                    <button 
                                      onClick={() => setCurrentPreviewPage("hizmetler")} 
                                      className="px-6 py-3 border text-xs sm:text-sm font-bold hover:bg-white/5 transition-all w-full sm:w-auto text-center border-white/10 cursor-pointer"
                                    >
                                      Sistem Verileri ➔
                                    </button>
                                  </div>
                                </div>
                                <div className="bg-[#0b0c10] border border-white/10 p-5 font-mono text-left shadow-2xl relative overflow-hidden rounded-xl">
                                  <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                      <div className="w-2 h-2 rounded-full bg-[#00ff88]"></div>
                                    </div>
                                    <span className="text-[9px] text-white/40 uppercase tracking-widest">{website.companyName} // METRİK SİSTEMİ</span>
                                  </div>
                                  <div className="space-y-3.5 text-xs text-white/90">
                                    <div className="flex justify-between items-center bg-white/5 p-2 border border-white/5">
                                      <span className="text-white/40">Otonom Conversion Hızı:</span>
                                      <span className="text-[#00ff88] font-bold">+284.6%</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-2 border border-white/5">
                                      <span className="text-white/40">Teknik SEO Skoru:</span>
                                      <span className="text-[#00ff88] font-bold">100 / 100</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-2 border border-white/5">
                                      <span className="text-white/40">Sayfa Açılış Hızı:</span>
                                      <span className="text-[#00ff88] font-bold">142ms (CDN Edge)</span>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-[8px] text-white/40">
                                        <span>Sunucu Verimlilik Logu</span>
                                        <span>Aktif</span>
                                      </div>
                                      <div className="w-full bg-white/5 h-2">
                                        <div className="bg-[#00ff88] h-full" style={{ width: "95%" }}></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>
                          )}

                          {/* HERO LAYOUT 7: Interactive Image Slider */}
                          {website.heroStyle === "interactive-slider" && (
                            <section className="relative overflow-hidden border-b border-white/5 min-h-[450px] md:min-h-[550px] flex items-center animate-fadeIn text-center" id="hero-banner">
                              {/* Slide Images */}
                              <div className="absolute inset-0 z-0">
                                {[
                                  website.resolvedUnsplashHeroUrl,
                                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
                                  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                                ].map((img, i) => (
                                  <div
                                    key={i}
                                    style={{ backgroundImage: `url(${img})` }}
                                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${sliderIdx === i ? "opacity-30" : "opacity-0"}`}
                                  />
                                ))}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
                              </div>

                              {/* Slide Content Overlay */}
                              <div className="max-w-4xl mx-auto px-6 py-12 text-center relative z-10 w-full">
                                <div className="space-y-6">
                                  {sliderIdx === 0 && (
                                    <div className="space-y-4">
                                      <span className="px-3 py-1 bg-[#00ff88]/10 text-[#00ff88] text-[9px] uppercase tracking-[0.2em] font-mono border border-[#00ff88]/20">
                                        {website.sector} // LİDER MARKA
                                      </span>
                                      <h1 className="text-3.5xl sm:text-4.5xl md:text-5.5xl font-black tracking-tight leading-tight generated-heading text-white">
                                        {website.heroHeadline}
                                      </h1>
                                      <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                                        {website.heroSubheadline}
                                      </p>
                                    </div>
                                  )}

                                  {sliderIdx === 1 && (
                                    <div className="space-y-4">
                                      <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[9px] uppercase tracking-[0.2em] font-mono border border-indigo-500/20">
                                        02 // ÖZEL HİZMET REHBERİ
                                      </span>
                                      <h1 className="text-3.5xl sm:text-4.5xl md:text-5.5xl font-black tracking-tight leading-tight generated-heading text-white">
                                        {website.services && website.services[0] ? website.services[0].title : "Profesyonel Çözümler"} Hızlı & Güvenli
                                      </h1>
                                      <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                                        {website.services && website.services[0] ? website.services[0].description : "Dönüşüm oranları yüksek, SEO kriterleri tam entegre çözümlerle işinizi otonom büyütün."}
                                      </p>
                                    </div>
                                  )}

                                  {sliderIdx === 2 && (
                                    <div className="space-y-4">
                                      <span className="px-3 py-1 bg-[#00ff88]/10 text-[#00ff88] text-[9px] uppercase tracking-[0.2em] font-mono border border-[#00ff88]/20">
                                        04 // %100 OTONOM ENTEGRASYON
                                      </span>
                                      <h1 className="text-3.5xl sm:text-4.5xl md:text-5.5xl font-black tracking-tight leading-tight generated-heading text-white">
                                        Geleceğe Hazır SEO & Dijital Çözüm Altyapısı
                                      </h1>
                                      <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                                        Hızlandırılmış CDN, WebP sıkıştırma ve otomatik schema.org yerleşimleri ile rakiplerinin önünde bir kullanıcı deneyimi.
                                      </p>
                                    </div>
                                  )}

                                  {/* CTA buttons */}
                                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <button
                                      onClick={() => setCurrentPreviewPage("iletisim")}
                                      className="px-6 py-3 rounded-none text-white text-xs sm:text-sm font-bold shadow-md hover:bg-opacity-90 transition-all w-full sm:w-auto text-center cursor-pointer font-mono uppercase tracking-widerLight bg-emerald-500"
                                      style={{ backgroundColor: design.primaryColor }}
                                    >
                                      {website.heroCtaText}
                                    </button>
                                    <button
                                      onClick={() => setCurrentPreviewPage("hizmetler")}
                                      className="px-6 py-3 border text-xs sm:text-sm font-bold hover:bg-white/5 transition-all w-full sm:w-auto text-center border-white/10 text-white cursor-pointer font-mono uppercase tracking-wider"
                                    >
                                      Hizmetlerimiz ➔
                                    </button>
                                  </div>

                                  {/* Dots indicating active slide */}
                                  <div className="flex justify-center items-center gap-2 pt-8">
                                    {[0, 1, 2].map((i) => (
                                      <button
                                        key={i}
                                        onClick={() => setSliderIdx(i)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${sliderIdx === i ? "bg-[#00ff88] scale-125" : "bg-white/20 hover:bg-white/40"}`}
                                        title={`Slayt ${i + 1}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </section>
                          )}

                          {/* HERO LAYOUT 8: Full Video / Cinematic Background Slider */}
                          {website.heroStyle === "full-slider-video" && (
                            <section className="relative overflow-hidden border-b border-white/5 min-h-[500px] md:min-h-[600px] flex items-center animate-fadeIn text-left" id="hero-banner">
                              {/* Background Video simulation */}
                              <div className="absolute inset-0 z-0 overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80')] opacity-30 transform scale-105 filter blur-sm"></div>
                                {/* Moving matrix/siber particles overlay simulation */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#080710]/95 via-transparent to-purple-900/40 mix-blend-color-dodge"></div>
                                <div className="absolute inset-0 bg-black/60"></div>
                                {/* Animated tech grids and play video pulse visual */}
                                <div className="absolute right-12 bottom-12 w-14 h-14 rounded-full border border-[#00ff88]/30 flex items-center justify-center animate-ping pointer-events-none"></div>
                                <div className="absolute right-15 bottom-15 w-8 h-8 rounded-full bg-[#00ff88]/15 border border-[#00ff88]/40 flex items-center justify-center text-[#00ff88] animate-bounce pointer-events-none text-[8px] font-mono">LIVE VIDEO</div>
                              </div>

                              {/* Video overlay core content */}
                              <div className="max-w-5xl mx-auto px-6 py-16 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                                <div className="space-y-6 lg:col-span-8">
                                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono tracking-widest text-[#00ff88]">
                                    <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
                                    <span>{website.sector.toUpperCase()} // SİNEMATİK SUNUM</span>
                                  </div>
                                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none generated-heading text-white uppercase italic">
                                    {website.heroHeadline}
                                  </h1>
                                  <p className="text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed font-sans font-light">
                                    {website.heroSubheadline}
                                  </p>

                                  <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <button
                                      onClick={() => setCurrentPreviewPage("iletisim")}
                                      className="px-8 py-3.5 rounded-none text-white text-xs sm:text-sm font-bold shadow-lg hover:brightness-110 transition-all text-center cursor-pointer font-mono uppercase tracking-widest flex items-center justify-center gap-2"
                                      style={{ backgroundColor: design.primaryColor }}
                                    >
                                      <span>{website.heroCtaText}</span>
                                      <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setCurrentPreviewPage("hizmetler")}
                                      className="px-8 py-3.5 border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-white/10 transition-all text-center cursor-pointer font-mono uppercase tracking-widest"
                                    >
                                      Süreci İnceleyin
                                    </button>
                                  </div>
                                </div>

                                <div className="lg:col-span-4 bg-[#0c0d13]/85 p-6 border border-white/15 rounded-none shadow-2xl relative overflow-hidden hidden lg:block">
                                  <div className="space-y-4">
                                    <h4 className="text-xs font-mono text-[#00ff88] tracking-widest uppercase">✦ CANLI SİNEMA AKIŞI</h4>
                                    <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                                      Arka planda dönen video siber-dokusu, markanızın kurumsal prestijini ve dijital hızını simüle eden 60 FPS otonom bir akış motorudur.
                                    </p>
                                    <div className="border-t border-white/10 pt-3 space-y-2 font-mono text-[10px]">
                                      <div className="flex justify-between"><span className="text-white/40">Çözünürlük:</span><span className="text-white">4K UHD HDR</span></div>
                                      <div className="flex justify-between"><span className="text-white/40">Format:</span><span className="text-white">HEVC WebM Optimized</span></div>
                                      <div className="flex justify-between"><span className="text-white/40">Boyut:</span><span className="text-white">0.8 MB (WebP/Video)</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>
                          )}

                          {/* HERO LAYOUT DEFAULT: Standard Bold Minimalist Grid */}
                          {!["split-image", "neo-brutalist", "centered-elegant", "glassmorphism-glow", "apple-minimalist", "futuristic-dashboard", "interactive-slider", "full-slider-video"].includes(website.heroStyle) && (
                            <section className="px-6 py-16 md:py-24 text-center relative overflow-hidden border-b border-white/5 animate-fadeIn" id="hero-banner">
                              <div className="max-w-3xl mx-auto space-y-5 relative z-10">
                                <span className="px-3 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-widest bg-slate-500/10 text-slate-300 inline-block font-sans border border-slate-500/20">
                                  {website.sector}
                                </span>
                                <h1 className="text-3.5xl sm:text-4.5xl md:text-5.5xl font-black tracking-tight leading-tight generated-heading" style={{ color: design.textColor }}>
                                  {website.heroHeadline}
                                </h1>
                                <p className="text-xs sm:text-sm opacity-80 max-w-xl mx-auto !leading-relaxed">
                                  {website.heroSubheadline}
                                </p>
                                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                                  <button 
                                    onClick={() => setCurrentPreviewPage("iletisim")} 
                                    className="px-6 py-3 rounded-full text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all w-full sm:w-auto text-center cursor-pointer"
                                    style={{ backgroundColor: design.primaryColor }}
                                  >
                                    {website.heroCtaText}
                                  </button>
                                  <button 
                                    onClick={() => setCurrentPreviewPage("hizmetler")} 
                                    className="px-6 py-3 rounded-full border text-xs sm:text-sm font-bold hover:bg-white/10 hover:text-white transition-all w-full sm:w-auto text-center border-white/10 cursor-pointer"
                                  >
                                    Hizmetler ➔
                                  </button>
                                </div>
                              </div>
                            </section>
                          )}

                          {/* UVP & About block */}
                          <section className="px-6 py-12 md:py-16 max-w-4xl mx-auto text-left space-y-4 animate-fadeIn">
                            <span className="text-[10px] font-mono tracking-widest font-bold uppercase block" style={{ color: design.primaryColor }}>HAKKIMIZDA // 02</span>
                            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight generated-heading">Marka Kimliği & Sektörel Değer Önergesi</h2>
                            <p className="text-xs sm:text-sm opacity-80 leading-relaxed font-sans">{website.aboutText}</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 pt-4">
                              {website.uvpTexts.map((uvp, index) => (
                                <div key={index} className="flex items-start gap-2 bg-[#121212]/5 p-3.5 border border-white/5 rounded-xl">
                                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <span className="text-xs sm:text-[13px] opacity-90 leading-tight">{uvp}</span>
                                </div>
                              ))}
                            </div>
                          </section>
                        </>
                      )}

                      {/* PAGE VIEW 2: HİZMETLERİMİZ */}
                      {(currentPreviewPage === "hizmetler" || website.pageType === "single-page") && (
                        <section className="px-6 py-12 md:py-20 max-w-6xl mx-auto animate-fadeIn" id="hizmetler">
                          <div className="text-center max-w-lg mx-auto mb-12 space-y-2">
                            <span className="text-[10px] font-mono tracking-widest font-bold uppercase" style={{ color: design.primaryColor }}>HİZMET KATALOĞU // 03</span>
                            <h2 className="text-2.5xl sm:text-3.5xl font-extrabold tracking-tight generated-heading" style={{ color: design.textColor }}>En Popüler Kurumsal Çözümler</h2>
                            <p className="text-xs opacity-70">En yüksek dönüşümü (CRO) verebilecek şekilde tam ihtiyacınıza yönelik derlendi.</p>
                          </div>

                          {/* CARDS STYLE 1: Bento Box stagger layout */}
                          {website.servicesStyle === "bento-box" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                              {website.services.map((srv, idx) => (
                                <div 
                                  key={idx} 
                                  className={`p-6 bg-slate-800/20 bg-opacity-40 backdrop-blur-xs rounded-2xl border border-white/10 shadow-sm md:${idx === 0 ? "col-span-2 row-span-1" : "col-span-1"} flex flex-col justify-between hover:border-white/20 transition-all group`}
                                >
                                  <div>
                                    <div className="w-10 h-10 rounded-xl bg-indigo-505/10 flex items-center justify-center mb-4 border border-white/10">
                                      {getLucideIcon(srv.iconName, design.primaryColor)}
                                    </div>
                                    <h3 className="text-lg font-bold generated-heading text-white">{srv.title}</h3>
                                    <p className="text-xs opacity-70 mt-2.5 font-sans leading-relaxed">{srv.description}</p>
                                    
                                    {srv.imageUrl && (
                                      <img src={srv.imageUrl} alt={srv.title} referrerPolicy="no-referrer" className="w-full h-36 object-cover rounded-xl mt-4 border border-white/5" />
                                    )}
                                  </div>
                                  
                                  <div className="mt-4 pt-3.5 border-t border-white/5 flex justify-between items-center text-[10px] text-white">
                                    <span className="font-mono text-[#00ff88]">{srv.conversionHook}</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-[#00ff88]" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* CARDS STYLE 2: Hover Accent Border lines */}
                          {website.servicesStyle === "hover-accent-border" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                              {website.services.map((srv, idx) => (
                                <div 
                                  key={idx} 
                                  className="p-6 bg-[#121212]/30 border border-white/10 rounded-none relative overflow-hidden group hover:border-[#00ff88] transition-all"
                                >
                                  <div className="w-1.5 h-full absolute top-0 left-0 bg-[#00ff88] scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                                  <div className="space-y-3">
                                    <div className="w-10 h-10 bg-white/5 flex items-center justify-center rounded">
                                      {getLucideIcon(srv.iconName, design.primaryColor)}
                                    </div>
                                    <h3 className="text-base font-extrabold generated-heading text-white">{srv.title}</h3>
                                    <p className="text-xs text-white/75 font-sans leading-relaxed">{srv.description}</p>
                                    {srv.imageUrl && (
                                      <img src={srv.imageUrl} alt={srv.title} referrerPolicy="no-referrer" className="w-full h-32 object-cover rounded border border-white/5" />
                                    )}
                                  </div>
                                  <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-[#00ff88] flex justify-between items-center">
                                    <span>{srv.conversionHook}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* CARDS STYLE 3: Neon Glassmorphic glowing spheres */}
                          {website.servicesStyle === "neon-glassmorphism" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                              {website.services.map((srv, idx) => (
                                <div 
                                  key={idx} 
                                  className="p-6 bg-[#030712]/80 border-2 border-emerald-500/15 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:shadow-[0_0_35px_rgba(16,185,129,0.15)] transition-all group"
                                >
                                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[35px] pointer-events-none"></div>
                                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                                    {getLucideIcon(srv.iconName, "#10b981")}
                                  </div>
                                  <h3 className="text-lg font-bold generated-heading text-white">{srv.title}</h3>
                                  <p className="text-xs text-white/70 mt-3 font-sans leading-relaxed">{srv.description}</p>
                                  {srv.imageUrl && (
                                    <img src={srv.imageUrl} alt={srv.title} referrerPolicy="no-referrer" className="w-full h-36 object-cover rounded-xl mt-4 border border-white/10" />
                                  )}
                                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[#10b981] text-[10px] font-mono">
                                    <span>{srv.conversionHook}</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* CARDS STYLE 4: Editorial Grid book style */}
                          {website.servicesStyle === "editorial-grid" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left font-serif">
                              {website.services.map((srv, idx) => (
                                <div key={idx} className="space-y-4 border-l border-neutral-300/40 pl-5 py-2 hover:border-black transition-all">
                                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] block text-slate-500">HİZMET // 0{idx+1}</span>
                                  <h3 className="text-xl font-bold italic generated-heading" style={{ color: design.textColor }}>{srv.title}</h3>
                                  <p className="text-xs opacity-80 leading-relaxed font-sans">{srv.description}</p>
                                  {srv.imageUrl && (
                                    <img src={srv.imageUrl} alt={srv.title} referrerPolicy="no-referrer" className="w-full h-32 object-cover rounded-none" />
                                  )}
                                  <div className="text-[10px] font-mono italic text-slate-400">
                                    <span>{srv.conversionHook}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* CARDS STYLE 5: Apple List Cards */}
                          {website.servicesStyle === "apple-list" && (
                            <div className="space-y-6 text-left">
                              {website.services.map((srv, idx) => (
                                <div 
                                  key={idx} 
                                  className="p-8 border border-neutral-100/10 rounded-3xl flex flex-col md:flex-row gap-8 items-center hover:bg-neutral-100/5 transition-all cursor-pointer"
                                  style={{ backgroundColor: design.backgroundColor === "#ffffff" ? "#fbfbfd" : "#121212" }}
                                >
                                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center border border-white/10 shrink-0" style={{ backgroundColor: design.backgroundColor === "#ffffff" ? "#f5f5f7" : "#1e1e1e" }}>
                                    {getLucideIcon(srv.iconName, design.primaryColor)}
                                  </div>
                                  <div className="flex-1 space-y-1.5 text-left">
                                    <h3 className="text-xl font-semibold tracking-tight generated-heading" style={{ color: design.textColor }}>{srv.title}</h3>
                                    <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">{srv.description}</p>
                                    <span className="text-xs font-semibold pt-2 inline-block font-mono" style={{ color: design.primaryColor }}>
                                      {srv.conversionHook}
                                    </span>
                                  </div>
                                  {srv.imageUrl && (
                                    <img src={srv.imageUrl} alt={srv.title} referrerPolicy="no-referrer" className="w-full md:w-44 h-28 object-cover rounded-2xl border border-white/5" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* CARDS STYLE 6: Interactive Tabs Horizontal selector */}
                          {website.servicesStyle === "interactive-tabs" && (
                            <div className="space-y-6 text-left">
                              <div className="flex flex-wrap border-b border-white/10 pb-0.5">
                                {website.services.map((srv, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setActiveServiceTabIdx(idx)}
                                    className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 tracking-wide transition-all ${activeServiceTabIdx === idx ? "text-emerald-400 border-emerald-400 font-extrabold" : "text-slate-400 border-transparent hover:text-white"}`}
                                  >
                                    {srv.title}
                                  </button>
                                ))}
                              </div>
                              <div className="p-6 bg-[#121212]/30 border border-white/10 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4">
                                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    {getLucideIcon(website.services[activeServiceTabIdx].iconName, design.primaryColor)}
                                  </div>
                                  <h3 className="text-xl font-bold generated-heading text-white">{website.services[activeServiceTabIdx].title}</h3>
                                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">{website.services[activeServiceTabIdx].description}</p>
                                  <p className="text-xs font-mono text-[#00ff88]">{website.services[activeServiceTabIdx].conversionHook}</p>
                                </div>
                                {website.services[activeServiceTabIdx].imageUrl && (
                                  <img 
                                    src={website.services[activeServiceTabIdx].imageUrl} 
                                    alt={website.services[activeServiceTabIdx].title} 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-48 object-cover rounded-xl border border-white/10 shadow-lg" 
                                  />
                                )}
                              </div>
                            </div>
                          )}

                          {/* Fallback to standard grid */}
                          {!["bento-box", "hover-accent-border", "neon-glassmorphism", "editorial-grid", "apple-list", "interactive-tabs"].includes(website.servicesStyle) && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                              {website.services.map((srv, idx) => (
                                <div key={idx} className="p-5 bg-[#121212]/30 border border-white/10 rounded-xl space-y-3">
                                  <div className="w-10 h-10 bg-white/5 flex items-center justify-center rounded">
                                    {getLucideIcon(srv.iconName, design.primaryColor)}
                                  </div>
                                  <h3 className="text-sm sm:text-base font-bold text-white">{srv.title}</h3>
                                  <p className="text-xs text-white/70 leading-relaxed">{srv.description}</p>
                                  <p className="text-[10px] font-mono text-[#00ff88]">{srv.conversionHook}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </section>
                      )}

                      {/* PAGE VIEW 3: MULTI-PAGE GALLERY SECTION */}
                      {(currentPreviewPage === "galeri" || (website.pageType === "single-page" && website.galleryList && website.galleryList.length > 0)) && (
                        <section className="px-6 py-12 bg-[#121212]/10 border-b border-gray-100/10 animate-fadeIn" id="galeri">
                          <div className="max-w-5xl mx-auto space-y-10">
                            <div className="text-center space-y-2">
                              <span className="text-[10px] font-mono tracking-widest font-bold uppercase" style={{ color: design.primaryColor }}>MEDYA GALERİSİ // 04</span>
                              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight generated-heading">Görsel Uygulama & Ortaklık Portföyü</h2>
                              
                              {/* Categories filter selector */}
                              <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                                {categories.map((cat) => (
                                  <button
                                    key={cat}
                                    onClick={() => setGalleryFilter(cat)}
                                    className={`px-3 py-1 text-xs font-mono font-bold border rounded-none tracking-wide transition-all ${galleryFilter === cat ? "bg-[#00ff88] border-[#00ff88] text-black" : "border-white/10 hover:border-white/20 text-white/70 cursor-pointer"}`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Gallery grid layouts */}
                            
                            {/* BENTO LAYOUT */}
                            {website.galleryList && (website.features.galleryLayout === "justified-bento" || (!website.features.galleryLayout && design.layoutStructure === "Bento")) && (
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                {filteredGallery?.map((item, idx) => {
                                  // Assign custom column spans to simulate gorgeous bento box asymmetry
                                  const spans = ["md:col-span-8", "md:col-span-4", "md:col-span-4", "md:col-span-8", "md:col-span-6", "md:col-span-6"];
                                  const spanClass = spans[idx % spans.length];
                                  return (
                                    <div 
                                      key={idx} 
                                      className={`${spanClass} bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#00ff88]/30 transition-all duration-300 shadow-xl cursor-pointer flex flex-col`}
                                    >
                                      <div className="overflow-hidden relative flex-1 min-h-[180px]">
                                        <img 
                                          src={item.imageUrl} 
                                          alt={item.title} 
                                          referrerPolicy="no-referrer"
                                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                                        />
                                        <span className="absolute top-3 left-3 bg-black/75 text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 text-white/90 font-bold border border-white/10">
                                          {item.category}
                                        </span>
                                      </div>
                                      <div className="p-4 text-left space-y-1">
                                        <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">{item.title}</h4>
                                        <p className="text-[10px] text-white/50 leading-relaxed font-sans">{item.description}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* STACKED MOSAIC LAYOUT */}
                            {website.galleryList && website.features.galleryLayout === "stacked-mosaic" && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {filteredGallery?.map((item, idx) => (
                                  <div 
                                    key={idx} 
                                    className="bg-[#0c0d13] border border-white/5 rounded-none overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 shadow-lg cursor-pointer relative h-64"
                                  >
                                    <img 
                                      src={item.imageUrl} 
                                      alt={item.title} 
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end text-left">
                                      <span className="text-[8px] uppercase tracking-widest text-[#00ff88] font-mono mb-1">{item.category}</span>
                                      <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-wide line-clamp-1">{item.title}</h4>
                                      <p className="text-[9px] text-white/60 line-clamp-2 mt-0.5">{item.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* CREATIVE NEON GLOW LAYOUT */}
                            {website.galleryList && (website.features.galleryLayout === "creative-neon-glow" || website.theme === "creative_neon_noir") && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {filteredGallery?.map((item, idx) => (
                                  <div 
                                    key={idx} 
                                    className="bg-[#0d0714] border border-purple-500/20 rounded-2xl overflow-hidden group hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.15)] transition-all duration-300 cursor-pointer relative"
                                  >
                                    <div className="overflow-hidden relative h-52">
                                      <img 
                                        src={item.imageUrl} 
                                        alt={item.title} 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter saturate-110"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0714] via-[#0d0714]/20 to-transparent" />
                                      <span className="absolute top-3 left-3 bg-pink-600 text-[8px] uppercase tracking-widest font-mono px-2 py-0.5 text-white font-bold rounded-full">
                                        {item.category}
                                      </span>
                                    </div>
                                    <div className="p-5 text-left space-y-1.5 min-h-[110px]">
                                      <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide group-hover:text-pink-400 transition-colors flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping"></span>
                                        {item.title}
                                      </h4>
                                      <p className="text-[10px] text-purple-200/50 leading-relaxed font-sans">{item.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* CYBER DARKROOM LAYOUT */}
                            {website.galleryList && website.features.galleryLayout === "cyber-darkroom" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredGallery?.map((item, idx) => (
                                  <div 
                                    key={idx} 
                                    className="bg-black border-2 border-zinc-900 rounded-none overflow-hidden group hover:border-white transition-all duration-500 cursor-pointer p-3 text-left"
                                  >
                                    <div className="bg-zinc-950 relative overflow-hidden h-64 border border-zinc-900">
                                      <img 
                                        src={item.imageUrl} 
                                        alt={item.title} 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                                      />
                                      <span className="absolute bottom-3 left-3 bg-black text-[9px] uppercase tracking-widest font-mono p-1.5 text-zinc-400 border border-zinc-800">
                                        FILM FRAME // {idx + 1}
                                      </span>
                                    </div>
                                    <div className="pt-4 space-y-1">
                                      <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase">{item.category}</span>
                                        <span className="text-[9px] font-mono text-[#00ff88]">STATUS: ARCHIVED</span>
                                      </div>
                                      <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.title}</h4>
                                      <p className="text-xs text-zinc-400 font-sans leading-relaxed">{item.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* MASONRY / GENERAL GRID LAYOUT */}
                            {website.galleryList && 
                             website.features.galleryLayout !== "justified-bento" && 
                             website.features.galleryLayout !== "stacked-mosaic" && 
                             website.features.galleryLayout !== "creative-neon-glow" && 
                             website.features.galleryLayout !== "cyber-darkroom" && 
                             website.theme !== "creative_neon_noir" && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {filteredGallery?.map((item, idx) => (
                                  <div 
                                    key={idx} 
                                    className="bg-[#121212]/70 border border-white/10 rounded-xl overflow-hidden group hover:border-[#00ff88]/30 transition-all duration-300 shadow-lg cursor-pointer"
                                  >
                                    <div className="overflow-hidden relative h-48 sm:h-52">
                                      <img 
                                        src={item.imageUrl} 
                                        alt={item.title} 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                                      />
                                      {/* ALT Tag Indicator demonstrating clean SEO descriptors */}
                                      <div className="absolute bottom-2 right-2 bg-black/80 text-[8px] font-mono px-1 py-0.5 text-[#00ff88] rounded border border-[#00ff88]/25">
                                        ALT: {item.title}
                                      </div>
                                      <span className="absolute top-3 left-3 bg-black/75 text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 text-white/90 font-bold border border-white/10">
                                        {item.category}
                                      </span>
                                    </div>
                                    <div className="p-4 text-left space-y-1 bg-gradient-to-b from-[#121212] to-[#0d0d0d]">
                                      <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">{item.title}</h4>
                                      <p className="text-[10px] text-white/50 leading-relaxed font-sans">{item.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </section>
                      )}

                      {/* PAGE VIEW 4: AKILLI YAZILAR & BLOG */}
                      {(currentPreviewPage === "blog" || (website.pageType === "single-page" && website.blogPosts && website.blogPosts.length > 0)) && (
                        <section className="px-6 py-12 md:py-16 max-w-5xl mx-auto border-b border-gray-100/10 animate-fadeIn animate-fadeIn" id="blog">
                          <div className="space-y-10">
                            <div className="text-center space-y-2">
                              <span className="text-[10px] font-mono tracking-widest font-bold uppercase opacity-60" style={{ color: design.primaryColor }}>BİLGİ AKIŞI // 05</span>
                              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight generated-heading">Bilgi Bankası ve Sektörel Analitikler</h2>
                              <p className="text-xs opacity-75">Sektörel trendleri, teknik makaleleri ve derin incelemeleri keşfedin.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                              {website.blogPosts?.map((post, idx) => (
                                <div 
                                  key={idx} 
                                  onClick={() => setReadingPost(post)}
                                  className="bg-[#121212]/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#00ff88]/30 transition-all group cursor-pointer"
                                >
                                  <div>
                                    <div className="relative h-44 overflow-hidden">
                                      <img 
                                        src={post.imageUrl} 
                                        alt={post.title} 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                                      />
                                      <span className="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur-xs text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase text-white">
                                        {post.readTime}
                                      </span>
                                    </div>
                                    <div className="p-4 space-y-2">
                                      <span className="text-[9px] text-[#00ff88] font-mono font-bold block">{post.date} // {post.author.toUpperCase()}</span>
                                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00ff88] transition-colors leading-snug">{post.title}</h3>
                                      <p className="text-[10px] sm:text-xs text-white/50 leading-relaxed font-sans">{post.summary}</p>
                                    </div>
                                  </div>
                                  <div className="p-4 pt-0 flex items-center justify-between text-[11px] font-bold text-[#00ff88] font-mono">
                                    <span>Tamamını Oku ➔</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </section>
                      )}

                      {/* PAGE VIEW 5: MAĞAZA & E-TICARET KATALOĞU */}
                      {(currentPreviewPage === "katalog" || (website.pageType === "single-page" && website.ecommerceProducts && website.ecommerceProducts.length > 0)) && (
                        <section className="px-6 py-12 md:py-16 max-w-5xl mx-auto border-b border-gray-100/10 animate-fadeIn" id="katalog">
                          <div className="space-y-10">
                            <div className="text-center space-y-2">
                              <span className="text-[10px] font-mono tracking-widest font-bold uppercase" style={{ color: design.primaryColor }}>ONLINE SİPARİŞ // 06</span>
                              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight generated-heading">Hizmet Paketleri & Online Katalog</h2>
                              <p className="text-xs sm:text-sm opacity-70">İhtiyacınıza en uygun bütçe paketini seçip anında sipariş talebini başlatın.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
                              {website.ecommerceProducts?.map((prod) => (
                                <div 
                                  key={prod.id} 
                                  className="bg-[#121212]/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:border-white/20 transition-all flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900">
                                      <img 
                                        src={prod.imageUrl} 
                                        alt={prod.title} 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                      />
                                      {prod.originalPrice && (
                                        <span className="absolute top-3 right-3 bg-rose-500 text-white font-mono text-[9px] font-extrabold uppercase px-2 py-1 tracking-wider rounded">
                                          İNDİRİMLİ
                                        </span>
                                      )}
                                    </div>
                                    <div className="p-4 space-y-2">
                                      <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">{prod.title}</h3>
                                      <p className="text-[10px] sm:text-xs text-white/60 leading-relaxed font-sans">{prod.description}</p>
                                    </div>
                                  </div>

                                  <div className="p-4 pt-0">
                                    <div className="flex items-baseline gap-2 mb-3">
                                      <span className="text-base sm:text-lg font-mono font-extrabold text-[#00ff88]">{prod.price}</span>
                                      {prod.originalPrice && (
                                        <span className="text-xs text-white/40 line-through font-mono">{prod.originalPrice}</span>
                                      )}
                                    </div>
                                    <button 
                                      onClick={() => { setSelectedProduct(prod); setCheckoutSimulated(false); }}
                                      className="w-full bg-[#00ff88] text-black hover:bg-white text-xs py-2.5 font-bold uppercase tracking-widest transition-all rounded-lg flex items-center justify-center gap-1.5 font-mono cursor-pointer"
                                    >
                                      <ShoppingCart className="w-3.5 h-3.5" />
                                      Sipariş Başlat
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </section>
                      )}

                      {/* PAGE VIEW 6: İLETİŞİM & HARİTA SİMÜLATÖRÜ */}
                      {(currentPreviewPage === "iletisim" || website.pageType === "single-page") && (
                        <section className="px-6 py-12 max-w-5xl mx-auto space-y-12 animate-fadeIn" id="iletisim">
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left">
                            
                            {/* Contact Info and Address Cards */}
                            <div className="bg-[#121212] p-6 sm:p-8 border border-white/10 rounded-2xl flex flex-col justify-between text-white space-y-6">
                              <div className="space-y-4">
                                <span className="text-[10px] font-mono tracking-widest uppercase text-[#00ff88] font-bold block">İLETİŞİM BİLGİLERİ // 07</span>
                                <h3 className="text-xl sm:text-2xl font-bold generated-heading">{website.companyName} İletişim Hattı</h3>
                                <p className="text-xs text-white/70 leading-relaxed font-sans">
                                  Merak ettiğiniz konuları sormak, randevu oluşturmak veya hizmet matrisimiz hakkında bilgi almak için bizimle temas kurun.
                                </p>
                              </div>

                              <div className="space-y-4 text-xs sm:text-sm">
                                <div className="flex items-start gap-3">
                                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  <div>
                                    <h4 className="font-mono text-[10px] uppercase text-white/40">Telefon Hattı</h4>
                                    <a href={`tel:${website.contactPhone}`} className="text-white hover:text-emerald-400 transition-colors font-bold font-mono">{website.contactPhone}</a>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  <div>
                                    <h4 className="font-mono text-[10px] uppercase text-white/40">İletişim E-Posta</h4>
                                    <a href={`mailto:${website.companyEmail}`} className="text-white hover:text-emerald-400 transition-colors font-bold font-mono">{website.companyEmail}</a>
                                  </div>
                                </div>

                                <div className="flex items-start gap-3">
                                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  <div>
                                    <h4 className="font-mono text-[10px] uppercase text-white/40">Fiziki / Açık Adres</h4>
                                    <p className="text-white font-medium leading-normal">{website.companyAddress}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-white/5 text-[10px] font-mono text-white/30 leading-snug">
                                Mesaj gönderiminden itibaren otonom yapay zeka sistemimiz 5 dakika içinde size dönüş sağlayacaktır.
                              </div>
                            </div>

                            {/* Interactive Lead Intake Form inside simulated contact area */}
                            <div className="bg-[#121212] p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col justify-center">
                              {leadFormSubmitted ? (
                                <div className="p-6 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 space-y-2 text-center animate-fadeIn">
                                  <CheckCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                                  <h4 className="font-bold text-white">İletişim Talebi Kaydedildi!</h4>
                                  <p className="text-xs leading-relaxed font-sans">Kurumsal veri yönetim sistemimiz talebinizi aldı. Danışmanlarımız en kısa zamanda size dönüş yapacaktır.</p>
                                </div>
                              ) : (
                                <form onSubmit={(e) => { e.preventDefault(); setLeadFormSubmitted(true); }} className="space-y-4 text-left text-slate-800">
                                  <h3 className="text-base sm:text-lg font-bold text-white generated-heading">Hızlı Teklif / Randevu Talep Formu</h3>
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-300 mb-1 tracking-wider">Adınız Soyadınız</label>
                                    <input 
                                      type="text" 
                                      required 
                                      value={formName}
                                      onChange={(e) => setFormName(e.target.value)}
                                      placeholder="Furkan Yılmaz" 
                                      className="un-input w-full px-3 py-2 border border-slate-700 bg-slate-50 text-slate-900 rounded-lg text-xs font-sans focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[10px] uppercase font-bold text-slate-300 mb-1 tracking-wider">E-Posta Adresi</label>
                                      <input 
                                        type="email" 
                                        required
                                        value={formEmail}
                                        onChange={(e) => setFormEmail(e.target.value)}
                                        placeholder="furkan@domain.com" 
                                        className="un-input w-full px-3 py-2 border border-slate-700 bg-slate-50 text-slate-900 rounded-lg text-xs font-sans focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] uppercase font-bold text-slate-300 mb-1 tracking-wider">Telefon Numarası</label>
                                      <input 
                                        type="text" 
                                        required
                                        value={formPhone}
                                        onChange={(e) => setFormPhone(e.target.value)}
                                        placeholder="+90 555 123 4567" 
                                        className="un-input w-full px-3 py-2 border border-slate-700 bg-slate-50 text-slate-900 rounded-lg text-xs font-sans focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-300 mb-1 tracking-wider">Firma Notu / Açıklama</label>
                                    <textarea 
                                      rows={2} 
                                      value={formMessage}
                                      onChange={(e) => setFormMessage(e.target.value)}
                                      placeholder="Nasıl yardımcı olabiliriz? Randevu talebi mi?" 
                                      className="un-input w-full px-3 py-2 border border-slate-700 bg-slate-50 text-slate-900 rounded-lg text-xs font-sans focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
                                    />
                                  </div>
                                  <button 
                                    type="submit" 
                                    className="w-full py-3 text-black hover:bg-white text-xs font-bold rounded-lg transition-all font-mono uppercase tracking-[0.15em] cursor-pointer"
                                    style={{ backgroundColor: design.primaryColor }}
                                  >
                                    Talebi Gönder
                                  </button>
                                </form>
                              )}
                            </div>
                          </div>

                          {/* Dynamic Google Maps Widget Simulator with verified address lookup coordinates */}
                          <div className="space-y-3.5 text-left bg-[#121212]/30 p-5 rounded-2xl border border-white/10 shadow-lg">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00ff88]">📍 COĞRAFİ KONUM SİMÜLATÖRÜ</span>
                              <span className="text-[9px] text-white/40 font-mono">GOOGLE MAPS PLATFORM V4</span>
                            </div>
                            <div className="relative h-64 bg-slate-900 overflow-hidden flex flex-col justify-center items-center rounded-xl bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')" }}>
                              <div className="absolute inset-0 bg-black/55 backdrop-blur-xs"></div>
                              <div className="relative z-10 text-center space-y-3 p-4">
                                <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white mx-auto shadow-lg animate-bounce">
                                  <MapPin className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-bold text-white">{website.companyName} Konumu</h4>
                                <p className="text-[11px] text-white/80 max-w-sm mx-auto truncate px-4">{website.companyAddress}</p>
                                <div className="flex gap-2 justify-center pt-2">
                                  <button 
                                    type="button"
                                    onClick={() => alert(`Harita Koordinatları Simüle Edildi: \nFirma: ${website.companyName} \nAdres: ${website.companyAddress}`)}
                                    className="px-4 py-1.5 bg-white text-black text-[10px] font-mono font-bold uppercase tracking-wider rounded border hover:bg-neutral-100 cursor-pointer"
                                  >
                                    Yol Tarifi Al ➔
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      )}

                      {/* PAGE VIEW 7: PRIVACY & COOKIES KVKK COMPLIANCE PAGE */}
                      {currentPreviewPage === "gizlilik" && (
                        <section className="px-6 py-12 max-w-3xl mx-auto text-left space-y-6 animate-fadeIn">
                          <span className="text-[11px] font-mono tracking-widest uppercase text-[#00ff88] font-bold block">HUKUKİ UYUMLULUK // KVKK</span>
                          <h1 className="text-2.5xl font-extrabold tracking-tight generated-heading" style={{ color: design.textColor }}>Gizlilik, Çerez ve KVKK Politikası</h1>
                          <div className="w-16 h-[2.5px] opacity-40" style={{ backgroundColor: design.primaryColor }}></div>
                          
                          <div className="text-xs sm:text-sm opacity-85 space-y-4 font-sans leading-relaxed">
                            <p className="font-bold">Önemli Hukuki Bilgilendirme</p>
                            <p>Bu politika, <strong>{website.companyName}</strong> olarak {website.sector} alanındaki operasyonlarımızda kullanıcılarımızın ve ziyaretçilerimizin kişisel verilerinin korunması, gizliliği ve güvenliği ile ilgili sorumluluklarımızı belirlemektedir.</p>
                            
                            <h3 className="font-bold text-white pt-2.5">1. Kişisel Verilerin Toplanması Yolları</h3>
                            <p>İletişim, talep ve bülten formları aracılığıyla sağladığınız kişisel bilgileriniz (ad soyad, iletişim telefonu: <strong>{website.contactPhone}</strong>, e-posta adresi: <strong>{website.companyEmail}</strong>) veri sızıntılarını önleyici sızdırmaz veritabanı altyapımızda güvenle saklanmaktadır.</p>
                            
                            <h3 className="font-bold text-white pt-2.5">2. Çerezler (Cookies)</h3>
                            <p>Web sitemiz en yüksek düzeyde kullanıcı deneyimi (UX) sunmak ve dönüşüm oranlarını patlatmak amacıyla küçük tanımlama çerezleri kullanır. Bu çerezler, tarayıcı deneyimlerinizi otonom olarak kişiselleştirir.</p>

                            <h3 className="font-bold text-white pt-2.5">3. Başvuru ve Hak Talepleri</h3>
                            <p>6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca her zaman veri silme, güncelleme veya bilgi edinme hakkına sahipsiniz. İlgili taleplerinizi fiziki adresimiz olan <strong>{website.companyAddress}</strong> adresine veya <strong>{website.companyEmail}</strong> e-posta adresimize yazılı olarak iletebilirsiniz.</p>
                          </div>
                        </section>
                      )}
                    </>
                  )}
                </main>

                {/* Simulated Footer */}
                <footer className="px-6 py-8 border-t border-gray-100/10 text-center text-xs opacity-60 font-sans space-y-2 mt-auto">
                  <p>© 2026 {website.companyName}. Tüm hakları saklıdır. | <button onClick={() => { setCurrentPreviewPage("gizlilik"); setReadingPost(null); }} className="underline hover:text-emerald-400 cursor-pointer">KVKK Çerez ve Gizlilik Politikası</button></p>
                  <p className="text-[10px] text-white/40 leading-relaxed max-w-xl mx-auto truncate">
                    📍 {website.companyAddress} | ✉ {website.companyEmail} | ☎ {website.contactPhone}
                  </p>
                  <p className="text-[9px] opacity-75">Tasarım, bileşen kütüphaneleri, otonom pazar analizleri ve SEO optimizasyonu otonom yapay zeka ile otomatik yapılmıştır.</p>
                </footer>

                {/* Simulated Timed Popup Banner */}
                {website.popupContent && showPopup && (
                  <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-sm p-6 relative shadow-2xl border border-gray-100 text-slate-900 text-left">
                      <button 
                        onClick={() => setShowPopup(false)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                      <h4 className="text-lg font-bold generated-heading leading-tight">{website.popupContent.title}</h4>
                      <p className="text-xs text-slate-500 mt-2 font-sans leading-relaxed">{website.popupContent.subtitle}</p>
                      
                      {website.popupContent.couponCode && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mt-4 flex items-center justify-between font-mono text-xs">
                          <span className="text-slate-700 font-bold">{website.popupContent.couponCode}</span>
                          <button 
                            type="button"
                            onClick={() => copyToClipboard(website.popupContent?.couponCode || "", "coupon")}
                            className="text-indigo-600 font-sans font-bold flex items-center gap-1 hover:text-indigo-700 cursor-pointer"
                          >
                            {copiedText === "coupon" ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Clipboard className="w-3.5 h-3.5" />}
                            {copiedText === "coupon" ? "Kopyalandı!" : "Kopyala"}
                          </button>
                        </div>
                      )}

                      <button 
                        onClick={() => setShowPopup(false)}
                        className="w-full mt-5 py-3 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl hover:opacity-95 transition-all text-center cursor-pointer"
                        style={{ backgroundColor: design.primaryColor }}
                      >
                        Fırsatı Yakala
                      </button>
                    </div>
                  </div>
                )}

                {/* Interactive Simulated E-Commerce Checkout modal */}
                {selectedProduct && (
                  <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 relative shadow-2xl border border-gray-100 text-slate-900 text-left space-y-4">
                      <button 
                        onClick={() => setSelectedProduct(null)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="text-center font-sans space-y-1 pb-2 border-b border-slate-100">
                        <h4 className="text-sm font-mono text-slate-400 font-bold uppercase">SİPARİŞ SEPET DETAYI</h4>
                        <p className="text-base font-extrabold text-slate-900">{selectedProduct.title}</p>
                      </div>

                      {checkoutSimulated ? (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-center space-y-2 animate-fadeIn font-sans">
                          <CheckCheck className="w-10 h-10 text-emerald-600 mx-auto" />
                          <h4 className="font-extrabold">Ödeme Simülasyonu Başarılı!</h4>
                          <p className="text-xs">Satın alma faturası <strong>{website.companyEmail}</strong> mail adresinize gönderildi.</p>
                          <button 
                            type="button"
                            onClick={() => setSelectedProduct(null)}
                            className="mt-4 px-4 py-1.5 bg-neutral-900 text-white rounded-full text-[10px] font-mono hover:bg-neutral-800"
                          >
                            Siparişi Kapat
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4 font-sans">
                          <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="w-14 h-14 object-cover rounded-lg border border-slate-200" referrerPolicy="no-referrer" />
                            <div>
                              <p className="text-xs font-mono text-slate-400">Toplam Ödenecek:</p>
                              <p className="text-base font-extrabold text-[#0d9488] font-mono">{selectedProduct.price}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2.5">
                            <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Teslimat ve Fatura E-Postası</label>
                            <input 
                              type="email" 
                              value={formEmail} 
                              onChange={(e) => setFormEmail(e.target.value)}
                              placeholder="simule-alici@domain.com" 
                              className="un-input w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-lg text-xs"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => setCheckoutSimulated(true)}
                              className="flex-1 py-3 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-all text-center cursor-pointer"
                            >
                              Ödemeyi Simüle Et
                            </button>
                            <button 
                              onClick={() => setSelectedProduct(null)}
                              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono tracking-wider uppercase rounded-xl"
                            >
                              Vazgeç
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* Tab 2: SEO Visual Diagnostics */}
        {activeTab === "seo" && (
          <div className="max-w-4xl mx-auto space-y-6 text-left animate-fadeIn font-mono">
            {/* Simulated Google Search engine output */}
            <div className="bg-[#0c0d12] border border-white/10 p-5 rounded-none space-y-3.5">
              <span className="text-[10px] uppercase text-[#00ff88] font-bold tracking-widest block">🌐 SIMULATED GOOGLE MOBILE VIEWPORT</span>
              <div className="space-y-1.5 p-4 bg-white text-black rounded-xl">
                <span className="text-[11px] text-[#202124] block select-none">https://www.google.com/search?q={website.companyName.toLowerCase().replace(/\s+/g, '-')}</span>
                <span className="text-lg text-[#1a0dab] font-sans hover:underline block leading-tight cursor-pointer truncate max-w-full">
                  {website.seo.metaTitle}
                </span>
                <p className="text-xs text-[#4d5156] font-sans leading-relaxed">
                  {website.seo.metaDescription}
                </p>
                <div className="pt-2 flex flex-wrap gap-1">
                  {website.seo.metaKeywords.slice(0, 4).map((kw, i) => (
                    <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 border border-slate-200 font-mono">#{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Structured Schema LocalBusiness CodeBlock View */}
            <div className="bg-[#0c0d12] border border-white/10 p-5 rounded-none space-y-3">
              <span className="text-[10px] uppercase text-[#00ff88] font-bold tracking-widest block">⚡ LOCALBUSINESS SCHEMA.ORG STRUCTURE (JSON-LD)</span>
              <div className="bg-[#040508] p-4 text-[10.5px] text-white/80 overflow-x-auto border border-white/5 max-h-72">
                <pre>{structuredDataString}</pre>
              </div>
            </div>

            {/* Sitemap XML and robots.txt grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0c0d12] border border-white/10 p-5 rounded-none space-y-3">
                <span className="text-[10px] uppercase text-[#00ff88] font-bold tracking-widest block"> SITEMAP.XML MAPS REPORT</span>
                <div className="bg-[#040508] p-3 text-[10px] text-white/70 overflow-x-auto border border-white/5 max-h-48">
                  <pre>{website.seo.sitemapXml}</pre>
                </div>
              </div>
              <div className="bg-[#0c0d12] border border-white/10 p-5 rounded-none space-y-3">
                <span className="text-[10px] uppercase text-[#00ff88] font-bold tracking-widest block">🤖 ROBOTS.TXT POLICY</span>
                <div className="bg-[#040508] p-3 text-[10px] text-white/70 overflow-x-auto border border-white/5 max-h-48">
                  <pre>{website.seo.robotsTxt}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: WebP Optimization Simulation and Speed metrics */}
        {activeTab === "webp" && (
          <div className="max-w-4xl mx-auto space-y-6 text-left animate-fadeIn font-mono">
            
            {/* Audit Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#0c0d12] border border-white/10 p-5 rounded-none text-center space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase block">Performance score</span>
                <div className="text-3xl font-extrabold text-[#00ff88]">99 %</div>
                <span className="text-[9px] text-[#00ff88]/60 uppercase block">Google Lighthouse</span>
              </div>
              <div className="bg-[#0c0d12] border border-white/10 p-5 rounded-none text-center space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase block">Image compression</span>
                <div className="text-3xl font-extrabold text-[#00ff88]">-87.4 %</div>
                <span className="text-[9px] text-[#00ff88]/60 uppercase block">WebP Lossless reduction</span>
              </div>
              <div className="bg-[#0c0d12] border border-white/10 p-5 rounded-none text-center space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase block">Core Web Vitals</span>
                <div className="text-3xl font-extrabold text-[#00ff88]">A + PASSED</div>
                <span className="text-[9px] text-[#00ff88]/60 uppercase block">CLS, LCP & FID compliant</span>
              </div>
            </div>

            {/* WebP Image list Table */}
            <div className="bg-[#0c0d12] border border-white/10 p-5 rounded-none space-y-3 overflow-x-auto">
              <span className="text-[10px] uppercase text-[#00ff88] font-bold tracking-widest block">🖼️ WEBP IMAGE ALT TAGS & COMPRESSION LOG REPORT</span>
              
              <table className="w-full text-left text-[11px] border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 pb-2">
                    <th className="py-2.5">Resim Adı</th>
                    <th className="py-2.5">Orijinal (JPG)</th>
                    <th className="py-2.5">Otonom WebP</th>
                    <th className="py-2.5">Tasarruf Oranı</th>
                    <th className="py-2.5">Kıdemli SEO Alt Etiketi (HTML 'alt' tag)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {website.seo.webpOptimizations.map((item, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-all">
                      <td className="py-2">{item.filename}</td>
                      <td className="py-2 font-mono">{item.originalSize}</td>
                      <td className="py-2 font-mono text-[#00ff88]">{item.webpSize}</td>
                      <td className="py-2 font-mono font-bold text-[#00ff88]">{item.reduction}</td>
                      <td className="py-2 italic text-slate-300">alt="{item.altText}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-[9px] text-white/30 pt-3 border-t border-white/5">
                * Görseller otonom olarak CDN üzerinde sıkıştırılır. Crawl robotları için alt etiketleri otonom optimize edilmiştir.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
