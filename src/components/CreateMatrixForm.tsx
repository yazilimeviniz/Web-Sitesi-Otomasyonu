import React, { useState, useRef } from "react";
import { ThemePreference, ClientMatrixInput } from "../types";
import { 
  Sparkles, 
  Terminal, 
  Image, 
  Upload, 
  Mail, 
  MapPin, 
  Phone, 
  MessageSquare,
  Layers, 
  Check, 
  Layout, 
  AppWindow, 
  HelpCircle, 
  FileText, 
  ShoppingBag,
  Eye,
  Trash2
} from "lucide-react";

interface CreateMatrixFormProps {
  onSubmit: (input: ClientMatrixInput) => void;
  isLoading: boolean;
}

export default function CreateMatrixForm({ onSubmit, isLoading }: CreateMatrixFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [sector, setSector] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [pageType, setPageType] = useState<"single-page" | "multi-page">("multi-page");
  const [servicesSummary, setServicesSummary] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [theme, setTheme] = useState<ThemePreference>(ThemePreference.AI_CHOOSE);
  
  // Custom design and details
  const [googleMapsReviewsUrl, setGoogleMapsReviewsUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [heroStyle, setHeroStyle] = useState<any>("ai-choose");
  const [servicesStyle, setServicesStyle] = useState<any>("ai-choose");

  // Reusable features toggles & layouts
  const [whatsappBtn, setWhatsappBtn] = useState(true);
  const [leadForm, setLeadForm] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [testimonialCarousel, setTestimonialCarousel] = useState(true);
  const [faqSection, setFaqSection] = useState(true);
  const [popupBanner, setPopupBanner] = useState(false);
  const [webpCompression, setWebpCompression] = useState(true);

  // Reusable Library layouts picker states
  const [whatsappIntegrationType, setWhatsappIntegrationType] = useState<any>("ai-choose");
  const [popupType, setPopupType] = useState<any>("ai-choose");
  const [galleryLayout, setGalleryLayout] = useState<any>("ai-choose");
  const [blogTemplate, setBlogTemplate] = useState<any>("ai-choose");
  const [ecommerceCatalog, setEcommerceCatalog] = useState<any>("ai-choose");
  const [showGmapsReviews, setShowGmapsReviews] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Görsel boyutu 2MB'dan büyük olamaz!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Görsel boyutu 2MB'dan büyük olamaz!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !sector.trim() || !servicesSummary.trim() || !companyEmail.trim() || !companyAddress.trim()) {
      return;
    }

    const payload: ClientMatrixInput = {
      companyName: companyName.trim(),
      sector: sector.trim(),
      companyEmail: companyEmail.trim(),
      companyAddress: companyAddress.trim(),
      pageType,
      servicesSummary: servicesSummary.trim(),
      targetAudience: targetAudience.trim(),
      contactPhone: contactPhone.trim(),
      whatsappMessage: whatsappMessage.trim(),
      googleMapsReviewsUrl: googleMapsReviewsUrl.trim() || undefined,
      logoUrl: logoUrl.trim() || undefined,
      heroStyle,
      servicesStyle,
      features: {
        whatsappBtn,
        leadForm,
        newsletter,
        testimonialCarousel,
        faqSection,
        popupBanner,
        webpCompression,
        whatsappIntegrationType,
        popupType,
        galleryLayout,
        blogTemplate,
        ecommerceCatalog,
        showGmapsReviews
      },
      theme
    };
    onSubmit(payload);
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-none shadow-2xl overflow-hidden text-left" id="matrix-form-container">
      {/* Header Banner */}
      <div className="bg-[#0d0d0d] p-6 text-white flex justify-between items-center border-b border-white/15">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#00ff88] font-bold">01 // GİRİŞ MATRİSİ</span>
          <h2 className="text-xl font-serif italic tracking-tight mt-1 text-white">Yapay Zeka Dijital Üretim Hattı</h2>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[#050505] px-3 py-1.5 rounded-none border border-white/10 font-mono">
          <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></span>
          <span className="text-white/60">OTONOM ALGORİTMA V4</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-7">
        
        {/* Brand Information */}
        <div className="space-y-4">
          <div className="border-b border-white/10 pb-2 flex justify-between items-center">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#00ff88] font-bold">01 // Firma & Sektör Profili</span>
            <span className="text-[9px] font-mono text-white/30">* Zorunlu Alanlar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
                Firma Adı / Marka Başlığı <span className="text-[#00ff88] font-bold">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Örn: Aura Diş Polikliniği, Onyx Kafe"
                className="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded-none text-white focus:outline-none focus:border-[#00ff88] transition-all text-xs font-mono placeholder-white/25"
              />
            </div>

            <div>
              <label htmlFor="sector" className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
                Faaliyet Gösterilen Sektör <span className="text-[#00ff88] font-bold">*</span>
              </label>
              <input
                id="sector"
                type="text"
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Örn: Butik Gelinlik Tasarımı, Diş Hekimliği, 3. Nesil Kahve"
                className="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded-none text-white focus:outline-none focus:border-[#00ff88] transition-all text-xs font-mono placeholder-white/25"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyEmail" className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
                İletişim E-Posta Adresi <span className="text-[#00ff88] font-bold">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-white/30"><Mail className="w-3.5 h-3.5" /></span>
                <input
                  id="companyEmail"
                  type="email"
                  required
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="info@yazilimeviniz.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-white/10 rounded-none text-white focus:outline-none focus:border-[#00ff88] transition-all text-xs font-mono placeholder-white/25"
                />
              </div>
            </div>

            <div>
              <label htmlFor="companyAddress" className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
                Adres <span className="text-[#00ff88] font-bold">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-white/30"><MapPin className="w-3.5 h-3.5" /></span>
                <textarea
                  id="companyAddress"
                  required
                  rows={3}
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Örn: Nispetiye Cd. No:3 E-Blok, Beşiktaş / İstanbul"
                  className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-white/10 rounded-none text-white focus:outline-none focus:border-[#00ff88] transition-all text-xs font-mono placeholder-white/25 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
                Sayfa Yapısı / Sayfa Tipi <span className="text-[#00ff88] font-bold">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPageType("single-page")}
                  className={`py-3 px-4 flex items-center justify-center gap-2 border text-[11px] font-mono transition-all ${pageType === "single-page" ? "bg-white text-black border-white" : "bg-[#121212] text-white/60 border-white/10 hover:border-white/30 hover:text-white"}`}
                >
                  <AppWindow className="w-3.5 h-3.5" />
                  Tek Sayfa (Landing)
                </button>
                <button
                  type="button"
                  onClick={() => setPageType("multi-page")}
                  className={`py-3 px-4 flex items-center justify-center gap-2 border text-[11px] font-mono transition-all ${pageType === "multi-page" ? "bg-white text-black border-white" : "bg-[#121212] text-white/60 border-white/10 hover:border-white/30 hover:text-white"}`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Çoklu Sayfa (Portal)
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="theme" className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
                Web Tasarım Tematik Şablonu
              </label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as ThemePreference)}
                className="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded-none text-white focus:outline-none focus:border-[#00ff88] transition-all text-xs font-mono"
              >
                <option value={ThemePreference.AI_CHOOSE}>🤖 Sektörel Kararla AI Seçsin</option>
                <option value={ThemePreference.LIGHT}>Aydınlık Minimalist (Sade Beyaz & Temiz Gri)</option>
                <option value={ThemePreference.DARK}>Karanlık Premium (Lüks Siyah & Gece Mavisi)</option>
                <option value={ThemePreference.CREATIVE_GALLERY}>🎨 Yaratıcı Galeri (Bebek Mavisi, Bej & Sanatsal)</option>
                <option value={ThemePreference.TECH_SAAS}>⚡ Gelecekçi SaaS & Teknoloji (Koyu Siyah & Neon Indigo)</option>
                <option value={ThemePreference.EDITORIAL_LUXURY}>⚜️ Ağırbaşlı Butik & Lüks (Krem, Açık Altın & Koyu Antrasit)</option>
                <option value={ThemePreference.APPLE_CLEAN}>🍏 Apple Tarzı Saf Akış (Saf Beyaz, Ultra İnce Hatlar)</option>
                <option value={ThemePreference.BRUTALIST_STREET}>🛹 Brutalist Sokak Retro (Sarı-Siyah Kontrast, Kalın Çizgi)</option>
                <option value={ThemePreference.CREATIVE_NEON_NOIR}>🎆 Tasarımcı Neon Gece (Koyu Karbon & Siber Mor & Parlak Pembe)</option>
                <option value={ThemePreference.MINIMALIST_JAPANDI}>🎋 Sadelik Japandi (Sıcak Ahşap Esintisi & Doğal Bej & Toprak)</option>
                <option value={ThemePreference.ORGANIC_ECO}>🌿 Organik Eko-Doku (Taze Doğa Yeşili & Organik Yaprak Krem)</option>
                <option value={ThemePreference.RETRO_BAUHAUS}>📐 Geometrik Retro Bauhaus (Tarihi Kübist Kırmızı & Mavi & Hardal)</option>
                <option value={ThemePreference.CYBER_TERMINAL}>📟 Monokrom Kod Terminali (Sert Gece Siyahı & Parlak Mat Matris Yeşili)</option>
              </select>
            </div>
          </div>

          {/* Logo & Favicon Media Dropzone */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
              Logo & Favicon Özel Görsel Yükleyici / Upload (Opsiyonel)
            </label>
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed p-5 rounded-none text-center cursor-pointer transition-all ${dragActive ? "border-[#00ff88] bg-[#00ff88]/5" : "border-white/10 bg-[#121212] hover:border-white/35"}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              
              {logoUrl ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2" onClick={(e) => e.stopPropagation()}>
                  <div className="relative group">
                    <img 
                      src={logoUrl} 
                      alt="Uploaded Logo Preview" 
                      className="h-14 w-auto object-contain bg-white/5 p-1 border border-white/20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-xs font-mono font-bold truncate max-w-xs">Görsel Yüklendi ({logoUrl.slice(0, 30)}...)</p>
                    <p className="text-white/40 text-[10px] sm:mt-0.5">Favicon ve Header Logo olarak otomatik adapte edildi.</p>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="mt-2 text-rose-500 hover:text-rose-400 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Görseli Kaldır
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-white/5 mx-auto flex items-center justify-center text-white/40">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-mono text-white/80">Sürükle bırak ya da cihazından seç (.png, .jpg)</p>
                  <p className="text-[10px] text-white/30">Maksimum dosya boyutu: 2MB. Boş bırakırsanız yapay zeka harika bir logo/favicon setini otonom üretir!</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="servicesSummary" className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
              Hizmetlerin Detaylı Matrisi & Değer Önergesi <span className="text-[#00ff88] font-bold">*</span>
            </label>
            <textarea
              id="servicesSummary"
              rows={3}
              required
              value={servicesSummary}
              onChange={(e) => setServicesSummary(e.target.value)}
              placeholder="Sizi benzersiz kılan hizmetleriniz nelerdir? Otonom içerik motoru bu veriyi başlıklar, akıcı pazarlama metinleri ve alt etiketli görsellere dönüştürecektir."
              className="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded-none text-white focus:outline-none focus:border-[#00ff88] transition-all text-xs font-mono placeholder-white/25"
            />
          </div>

          <div>
            <label htmlFor="targetAudience" className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
              Hedef Kitle Karakteristikleri (Boş bırakılırsa AI otonom belirler)
            </label>
            <input
              id="targetAudience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Örn: 24-45 yaş arası yüksek gelir grubu, estetik diş tasarımı arzulayanlar"
              className="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded-none text-white focus:outline-none focus:border-[#00ff88] transition-all text-xs font-mono placeholder-white/25"
            />
          </div>
        </div>

        {/* Layout & Component Styling Choice */}
        <div className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#00ff88] font-bold">02 // Gelişmiş Tasarım & Grid Stilleri</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="heroStyle" className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
                Hero Giriş Bölümü Sürümü
              </label>
              <select
                id="heroStyle"
                value={heroStyle}
                onChange={(e) => setHeroStyle(e.target.value)}
                className="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded-none text-white focus:outline-none focus:border-[#00ff88] transition-all text-xs font-mono"
              >
                <option value="ai-choose">🤖 AI Otonom Seçsin (Sektöre Göre En İyi Karar)</option>
                <option value="bold-minimalist">Bold Minimalist (Geniş Metin, Sol Odaklı Tipografi)</option>
                <option value="split-image">Split Layout (Yarım Ekran Görsel & Aksiyon Paneli)</option>
                <option value="centered-elegant">Centered Elegant (Orjinal Kalın Serif & Asil Asimetri)</option>
                <option value="glassmorphism-glow">Glassmorphism Glow (Işıltılı Küreler & Dokulu Cam Kartlar)</option>
                <option value="apple-minimalist">Apple Minimalist (Geniş Boşluklar, Modern İnce Fontlar)</option>
                <option value="futuristic-dashboard">Futuristic Dashboard (AI/Metrik Göstergeli Akıllı Arayüz)</option>
                <option value="neo-brutalist">Neo-Brutalist (Keskin Kenarlar, Siyah Çerçeveler & Sokak Stili)</option>
                <option value="interactive-slider">Interactive Slider (Yaratıcı Görsel Karoseli & Otomatik Geçiş)</option>
                <option value="full-slider-video">Full Video / Cinematic Slider (Yarı Şeffaf Sinematik Video Arka Planı)</option>
              </select>
            </div>

            <div>
              <label htmlFor="servicesStyle" className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
                Hizmet Kartları Grid Tasarımı
              </label>
              <select
                id="servicesStyle"
                value={servicesStyle}
                onChange={(e) => setServicesStyle(e.target.value)}
                className="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded-none text-white focus:outline-none focus:border-[#00ff88] transition-all text-xs font-mono"
              >
                <option value="ai-choose">🤖 AI Otonom Seçsin (UX Standartlarına Göre)</option>
                <option value="bento-box">Bento Box Pattern (Geometrik Farklı Akıllı Kutular)</option>
                <option value="hover-accent-border">Hover Accent Border (Zarif Çerçeve Geçişi)</option>
                <option value="neon-glassmorphism">Neon Glassmorphism (Dokunsal Küre, Flu Cam Kartlar)</option>
                <option value="editorial-grid">Editorial Grid (Dergi Model Ağırbaşlılığı)</option>
                <option value="apple-list">Apple List (Geniş Detaylı Geniş Tekil Kartlar)</option>
                <option value="interactive-tabs">Interactive Tabs (Tıklanabilir Yatay Sekmeli Akış)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Integration and details */}
        <div className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#00ff88] font-bold">03 // İletişim & Harita Entegrasyon</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactPhone" className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
                İletişim Telefonu (WhatsApp İçin)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-white/30"><Phone className="w-3.5 h-3.5" /></span>
                <input
                  id="contactPhone"
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+90 555 123 4567"
                  className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-white/10 rounded-none text-white focus:outline-none focus:border-[#00ff88] transition-all text-xs font-mono placeholder-white/25"
                />
              </div>
            </div>

            <div>
              <label htmlFor="whatsappMessage" className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
                Hazır WhatsApp Balon Mesajı
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-white/30"><MessageSquare className="w-3.5 h-3.5" /></span>
                <input
                  id="whatsappMessage"
                  type="text"
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  placeholder="Örn: Merhaba, randevu talep ediyorum..."
                  className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-white/10 rounded-none text-white focus:outline-none focus:border-[#00ff88] transition-all text-xs font-mono placeholder-white/25"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="googleMapsReviewsUrl" className="block text-[11px] font-mono uppercase text-white/50 mb-1.5">
              Google Haritalar (My Business) İşletme Yorum URL'si
            </label>
            <input
              id="googleMapsReviewsUrl"
              type="text"
              value={googleMapsReviewsUrl}
              onChange={(e) => setGoogleMapsReviewsUrl(e.target.value)}
              placeholder="Örn: https://maps.google.com/?cid=... (Boş bırakılırsa yapay zeka harika yorum simülasyonları tasarlar)"
              className="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded-none text-white focus:outline-none focus:border-[#00ff88] transition-all text-xs font-mono placeholder-white/25"
            />
          </div>
        </div>

        {/* Feature Switches & Dynamic Component Library Pickers */}
        <div className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#00ff88] font-bold">04 // Kütüphane Modül Yerleşimleri</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Gallery Arrangement Picker */}
            <div className="p-3 bg-[#0d0d0d] border border-white/10 flex flex-col justify-between">
              <label className="block text-[10px] font-mono uppercase text-white/60 mb-2">🖼️ Fotoğraf Galerisi Modülü</label>
              <select
                value={galleryLayout}
                onChange={(e) => setGalleryLayout(e.target.value as any)}
                className="w-full bg-[#121212] border border-white/10 p-2 text-xs font-mono text-white cursor-pointer focus:outline-none focus:border-[#00ff88]"
              >
                <option value="ai-choose">🤖 AI Şablona Göre Seçsin</option>
                <option value="grid-masonry">Asimetrik Masonry Düzeni</option>
                <option value="justified-bento">Geometrik Bento Fotoğraf Kartları</option>
                <option value="stacked-mosaic">Sıkıştırılmış Premium Mozaik</option>
                <option value="creative-neon-glow">Yaratıcı Parlak Neon Karosel (Neon Glow & Cyber Aura)</option>
                <option value="cyber-darkroom">Karanlık Studio / Cyber Darkroom (Siyah Çerçeve & Gece Temalı)</option>
                <option value="disabled">Galeriyi Devre Dışı Bırak</option>
              </select>
            </div>

            {/* Blog Arrangement Picker */}
            <div className="p-3 bg-[#0d0d0d] border border-white/10 flex flex-col justify-between">
              <label className="block text-[10px] font-mono uppercase text-white/60 mb-2">✍️ Blog & Makale Şablonu</label>
              <select
                value={blogTemplate}
                onChange={(e) => setBlogTemplate(e.target.value as any)}
                className="w-full bg-[#121212] border border-white/10 p-2 text-xs font-mono text-white cursor-pointer focus:outline-none focus:border-[#00ff88]"
              >
                <option value="ai-choose">🤖 AI Sektörel Makale Üretsin</option>
                <option value="editorial-cards">Editorial Magazin Görsel Kartlar</option>
                <option value="detailed-list">Tarihsel Detaylı Liste Şablonu</option>
                <option value="disabled">Blog Modülünü Devre Dışı Bırak</option>
              </select>
            </div>

            {/* E-Commerce Arrangement Picker */}
            <div className="p-3 bg-[#0d0d0d] border border-white/10 flex flex-col justify-between">
              <label className="block text-[10px] font-mono uppercase text-white/60 mb-2">🛍️ E-Ticaret / Ürün Kataloğu</label>
              <select
                value={ecommerceCatalog}
                onChange={(e) => setEcommerceCatalog(e.target.value as any)}
                className="w-full bg-[#121212] border border-white/10 p-2 text-xs font-mono text-white cursor-pointer focus:outline-none focus:border-[#00ff88]"
              >
                <option value="ai-choose">🤖 AI Ürün Matrisi Tanımlasın</option>
                <option value="mini-products">Mini Katalog & Fiyat Sepet Butonu</option>
                <option value="services-grid">Destekçi Ek Hizmetler Ağ Kartı</option>
                <option value="disabled">E-Ticareti Devre Dışı Bırak</option>
              </select>
            </div>

            {/* WhatsApp Widget Switcher */}
            <div className="p-3 bg-[#0d0d0d] border border-white/10 flex flex-col justify-between">
              <label className="block text-[10px] font-mono uppercase text-white/60 mb-2">💬 WhatsApp Entegrasyon Türü</label>
              <select
                value={whatsappIntegrationType}
                onChange={(e) => setWhatsappIntegrationType(e.target.value as any)}
                className="w-full bg-[#121212] border border-white/10 p-2 text-xs font-mono text-white cursor-pointer focus:outline-none focus:border-[#00ff88]"
              >
                <option value="ai-choose">🤖 AI Konuma Göre Karar Versin</option>
                <option value="standard-bubble">Yüzen Standart Yeşil Balon (Sağ Alt)</option>
                <option value="floating-chat">Mini Destekçi Sohbet Kart Modeli</option>
                <option value="footer-cta">Footer Sabit Canlı Asistan Şeridi</option>
                <option value="none">WhatsApp Butonunu Kaldır</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <label className="relative flex items-start p-3 bg-[#0d0d0d] rounded-none border border-white/10 cursor-pointer hover:border-white/30 hover:bg-[#121212] transition-all">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={leadForm}
                  onChange={(e) => setLeadForm(e.target.checked)}
                  className="rounded-none border-white/20 bg-[#151515] text-[#00ff88] focus:ring-0 focus:ring-offset-0"
                />
              </div>
              <div className="ml-3 text-xs">
                <span className="font-mono font-bold text-white block">Lead Toplama Formu</span>
                <span className="text-white/40 text-[10px]">Müşterilerin teklif / randevu isteyebileceği otonom form.</span>
              </div>
            </label>

            <label className="relative flex items-start p-3 bg-[#0d0d0d] rounded-none border border-white/10 cursor-pointer hover:border-white/30 hover:bg-[#121212] transition-all">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={popupBanner}
                  onChange={(e) => setPopupBanner(e.target.checked)}
                  className="rounded-none border-white/20 bg-[#151515] text-[#00ff88] focus:ring-0 focus:ring-offset-0"
                />
              </div>
              <div className="ml-3 text-xs">
                <span className="font-mono font-bold text-white block">Promosyon Pop-up Modeli</span>
                <span className="text-white/40 text-[10px]">Açılışta otonom indirim kuponu veya duyuru gösterici.</span>
              </div>
            </label>

            <label className="relative flex items-start p-3 bg-[#0d0d0d] rounded-none border border-white/10 cursor-pointer hover:border-white/30 hover:bg-[#121212] transition-all">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={showGmapsReviews}
                  onChange={(e) => setShowGmapsReviews(e.target.checked)}
                  className="rounded-none border-white/20 bg-[#151515] text-[#00ff88] focus:ring-0 focus:ring-offset-0"
                />
              </div>
              <div className="ml-3 text-xs">
                <span className="font-mono font-bold text-white block">Google Maps Puan & Rozetleri</span>
                <span className="text-white/40 text-[10px]">Harita yıldızlarını ve referans yorumlarını entegre eder.</span>
              </div>
            </label>

            <label className="relative flex items-start p-3 bg-[#0d0d0d] rounded-none border border-white/10 cursor-pointer hover:border-white/30 hover:bg-[#121212] transition-all">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="rounded-none border-white/20 bg-[#151515] text-[#00ff88] focus:ring-0 focus:ring-offset-0"
                />
              </div>
              <div className="ml-3 text-xs">
                <span className="font-mono font-bold text-white block">E-Bülten Kayıt Formu</span>
                <span className="text-white/40 text-[10px]">Altbilgiye entegre sızdırmaz mail abonelik mekanizması.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Action Trigger */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !companyName.trim() || !sector.trim() || !servicesSummary.trim() || !companyEmail.trim() || !companyAddress.trim()}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-white text-black hover:bg-[#00ff88] transition-colors font-mono font-bold uppercase tracking-[0.2em] rounded-none disabled:opacity-30 disabled:cursor-not-allowed group cursor-pointer"
            id="generator-submit-btn"
          >
            {isLoading ? (
              <>
                <Terminal className="w-4 h-4 animate-spin text-black" />
                <span className="text-[11px] tracking-wide font-bold">Otonom Ajans Bandı İşleniyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
                <span className="text-[11px] tracking-wide font-extrabold">Otonom Üretim Bandını Başlat</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
