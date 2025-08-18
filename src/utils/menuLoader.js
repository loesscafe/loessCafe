// src/utils/menuLoader.js

export const loadMenuData = async () => {
  try {
    // Tüm menü öğesi dosyalarını yükle
    const context = require.context('../data/items', false, /\.json$/);
    const menuItems = {};
    
    // Her kategori için boş array oluştur
    const categories = [
      'sicakIcecekler', 'turkKahvesi', 'sicakKahveler', 
      'sogukKahveler', 'frozenMilkshake', 'spesiyel', 
      'mesrubatlar', 'tatlilar'
    ];
    
    categories.forEach(cat => {
      menuItems[cat] = [];
    });

    // JSON dosyalarını oku ve kategorilere göre grupla
    context.keys().forEach(key => {
      try {
        const item = context(key);
        const category = item.category;
        
        if (menuItems[category]) {
          menuItems[category].push(item);
        }
      } catch (error) {
        console.warn(`Menü öğesi yüklenemedi: ${key}`, error);
      }
    });

    // Her kategorideki öğeleri ID'ye göre sırala
    Object.keys(menuItems).forEach(category => {
      menuItems[category].sort((a, b) => (a.id || 0) - (b.id || 0));
    });

    return menuItems;
  } catch (error) {
    console.error('Menü verileri yüklenirken hata:', error);
    // Fallback olarak mevcut statik veriyi döndür
    return require('../data/menuData').default;
  }
};

export const loadCafeInfo = async () => {
  try {
    const cafeInfo = await import('../data/cafeInfo.json');
    return cafeInfo.default || cafeInfo;
  } catch (error) {
    console.warn('Kafe bilgileri yüklenemedi, varsayılan değerler kullanılıyor:', error);
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