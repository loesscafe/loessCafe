// src/utils/menuLoader.js

export const loadMenuData = async () => {
  try {
    const categories = [
      'sicakIcecekler',
      'turkKahvesi', 
      'sicakKahveler',
      'sogukKahveler',
      'frozenMilkshake',
      'spesiyel',
      'mesrubatlar',
      'tatlilar'
    ];

    const menuData = {};

    // Her kategori için boş dizi ile başla
    categories.forEach(category => {
      menuData[category] = [];
    });

    // Items klasöründeki tüm JSON dosyalarını yükle
    try {
      // Webpack context ile tüm JSON dosyalarını yükle
      const context = require.context('../data/items', false, /\.json$/);
      
      context.keys().forEach(key => {
        try {
          const item = context(key);
          const category = item.category;
          
          if (category && menuData[category]) {
            menuData[category].push(item);
          }
        } catch (error) {
          console.warn(`Item yüklenemedi: ${key}`, error);
        }
      });
    } catch (error) {
      console.warn('Items klasörü bulunamadı veya boş:', error);
    }

    // Her kategoriyi ID'ye göre sırala - EN KÜÇÜK ID (İLK EKLENİLEN) EN ÜSTTE
    Object.keys(menuData).forEach(category => {
      menuData[category].sort((a, b) => {
        const idA = a.id || 0;
        const idB = b.id || 0;
        
        // Küçükten büyüğe sırala (ilk eklenen en üstte)
        return idA - idB;
      });
    });

    return menuData;
  } catch (error) {
    console.error('Menu data yüklenemedi:', error);
    // Hata durumunda boş kategoriler döndür
    return {
      sicakIcecekler: [],
      turkKahvesi: [],
      sicakKahveler: [],
      sogukKahveler: [],
      frozenMilkshake: [],
      spesiyel: [],
      mesrubatlar: [],
      tatlilar: []
    };
  }
};

export const loadCafeInfo = async () => {
  try {
    const cafeInfo = await import('../data/cafeInfo.json');
    return cafeInfo.default || cafeInfo;
  } catch (error) {
    console.warn('Cafe info yüklenemedi:', error);
    // Varsayılan değerler
    return {
      name: "LOESS",
      mainSlogan: "Bohem dokunuş, eşsiz lezzet",
      subSlogan: "Bohem atmosferde lezzet yolculuğu",
      phone: "0XXX XXX XX XX",
      openingTime: "14:00",
      closingTime: "02:00",
      logo: "/images/kahve-icon.png"
    };
  }
};