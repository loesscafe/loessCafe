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
      const context = require.context('../data/items', false, /\.json$/);
      
      context.keys().forEach(key => {
        try {
          const item = context(key);
          const category = item.category;

          if (category && menuData[category]) {
            // Eğer JSON dosyasında order yoksa 9999 verelim ki en sona gelsin
            if (!('order' in item)) item.order = 9999;
            menuData[category].push(item);
          }
        } catch (error) {
          console.warn(`Item yüklenemedi: ${key}`, error);
        }
      });

      // Kategorilerdeki öğeleri order alanına göre sırala
      Object.keys(menuData).forEach(cat => {
        menuData[cat].sort((a, b) => (a.order || 9999) - (b.order || 9999));
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
