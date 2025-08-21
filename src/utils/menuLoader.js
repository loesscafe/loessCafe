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
      const allItems = [];

      context.keys().forEach(key => {
        try {
          const item = context(key);
          const category = item.category;

          if (category && menuData[category]) {
            allItems.push(item);
          }
        } catch (error) {
          console.warn(`Item yüklenemedi: ${key}`, error);
        }
      });

      // Kategorilere göre maxId tut
      const categoryMaxIds = {};

      allItems.forEach(item => {
        const category = item.category;
        if (!category) return;

        // Kategori için max id başlat
        if (!categoryMaxIds[category]) {
          categoryMaxIds[category] = 0;
        }

        // Kullanıcı CMS’te ne yazarsa yazsın → otomatik ID ata
        categoryMaxIds[category]++;
        item.id = categoryMaxIds[category];

        // Kategorisine ekle
        menuData[category].push(item);
      });

      // Her kategoriyi ID’ye göre sırala (küçük ID üstte)
      Object.keys(menuData).forEach(category => {
        menuData[category].sort((a, b) => (a.id || 9999) - (b.id || 9999));
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
