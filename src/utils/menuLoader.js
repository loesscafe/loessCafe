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

    try {
      // Webpack context ile tüm JSON dosyalarını yükle
      const context = require.context('../data/items', false, /\.json$/);
      
      // Dosya adlarına göre sıralama için dosya listesi al
      const fileKeys = context.keys().sort();
      
      let autoId = 1; // otomatik id sayaç

      fileKeys.forEach(key => {
        try {
          const item = context(key);
          const category = item.category;
          
          if (category && menuData[category]) {
            // Her item'e otomatik id ata (dosya sırasına göre)
            item.id = autoId++;
            menuData[category].push(item);
          }
        } catch (error) {
          console.warn(`Item yüklenemedi: ${key}`, error);
        }
      });

      // Kategorilerdeki öğeleri id'ye göre sırala
      Object.keys(menuData).forEach(cat => {
        menuData[cat].sort((a, b) => (a.id || 9999) - (b.id || 9999));
      });

    } catch (error) {
      console.warn('Items klasörü bulunamadı veya boş:', error);
    }

    return menuData;
  } catch (error) {
    console.error('Menu data yüklenemedi:', error);
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