import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { ThemePreference, ClientMatrixInput, GeneratedWebsite, BlogPost, ProductItem, GalleryItem, GoogleReview } from "./src/types";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to initialize Google GenAI with appropriate User-Agent
function getGeminiAi(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Unsplash high-resolution structured imagery database by sector
interface SectorAssets {
  hero: string;
  services: string[];
  gallery: { imageUrl: string; title: string; description: string; category: string; }[];
  blogImages: string[];
  productImages: string[];
}

const SECTOR_IMAGE_ASSETS: Record<string, SectorAssets> = {
  "Sağlık & Yaşam (Klinik, Diyetisyen, Psikolog)": {
    hero: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    services: [
      "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
    ],
    gallery: [
      { imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80", title: "Modern Klinik Muayene Odası", description: "Tam donanımlı, hijyenik ve ferah operasyon alanı.", category: "Klinik" },
      { imageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=600&q=80", title: "Hasta Danışma & Karşılama Lobi", description: "Sakinleştirici tonlarla döşenmiş konforlu dinlenme salonu.", category: "Tesis" },
      { imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80", title: "Hassas Tanı Teknolojileri", description: "En güncel 3D tarama ve dijital röntgen ekipmanları.", category: "Teknoloji" },
      { imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80", title: "Birebir Seans Salonu", description: "Sakinleştirici aydınlatma ve akustik tasarımlı görüşme odası.", category: "Danışmanlık" },
      { imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80", title: "Laboratuvar & Analiz", description: "Güvenilir test ve teşhis metotlarının yürütüldüğü laboratuvar.", category: "Laboratuvar" },
      { imageUrl: "https://images.unsplash.com/photo-1504813184591-0155a8c17947?auto=format&fit=crop&w=600&q=80", title: "Gülüş Estetiği Planlama", description: "Kişiselleştirilmiş dijital diş hekimliği yazılım simülasyonu.", category: "Tedavi" }
    ],
    blogImages: [
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80"
    ],
    productImages: [
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "Kurumsal Teknoloji & SaaS": {
    hero: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    services: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
    ],
    gallery: [
      { imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80", title: "Ar-Ge ve Geliştirme Ofisi", description: "En yüksek odakla çalışan mühendislik ve ürün ekiplerimiz.", category: "Çalışma Alanı" },
      { imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", title: "SaaS Analiz Kontrol Panelleri", description: "Büyük verinin real-time görselleştirildiği gelişmiş arayüz modelleri.", category: "Arayüz" },
      { imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80", title: "Dinamik Ekip Beyin Fırtınası", description: "Hızlı geliştirme döngüleri ve scrum mimarisi toplantıları.", category: "Takım" },
      { imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80", title: "Yapay Zeka Core Altyapı", description: "Deep learning ve nöral ağlar barındıran otonom server sunucuları.", category: "Teknoloji" },
      { imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80", title: "Kullanıcı Deneyimi Test Odası", description: "A/B testleri ile dönüşüm oranı en yükseğe çıkarılan kullanıcı gözlemleri.", category: "Analiz" },
      { imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80", title: "Sıfır Hata Entegrasyon Bandı", description: "Siber güvenlik duvarları ve endüstriyel şifreleme katmanı.", category: "Güvenlik" }
    ],
    blogImages: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
    ],
    productImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "Gastronomi & Restoran/Kafe": {
    hero: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    services: [
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80"
    ],
    gallery: [
      { imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80", title: "Sıcak ve Minimalist Mekan İç Tasarımı", description: "Sürdürülebilir ahşap parçalarla bezelenmiş ferah freelance alanı.", category: "Konsept" },
      { imageUrl: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80", title: "Özel Tasarım Tatlı & Butik Lezzetler", description: "Günlük taze yumurta ve organik un ile hazırlanan el yapımı kruvasanlar.", category: "Lezzet" },
      { imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80", title: "Ağır Ateşte Pişmiş Steakhouse Gurme", description: "Meşe odunu dumanıyla aromalandırılmış premium barbekü tabakları.", category: "Mutfak" },
      { imageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80", title: "Nitelikli Espresso & Latte Sanatı", description: "Single-origin Kolombiya çekirdeklerinden otonom sıcaklıkla demlenen kahveler.", category: "Barista" },
      { imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80", title: "Açık Mutfak Canlı Şef Şovları", description: "Dünya mutfağı şeflerinin hijyen kurallarına tam uyumlu hazırlık aşamaları.", category: "Mutfak" },
      { imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80", title: "Bahçe & Açık Hava Dinlenme Köşesi", description: "Yaz akşamları fenerlerle aydınlatılan doğayla iç içe arka bahçemiz.", category: "Açık Hava" }
    ],
    blogImages: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"
    ],
    productImages: [
      "https://images.unsplash.com/photo-1568254183 focus1c-6d80d2109867?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "Finans, Yatırım & Hukuk Bürosu": {
    hero: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    services: [
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80"
    ],
    gallery: [
      { imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80", title: "Kurumsal Yönetim ve Strateji Kurulu", description: "Büyük yatırım planlarının ve portföy tahsislerinin yapıldığı merkez salonumuz.", category: "Finans" },
      { imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80", title: "Saygın Avukat Danışma Ofisi", description: "Hukuki uyuşmazlıklarda yüksek gizlilikle yürütülen mütalaa ve analiz seansları.", category: "Hukuk" },
      { imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80", title: "Lider Finans Portföy Yöneticisi", description: "Hisse senedi, tahvil ve dijital varlık grafik analiz seansları.", category: "Yatırım" },
      { imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80", title: "Prestijli Kütüphane & Mevzuat Odası", description: "Geniş içtihat kaynakları ve anayasal mevzuat arşivimizin yer aldığı araştırma kütüphanesi.", category: "Kurumsal" },
      { imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80", title: "Finans Merkezi Genel Müdürlük", description: "Modern mimariyle kaplanmış, kurumsal imajı pekiştiren genel merkez plazası.", category: "Plaza" },
      { imageUrl: "https://images.unsplash.com/photo-1504607798333-52a30db54a5d?auto=format&fit=crop&w=600&q=80", title: "Birebir Varlık Koruma İstişaresi", description: "Miras hukuku, aile anayasaları ve şirket devir işlemlerinin strateji odası.", category: "Uyuşmazlık" }
    ],
    blogImages: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80"
    ],
    productImages: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "Emlak & Dekorasyon/Mimarlık": {
    hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    services: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80"
    ],
    gallery: [
      { imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", title: "Minimalist Akdeniz Villa Cephesi", description: "Doğal taş kaplamaları ve lüks peyzaj tasarımı barındıran mimari şan.", category: "Lüks Villa" },
      { imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80", title: "Panoramasal Havuzlu Teras Tasarımı", description: "Açık hava şöminesi ve otonom aydınlatma entegreli güneşlenme güvertesi.", category: "Teras" },
      { imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80", title: "Geniş Premium Mutfak Tezgahı", description: "İtalyan mermerinden oyulmuş monoblok tezgah ve ankastre entegreli lüks mutfak.", category: "İç Mekan" },
      { imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80", title: "Yatak Odası Sıcak Ahşap Detayları", description: "Asma ahşap tavanlar ve gömülü spot aydınlatma ile tasarlanmış huzurlu yatak odası.", category: "İç Mekan" },
      { imageUrl: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=600&q=80", title: "Brutalist Beton Salon Tasarımı", description: "Geniş cam panellerle gün ışığını içeri davet eden endüstriyel lüks salon.", category: "Mimari" },
      { imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80", title: "Rezidanstaki Modern Çatı Katı", description: "Şehir silüetine sıfır çatı katı dairesinin modern dekoratif detayları.", category: "Emlak" }
    ],
    blogImages: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80"
    ],
    productImages: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "Butik Tasarım & Eğitim Ajansı": {
    hero: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80",
    services: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
    ],
    gallery: [
      { imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80", title: "Suluboya ve Eskiz Grafik Atölyesi", description: "Marka kimliklerinin ve illüstrasyonların doğduğu geleneksel masaüstümüz.", category: "Tasarım" },
      { imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80", title: "Kodlama & UX Geliştirme Eğitimi", description: "Geleceğin frontend mühendisleri için interaktif ve modüler sınıf simülatörleri.", category: "Eğitim" },
      { imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80", title: "Kurumsal Dijital Tasarım Sprinti", description: "Günde 8 saatlik yoğunlaştırılmış otonom marka tasarımı çalıştaylarımız.", category: "Tasarım" },
      { imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80", title: "Kreatif Toplantı ve Karşılama Alanı", description: "Yeni fikirlerin yeşillikler arasında konuşulduğu modern, heyecanlı ortak alan.", category: "Atölye" },
      { imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80", title: "Eğlenceli Kutlama & Mezuniyet Anı", description: "Başarıyla tamamlanan otonom tasarım sınıflarımızın ödül ve sertifika seremonisi.", category: "Eğitim" },
      { imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80", title: "Kişiselleştirilmiş Mentörlük Seansı", description: "Profesyonel jüri değerlendirmeli tasarım portfolyosu hazırlama destekleri.", category: "Atölye" }
    ],
    blogImages: [
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"
    ],
    productImages: [
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"
    ]
  }
};

// Return a safe assets bundle based on sector name (with default)
function getSectorAssets(sectorName: string): SectorAssets {
  const normalized = SECTOR_IMAGE_ASSETS[sectorName];
  if (normalized) return normalized;
  // Default fallback if sector is generic/unknown
  return SECTOR_IMAGE_ASSETS["Butik Tasarım & Eğitim Ajansı"];
}

// Fallback high-fidelity website generator dictionary (when API key is missing)
function generateFallbackWebsite(input: ClientMatrixInput): GeneratedWebsite {
  const company = input.companyName || "Aura Web Çözümleri";
  const phone = input.contactPhone || "+90 555 123 4567";
  const whatsappMsg = input.whatsappMessage || "Merhaba, web siteniz üzerinden ulaştım.";
  const email = input.companyEmail || "iletisim@example.com";
  const address = input.companyAddress || "Merkez Ofis, İstanbul";
  const pageType = input.pageType || "multi-page";
  
  // Choose realistic sector if AI chooses otonomously
  let resolvedSector = input.sector;
  if (!resolvedSector || resolvedSector === "ai-choose") {
    resolvedSector = "Yaratıcı Dijital Hizmetler";
  }

  const assets = getSectorAssets(resolvedSector);

  // Decide design values based on Sector & Theme Preference
  let primaryColor = "#3b82f6"; // blue
  let secondaryColor = "#1d4ed8"; // dark blue
  let backgroundColor = "#fafafa"; // slate light
  let textColor = "#171717"; // dark slate
  let fontHeading = "Outfit";
  let fontBody = "Inter";
  let fontVibe = "Aydınlık Minimalist Sektörel Akış";
  let layout: "Bento" | "Classic" | "Minimalist" | "SaaS Grid" | "Apple Fluid" | "Glassmorphic Glow" | "Chic Gallery" | "Bold Retro" = "Classic";
  let themeDescription = "Sektöre en uygun akıllı görsel şema";

  if (input.theme === ThemePreference.LIGHT) {
    primaryColor = "#171717";
    secondaryColor = "#404040";
    backgroundColor = "#ffffff";
    textColor = "#171717";
    fontHeading = "Outfit";
    fontBody = "Inter";
    layout = "Minimalist";
    fontVibe = "Modern Aydınlık Minimalist Tasarım";
    themeDescription = "Temiz boşluklar ve siyah-beyaz netliği";
  } else if (input.theme === ThemePreference.DARK) {
    primaryColor = "#6366f1";
    secondaryColor = "#4f46e5";
    backgroundColor = "#030712";
    textColor = "#f9fafb";
    fontHeading = "Outfit";
    fontBody = "Inter";
    layout = "Classic";
    fontVibe = "Karanlık Premium Akış";
    themeDescription = "Lüks gece modu, yumuşak indigo tonları";
  } else if (input.theme === ThemePreference.CREATIVE_GALLERY) {
    primaryColor = "#1e3a8a";
    secondaryColor = "#3b82f6";
    backgroundColor = "#f7f4ef"; // cream/beige
    textColor = "#111827";
    fontHeading = "Playfair Display";
    fontBody = "Inter";
    layout = "Chic Gallery";
    fontVibe = "Sanatsal & Yaratıcı Galeri Esintisi";
    themeDescription = "Soft pastel krem tonları, zarif serif tipografisi";
  } else if (input.theme === ThemePreference.TECH_SAAS) {
    primaryColor = "#00ff88"; // neon green
    secondaryColor = "#10b981";
    backgroundColor = "#07080f"; // neon indigo black
    textColor = "#f3f4f6";
    fontHeading = "Space Grotesk";
    fontBody = "Inter";
    layout = "SaaS Grid";
    fontVibe = "SaaS & Yüksek Teknoloji Atmosferi";
    themeDescription = "Neon yeşil aksanlar, keskin kartlar, karanlık grid";
  } else if (input.theme === ThemePreference.EDITORIAL_LUXURY) {
    primaryColor = "#d97706"; // gold
    secondaryColor = "#92400e";
    backgroundColor = "#0d0d0d"; // deep luxury black
    textColor = "#fafaf9";
    fontHeading = "Cinzel";
    fontBody = "Lora";
    layout = "Classic";
    fontVibe = "Butik & Ağırbaşlı Lüks Estetiği";
    themeDescription = "Nostaljik şampanya ve altın dokunuşlar, derin siyah zemin";
  } else if (input.theme === ThemePreference.APPLE_CLEAN) {
    primaryColor = "#000000";
    secondaryColor = "#525252";
    backgroundColor = "#ffffff";
    textColor = "#171717";
    fontHeading = "Outfit";
    fontBody = "Inter";
    layout = "Apple Fluid";
    fontVibe = "Apple Tasarımı Saf Akış";
    themeDescription = "Geniş boşluklu asimetrik yerleşim, ince hatlar, lüks minimalizm";
  } else if (input.theme === ThemePreference.BRUTALIST_STREET) {
    primaryColor = "#facc15"; // bright yellow
    secondaryColor = "#000000";
    backgroundColor = "#facc15";
    textColor = "#000000";
    fontHeading = "Space Grotesk";
    fontBody = "Fira Code";
    layout = "Bold Retro";
    fontVibe = "Brutalist Sokak Kültürü & Retro Kontrast";
    themeDescription = "Sıradışı sarı-siyah zıtlıkları, kalın siyah çizgiler ve pikseller";
  } else if (input.theme === ThemePreference.CREATIVE_NEON_NOIR) {
    primaryColor = "#ec4899"; // pink
    secondaryColor = "#a855f7"; // purple
    backgroundColor = "#080710"; // carbon dark
    textColor = "#f4f4f6";
    fontHeading = "Space Grotesk";
    fontBody = "Inter";
    layout = "Glassmorphic Glow";
    fontVibe = "Yaratıcı Cyber Neon Akşam Esintisi";
    themeDescription = "Mor ve pembe siber tonlar, ışıltılı neon cam kartları ve göz alıcı karanlık oda kontrastı";
  } else if (input.theme === ThemePreference.MINIMALIST_JAPANDI) {
    primaryColor = "#8c7853"; // wood warm brown
    secondaryColor = "#d1c7bd"; // light warm sand
    backgroundColor = "#fcf9f5"; // cream-white sand
    textColor = "#2d2a26"; // charcoal
    fontHeading = "Outfit";
    fontBody = "Inter";
    layout = "Minimalist";
    fontVibe = "Dingin Japandi Sadelik ve Sıcaklık";
    themeDescription = "Zen dinginliği, doğal ahşap kahveleri, asimetrik mat bej dengesi ve geniş hava kanalları";
  } else if (input.theme === ThemePreference.ORGANIC_ECO) {
    primaryColor = "#15803d"; // organic forest green
    secondaryColor = "#16a34a"; // sage green
    backgroundColor = "#fbfbfa"; // leaf warm cream
    textColor = "#142514"; // earthy forest dark
    fontHeading = "Playfair Display";
    fontBody = "Lora";
    layout = "Bento";
    fontVibe = "Taze Doğa Yeşili & Organik Akıl Birliği";
    themeDescription = "Saf doğa tınıları, organik yeşil detaylar, ferah yaprak bej zeminler";
  } else if (input.theme === ThemePreference.RETRO_BAUHAUS) {
    primaryColor = "#dc2626"; // red
    secondaryColor = "#2563eb"; // blue
    backgroundColor = "#fefcf6"; // linen canvas
    textColor = "#0f172a";
    fontHeading = "Space Grotesk";
    fontBody = "Fira Code";
    layout = "Bold Retro";
    fontVibe = "Tarihi Geometrik Bauhaus Kübist Sanat";
    themeDescription = "Mat primer renkler (kırmızı, mavi, sarı-krem), cesur geometrik çerçeveler ve kalın çizgiler";
  } else if (input.theme === ThemePreference.CYBER_TERMINAL) {
    primaryColor = "#22c55e"; // bright terminal green
    secondaryColor = "#16a34a"; // forest green
    backgroundColor = "#020203"; // pure terminal black
    textColor = "#22c55e"; // green text
    fontHeading = "Space Grotesk";
    fontBody = "Fira Code";
    layout = "SaaS Grid";
    fontVibe = "Karanlık Kod Terminali Siyah-Siber";
    themeDescription = "Tamamen monokrom derin siyah zemin üzerinde parıldayan yeşil kod ve veri akışı";
  } else {
    // AI CHOOSE
    if (resolvedSector.toLowerCase().includes("klinik") || resolvedSector.toLowerCase().includes("diş") || resolvedSector.toLowerCase().includes("sağlık") || resolvedSector.toLowerCase().includes("psikolog")) {
      primaryColor = "#0d9488"; // teal
      secondaryColor = "#0f766e";
      backgroundColor = "#f0fdfa";
      textColor = "#115e59";
      fontHeading = "Outfit";
      fontBody = "Inter";
      layout = "Bento";
      fontVibe = "Sakinleştirici Klinik Esintisi";
    } else if (resolvedSector.toLowerCase().includes("yazılım") || resolvedSector.toLowerCase().includes("saas") || resolvedSector.toLowerCase().includes("teknoloji")) {
      primaryColor = "#3b82f6"; // blue
      secondaryColor = "#2563eb";
      backgroundColor = "#020617";
      textColor = "#f8fafc";
      fontHeading = "Space Grotesk";
      fontBody = "Inter";
      layout = "SaaS Grid";
      fontVibe = "Gelecekçi Teknoloji";
    } else if (resolvedSector.toLowerCase().includes("restoran") || resolvedSector.toLowerCase().includes("kafe") || resolvedSector.toLowerCase().includes("gastro") || resolvedSector.toLowerCase().includes("kahve")) {
      primaryColor = "#ea580c"; // orange
      secondaryColor = "#c2410c";
      backgroundColor = "#fffbeb";
      textColor = "#78350f";
      fontHeading = "Playfair Display";
      fontBody = "Inter";
      layout = "Classic";
      fontVibe = "Sıcak Gastronomi Akışı";
    } else {
      primaryColor = "#4f46e5";
      secondaryColor = "#312e81";
      backgroundColor = "#fafafa";
      textColor = "#171717";
      fontHeading = "Outfit";
      fontBody = "Inter";
      layout = "Classic";
      fontVibe = "Dinamik Sektörel Uyum";
    }
  }

  // Resolve styles otonomously if "ai-choose"
  const resolvedHeroStyle = input.heroStyle === "ai-choose" 
    ? (resolvedSector.toLowerCase().includes("teknoloji") || resolvedSector.toLowerCase().includes("saas") ? "futuristic-dashboard" : "apple-minimalist")
    : input.heroStyle;

  const resolvedServicesStyle = input.servicesStyle === "ai-choose"
    ? (resolvedSector.toLowerCase().includes("saas") ? "neon-glassmorphism" : "bento-box")
    : input.servicesStyle;

  // Resolve Whatsapp Layout otonomously or from choice
  const resolvedWhatsappType = (!input.features.whatsappIntegrationType || input.features.whatsappIntegrationType === "ai-choose")
    ? (resolvedSector.toLowerCase().includes("restoran") || resolvedSector.toLowerCase().includes("kafe") ? "floating-chat" : "standard-bubble")
    : input.features.whatsappIntegrationType;

  // Resolve Pop-up Layout
  const resolvedPopupType = (!input.features.popupType || input.features.popupType === "ai-choose")
    ? "discount-coupon"
    : input.features.popupType;

  const generatedServicesSummary = input.servicesSummary || "Web tabanlı çözümler, kreatif pazarlama stratejileri ve kurumsal entegrasyonlar sunuyoruz.";
  
  // Resolve mock Reviews list
  let googleReviews: GoogleReview[] | undefined = undefined;
  if (input.features.showGmapsReviews || input.googleMapsReviewsUrl) {
    googleReviews = [
      { authorName: "Ayşe Yılmaz", rating: 5, text: "Google Haritalar üzerinden bulmuştum, işletmenin ilgisi ve sunduğu profesyonel deneyim gerçekten eşsiz. Kesinlikle tavsiye ederim.", relativeTime: "3 gün önce", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" },
      { authorName: "Mehmet Demir", rating: 5, text: "Yüksek standartlarda bir hizmet. İşletme dürüstlüğü ve kalitesiyle 5 yıldızı sonuna kadar hak ediyor.", relativeTime: "1 hafta önce", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
      { authorName: "Caner Yıldız", rating: 4, text: "Tüm süreç boyu son derece ilgiliydiler. Google incelemelerindeki yüksek puanın hakkını veriyorlar.", relativeTime: "2 hafta önce", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" }
    ];
  }

  // Generate dynamic customized blog posts
  let blogPosts: BlogPost[] | undefined = undefined;
  if (input.features.blogTemplate !== "disabled") {
    blogPosts = [
      {
        title: `${resolvedSector} Alanında Başarının 5 Temel Sırrı`,
        summary: "Sektör liderlerinin en çok dikkat ettiği stratejik başlıklar ve dönüşüm oranlarını katlama metotları.",
        date: "27 Mayıs 2026",
        readTime: "4 dk okuma",
        imageUrl: assets.blogImages[0],
        author: "Hakan Kara // Kıdemli Analist"
      },
      {
        title: "Kullanıcı Deneyiminde (UX) Yapay Zeka Devrimi",
        summary: "Geleneksel web tasarımı kalıplarını yıkan, otomatik öğrenen otonom sistemlerin getirdiği eşsiz fırsatlar.",
        date: "14 Mayıs 2026",
        readTime: "7 dk okuma",
        imageUrl: assets.blogImages[1],
        author: "Merve Koç // Tasarım Direktörü"
      },
      {
        title: "2026 Dijital Dönüşüm Yol Haritası",
        summary: "Kurumsal işletmeler için operasyonel yükü minimize eden entegrasyon çözümleri ve yol gösterici pratikler.",
        date: "02 Mayıs 2026",
        readTime: "6 dk okuma",
        imageUrl: assets.blogImages[2],
        author: "Selim Aydın // Yazılım Mimarı"
      }
    ];
  }

  // Generate dynamic products list for E-Commerce option
  let ecommerceProducts: ProductItem[] | undefined = undefined;
  if (input.features.ecommerceCatalog !== "disabled") {
    ecommerceProducts = [
      {
        id: "prod-01",
        title: "Premium Başlangıç Paketi",
        price: "₺4,900",
        originalPrice: "₺6,500",
        description: `İşletmeniz için ${resolvedSector} odağında tüm temel otonom özellikleri barındıran profesyonel giriş kiti.`,
        imageUrl: assets.productImages[0]
      },
      {
        id: "prod-02",
        title: "Enterprise Otonom Entegrasyon",
        price: "₺12,000",
        description: "24/7 online koordinasyon, CRM entegrasyonları ve tam otomasyonlu yönetim modülleri.",
        imageUrl: assets.productImages[1]
      },
      {
        id: "prod-03",
        title: "Kıdemli SEO & Optimizasyon Danışmanlığı",
        price: "₺3,500",
        originalPrice: "₺4,500",
        description: "Google aramalarında ilk sırayı hedefleyen, Core Web Vitals uyumlu uzman hızlandırma pakedi.",
        imageUrl: assets.productImages[2]
      }
    ];
  }

  // Generate image lists
  let galleryList: GalleryItem[] | undefined = undefined;
  if (input.features.galleryLayout !== "disabled") {
    galleryList = assets.gallery;
  }

  const site: GeneratedWebsite = {
    companyName: company,
    sector: resolvedSector,
    tagline: `${company} ile Dijital Otonom Geleceği Keşfedin`,
    heroHeadline: `${company} / Otonom Sektörel Çözüm Laboratuvarı`,
    heroSubheadline: `${resolvedSector} gereksinimlerine tam uyumlu, en yüksek dönüşüm oranı (CRO) ve teknik SEO standartlarına sahip otonom web konseptiniz.`,
    heroCtaText: `Hemen Başlayın`,
    aboutText: `${company}, ${resolvedSector} alanında yenilikçi, modern ve dönüşüm odaklı stratejiler geliştirmek amacıyla kurulmuştur. Sektörel hedef kitleye (${input.targetAudience || "Tüm Alıcılar"}) yönelik en güncel UX pratiklerini uygulayarak işlerinizi büyütüyoruz.`,
    services: [
      {
        title: "Kişiselleştirilmiş Çözümler",
        description: `${generatedServicesSummary.substring(0, 110)}... detaylarıyla tasarlanan sektörel uygulama paketi.`,
        iconName: "Sparkles",
        conversionHook: "Hemen Teklif Alın %20 lansman indirimi kazanın!",
        imageUrl: assets.services[0]
      },
      {
        title: "24/7 Dijital Dönüşüm Hizmeti",
        description: "Entegre otomasyon araçları ile müşterilerinizin sorunlarını anında çözen akıllı arabirimler.",
        iconName: "Zap",
        conversionHook: "Otonom entegrasyon ile iş gücünden tasarruf edin.",
        imageUrl: assets.services[1]
      },
      {
        title: "Teknik SEO & Performans Altyapısı",
        description: "Arama motoru kriterlerine %100 uyumlu, WebP görsel sıkıştırmalı ve JSON-LD yapılandırılmış meta mimarisi.",
        iconName: "Search",
        conversionHook: "Google'da rakiplerinizin önüne geçmenize yardımcı olur.",
        imageUrl: assets.services[2]
      }
    ],
    uvpTexts: [
      "Hız & Performans Lideri WebP Altyapısı",
      "Yapay Zeka Destekli SEO & Sektörel Algoritma Sihirbazı",
      "Tek Tıklamayla WhatsApp veya İletişim Formu Çözümleri",
      "Mobil ve Tüm Masaüstü Ekranlarda Kusursuz Duyarlı Arayüz"
    ],
    faqList: [
      {
        question: `Hizmet süreci nasıl işlemektedir?`,
        answer: `Web üretim platformumuz, girdi matrisinizi analiz ederek en yüksek dönüşüm getiren sektörel yerleşim şemasını saniyeler içinde otonom kurar.`
      },
      {
        question: `SEO optimizasyonu yapılıyor mu?`,
        answer: `Evet, kıdemli bir SEO uzmanı gibi arka planda sitemap.xml, Schema.org JSON-LD yapılandırılmış verisi ve görsel WebP optimizasyonları otomatik entegre edilir.`
      }
    ],
    testimonials: [
      {
        clientName: "Caner Yıldız",
        role: "Kurucu Direktör",
        feedback: "Tasarım süreçlerinde günlerce revizyon beklemek yerine matrisi girip anında bu düzeyde kaliteli bir web sitesi elde etmek gerçekten devrimsel nitelikte.",
        rating: 5
      },
      {
        clientName: "Selin Demir",
        role: "Pazarlama Müdürü",
        feedback: "Dönüşüm oranları muazzam arttı. Renk paleti seçimi ve içerik yazımları tamamen nokta atışı yapılmış. Tebrik ediyorum.",
        rating: 5
      }
    ],
    popupContent: input.features.popupBanner ? {
      title: "Lansmana Özel Büyük Fırsat!",
      subtitle: `Web sitemize özel ilk randevuda veya siparişte geçerli indirim kodunu kaçırmayın.`,
      cta: "Kodu Kopyala",
      couponCode: "AUTOWEB2026",
      type: resolvedPopupType as any
    } : undefined,
    contactPrompt: `Bizimle hemen iletişime geçin, ${company} güvencesiyle otonom dijital dönüşümün avantajlarından yararlanın.`,
    contactPhone: phone,
    whatsappMessage: whatsappMsg,
    
    companyEmail: email,
    companyAddress: address,
    pageType: pageType,
    
    // Custom inputs
    googleMapsReviewsUrl: input.googleMapsReviewsUrl,
    logoUrl: input.logoUrl,
    heroStyle: resolvedHeroStyle as any,
    servicesStyle: resolvedServicesStyle as any,
    resolvedUnsplashHeroUrl: assets.hero,

    // Component lists
    blogPosts,
    ecommerceProducts,
    galleryList,
    googleReviews,
    resolvedWhatsappType: resolvedWhatsappType as any,

    design: {
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor,
      fontFamilyHeading: fontHeading,
      fontFamilyBody: fontBody,
      fontPairingVibe: fontVibe,
      layoutStructure: layout
    },
    seo: {
      metaTitle: `${company} | Profesyonel Hizmetler & Otonom Gelecek`,
      metaDescription: `${company} hakkında detaylar ve ${resolvedSector} sektörüne yönelik yüksek dönüşüm odaklı profesyonel çözümler.`,
      metaKeywords: [company, resolvedSector, "otonom web", "hızlı yükleme", "local seo", "responsive"],
      structuredDataJson: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": company,
        "telephone": phone,
        "description": `${company} - ${resolvedSector} Sektörel Profesyonel Hizmetler Altyapısı.`,
        "url": `https://example.com/${company.toLowerCase().replace(/\s+/g, '-')}`
      }, null, 2),
      sitemapXml: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-05-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/hizmetler</loc>
    <lastmod>2026-05-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://example.com/iletisim</loc>
    <lastmod>2026-05-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`,
      robotsTxt: `User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml`,
      webpOptimizations: [
        { filename: "hero-bg.jpg", originalSize: "1.2 MB", webpSize: "145 KB", reduction: "88%", altText: `${company} Otonom Kahraman Arka Plan Görseli` },
        { filename: "service-1.png", originalSize: "680 KB", webpSize: "72 KB", reduction: "89%", altText: `${company} Hizmet Şeması` },
        { filename: "gallery-item-1.jpg", originalSize: "980 KB", webpSize: "115 KB", reduction: "88%", altText: `${company} Galeri Portföy Görseli` }
      ],
      errorContent404: {
        heading: "Aradığınız Sayfa Otonom Olarak Başka Bir Boyuta Taşındı!",
        body: "Üzgünüz, teknik SEO ekibimiz her şeyi mükemmelleştirirken bu sayfanın bağlantısı değişmiş olabilir. 404 hatalarını takip ediyor ve otomatik düzeltiyoruz.",
        recoveryCta: "Ana Sayfaya Dön"
      }
    },
    aiOrchestratorLogs: [
      { role: "UX Analyst", message: `Hedef kitle olan (${input.targetAudience || "Tüm Alıcılar/Müşteriler"}) analizi tamamlandı. Sektörel dönüm noktaları tespit edildi.`, timestamp: "22:46:21" },
      { role: "Creative Director", message: `Renk psikolojisi kurgulandı: '${themeDescription}' rengi otonom kararlaştırıldı. Font ikilisi olarak '${fontHeading}' & '${fontBody}' seçildi. Stiller: Hero: '${resolvedHeroStyle}' ve Hizmet Kartları: '${resolvedServicesStyle}'`, timestamp: "22:46:22" },
      { role: "Copywriter", message: "Yüksek odaklı Türkçe pazarlama copywriting metinleri, başlıklar ve CTA aksiyonları seo-friendly oluşturuldu.", timestamp: "22:46:23" },
      { role: "SEO Specialist", message: "Teknik SEO: Sitemap.xml haritası çıkarıldı. JSON-LD Schema işaretlemeleri yerel işletme etiketleriyle donatıldı.", timestamp: "22:46:24" },
      { role: "Developer Team", message: `Mobil duyarlı ${layout} web arayüzü ve entegre özellikler (WhatsApp butonu tarzı: '${resolvedWhatsappType}', blog şablonu, e-ticaret) derlendi. WebP görsel sıkıştırma simülatörü kuruldu.`, timestamp: "22:46:25" }
    ]
  };

  site.theme = input.theme;
  site.features = input.features;

  return site;
}

// REST API endpoint to generate website config via Gemini
app.post("/api/generate-website", async (req: Request, res: Response) => {
  try {
    const input: ClientMatrixInput = req.body;
    const ai = getGeminiAi();

    if (!ai) {
      console.log("No valid Gemini API Key. Proceeding with high-fidelity fallback production engine.");
      const fallbackResult = generateFallbackWebsite(input);
      return res.json({
        success: true,
        source: "local-production-intelligence",
        data: fallbackResult
      });
    }

    // Resolve otonomously beforehand
    let resolvedSector = input.sector;
    if (!resolvedSector || resolvedSector === "ai-choose") {
      resolvedSector = "Yaratıcı Dijital Hizmetler";
    }
    const assets = getSectorAssets(resolvedSector);

    // Build creative prompt for autonomous SEO & Conversion-Optimized Production
    const systemInstruction = `Sen otonom bir web ajansı yazılımı, kıdemli UX tasarımcısı, kıdemli Google SEO uzmanı ve dönüşüm oranı artırıcı (CRO) metin yazarısın.
Kullanıcıdan gelen "Müşteri Girdi Matrisi" doğrultusunda, otonom olarak Türk dili kurallarına uygun, son derece profesyonel, göz alıcı ve kusursuz bir kurumsal web sitesi verisi üretmelisin.

Müşteri Girdileri:
- Firma Adı: ${input.companyName}
- Sektör: ${input.sector}
- İletişim E-Postası: ${input.companyEmail}
- İletişim Açık Adresi: ${input.companyAddress}
- Sayfa Tipi: ${input.pageType} (Tek Sayfa ya da Çoklu Sayfa)
- Hizmet Özeti/Detaylar: ${input.servicesSummary}
- Hedef Kitle: ${input.targetAudience}
- Tema Tercihi: ${input.theme}
- Seçilen Özellikler ve Seçenekler: ${JSON.stringify(input.features)}
- Google Harita Yorum URL: ${input.googleMapsReviewsUrl || ""}
- Logo URL / Favicon: ${input.logoUrl || ""}
- Tercih Edilen Hero Stili: ${input.heroStyle}
- Tercih Edilen Hizmetler Stili: ${input.servicesStyle}

GÖREVLERİN:
1. Akıllı Tasarım Kararları: Sektöre ve hedef kitleye en uygun renk paletini (# hex), en gelişmiş Modern Serif ya da Geometric Sans font ikilisini seç. Layout yapısını ('Bento', 'Classic', 'Minimalist', 'SaaS Grid' şeklinde seçip açıkla).
2. Profesyonel Metin Yazarlığı (Copywriting): Müşteriye sıkıcı taslak metinler sunma. Dönüşümü patlatacak başlıklar, alt metinler, hizmet detayları ve dikkat çekici CTA cümleleri yaz.
3. Kütüphane / Bileşen Entegrasyonları (ÇOK ÖNEMLİ):
   - Müşterinin girdi matrisindeki "features" seçimleri doğrultusunda şunları dâhil et:
     - Blog Posts: Eğer blogTemplate aktif edildiyse, sektörle alakalı her birinde yazar, başlık, özet ve Unsplash görsel linki (şu havuzdan seç: ${JSON.stringify(assets.blogImages)}) içeren 3 adet blogPost üret.
     - E-Commerce Products: Eğer ecommerceCatalog aktif edildiyse, fiyat, başlık, özgün Unsplash resmi (şu havuzdan seç: ${JSON.stringify(assets.productImages)}) içeren 3 adet productItem üret.
     - Google Harita Yorumları listesi: Eğer harita URL'si girilmiş ya da showGmapsReviews aktifse, 3 adet son derece gerçekçi müşteri yorumunu 'googleReviews' altına yerleştir (yazar, yıldız rating: 4-5, yorum metni ve relativeTime).
     - Galeri Listesi: Eğer galleryLayout aktif edildiyse, ${JSON.stringify(assets.gallery)} listesine benzer şekilde Unsplash görsellerinden oluşan bir galleryList nesnesi oluştur (imageUrl, category, title, description).
     - WhatsApp Buton Seçimi: 'whatsappIntegrationType' değerini 'standard-bubble', 'floating-chat' veya 'footer-cta' arasından sektöre en uyan tarzda kesinleştirerek 'resolvedWhatsappType' değerine set et.
4. Kıdemli SEO Katmanı: Sektöre göre harika Meta Başlığı, Meta Açıklaması ve popüler odak anahtar kelimeleri seç. Schema.org standartlarında mükemmel bir LocalBusiness JSON-LD Yapılandırılmış verisi hazırla. sitemap.xml şablonu ve robots.txt kurallarını oluştur.
5. WebP Sıkıştırma Kayıtları: Web sitemizde kullanılan resimlerin (altText dahil) optimizasyon simülasyon listesini (originalSize -> webpSize %80+ tasarruflu) oluştur.
6. Otonom Günlük Kaydı: Tasarım ve bileşen kütüphanesinden otonom parça seçim kararlarını açıklayan 5 adet orchestrator log mesajı diz (UX Analyst, Creative Director, Copywriter, SEO Specialist, Developer Team).

Yanıtını kesinlikle saf JSON formatında vermeli ve aşağıdaki şemaya tam olarak uymalısın. JSON içerisinde kesinlikle Markdown kod blokları (\`\`\`json vb.) bulunmamalı, doğrudan parse edilebilir saf JSON nesnesi dönmelisin.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        companyName: { type: Type.STRING },
        sector: { type: Type.STRING },
        companyEmail: { type: Type.STRING },
        companyAddress: { type: Type.STRING },
        pageType: { type: Type.STRING },
        tagline: { type: Type.STRING },
        heroHeadline: { type: Type.STRING },
        heroSubheadline: { type: Type.STRING },
        heroCtaText: { type: Type.STRING },
        aboutText: { type: Type.STRING },
        services: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              iconName: { type: Type.STRING },
              conversionHook: { type: Type.STRING },
              imageUrl: { type: Type.STRING }
            },
            required: ["title", "description", "iconName", "conversionHook", "imageUrl"]
          }
        },
        uvpTexts: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        faqList: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING }
            },
            required: ["question", "answer"]
          }
        },
        testimonials: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              clientName: { type: Type.STRING },
              feedback: { type: Type.STRING },
              rating: { type: Type.INTEGER },
              role: { type: Type.STRING }
            },
            required: ["clientName", "feedback", "rating", "role"]
          }
        },
        popupContent: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            cta: { type: Type.STRING },
            couponCode: { type: Type.STRING },
            type: { type: Type.STRING }
          },
          required: ["title", "subtitle", "cta", "type"]
        },
        contactPrompt: { type: Type.STRING },
        contactPhone: { type: Type.STRING },
        whatsappMessage: { type: Type.STRING },
        
        // Custom variables
        googleMapsReviewsUrl: { type: Type.STRING },
        logoUrl: { type: Type.STRING },
        faviconEmoji: { type: Type.STRING },
        heroStyle: { type: Type.STRING },
        servicesStyle: { type: Type.STRING },
        resolvedUnsplashHeroUrl: { type: Type.STRING },
        resolvedWhatsappType: { type: Type.STRING },

        // Extra dynamic sections if matching features are selected
        blogPosts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              date: { type: Type.STRING },
              readTime: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              author: { type: Type.STRING }
            },
            required: ["title", "summary", "date", "readTime", "imageUrl", "author"]
          }
        },
        ecommerceProducts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              price: { type: Type.STRING },
              originalPrice: { type: Type.STRING },
              description: { type: Type.STRING },
              imageUrl: { type: Type.STRING }
            },
            required: ["id", "title", "price", "description", "imageUrl"]
          }
        },
        galleryList: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              imageUrl: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["imageUrl", "title", "description", "category"]
          }
        },
        googleReviews: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              authorName: { type: Type.STRING },
              rating: { type: Type.INTEGER },
              text: { type: Type.STRING },
              relativeTime: { type: Type.STRING },
              avatarUrl: { type: Type.STRING }
            },
            required: ["authorName", "rating", "text", "relativeTime"]
          }
        },

        design: {
          type: Type.OBJECT,
          properties: {
            primaryColor: { type: Type.STRING },
            secondaryColor: { type: Type.STRING },
            backgroundColor: { type: Type.STRING },
            textColor: { type: Type.STRING },
            fontFamilyHeading: { type: Type.STRING },
            fontFamilyBody: { type: Type.STRING },
            fontPairingVibe: { type: Type.STRING },
            layoutStructure: { type: Type.STRING }
          },
          required: ["primaryColor", "secondaryColor", "backgroundColor", "textColor", "fontFamilyHeading", "fontFamilyBody", "fontPairingVibe", "layoutStructure"]
        },
        seo: {
          type: Type.OBJECT,
          properties: {
            metaTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            metaKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            structuredDataJson: { type: Type.STRING },
            sitemapXml: { type: Type.STRING },
            robotsTxt: { type: Type.STRING },
            webpOptimizations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  filename: { type: Type.STRING },
                  originalSize: { type: Type.STRING },
                  webpSize: { type: Type.STRING },
                  reduction: { type: Type.STRING },
                  altText: { type: Type.STRING }
                },
                required: ["filename", "originalSize", "webpSize", "reduction", "altText"]
              }
            },
            errorContent404: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                body: { type: Type.STRING },
                recoveryCta: { type: Type.STRING }
              },
              required: ["heading", "body", "recoveryCta"]
            }
          },
          required: ["metaTitle", "metaDescription", "metaKeywords", "structuredDataJson", "sitemapXml", "robotsTxt", "webpOptimizations", "errorContent404"]
        },
        aiOrchestratorLogs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              message: { type: Type.STRING },
              timestamp: { type: Type.STRING }
            },
            required: ["role", "message", "timestamp"]
          }
        }
      },
      required: ["companyName", "sector", "companyEmail", "companyAddress", "pageType", "tagline", "heroHeadline", "heroSubheadline", "heroCtaText", "aboutText", "services", "uvpTexts", "faqList", "testimonials", "contactPrompt", "contactPhone", "whatsappMessage", "design", "seo", "aiOrchestratorLogs", "heroStyle", "servicesStyle", "resolvedUnsplashHeroUrl", "resolvedWhatsappType"]
    };

    console.log("Calling Gemini 3.5 Flash Model for Autonomous Generation with Component Library Support...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Lütfen yukarıdaki talimatlara uygun olarak otonom web sitesi tasarımı, SEO ve kütüphane entegrasyonlarını (görsel unsurlar içeren, blogPosts: ${input.features.blogTemplate !== "disabled"}, ecommerceProducts: ${input.features.ecommerceCatalog !== "disabled"}, googleReviews: ${input.features.showGmapsReviews || !!input.googleMapsReviewsUrl}) içeren veriyi sağlanan JSON şemasına tam uyarak üretin.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.9,
      },
    });

    const textOutput = response.text || "";
    const parsedData = JSON.parse(textOutput.trim());

    // Inject exact image assets if Gemini picks placeholders to guarantee visually perfect loads
    if (!parsedData.resolvedUnsplashHeroUrl) {
      parsedData.resolvedUnsplashHeroUrl = assets.hero;
    }
    
    // Inject image urls directly to services to ensure beautiful UI
    if (parsedData.services && parsedData.services.length > 0) {
      parsedData.services.forEach((s: any, idx: number) => {
        if (!s.imageUrl) {
          s.imageUrl = assets.services[idx % assets.services.length];
        }
      });
    }

    parsedData.theme = input.theme;
    parsedData.features = input.features;

    return res.json({
      success: true,
      source: "gemini-3.5-flash-intelligence",
      data: parsedData
    });

  } catch (error: any) {
    console.error("Gemini Production Error (Ext Component mode): ", error);
    // Fallback instantly if error occurs
    const fallbackSite = generateFallbackWebsite(req.body);
    return res.json({
      success: true,
      source: "fallback-production-on-error",
      note: "Gemini response issue, triggered autonomous local blueprint backup",
      data: fallbackSite
    });
  }
});

// Configure Vite integration or build asset server based on production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Autonomous Live Production Server is running on port ${PORT}`);
  });
}

start();
