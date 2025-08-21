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
      
      // Tüm dosyaları yükle
      const allItems = [];
      
      context.keys().forEach(key => {
        try {
          const item = context(key);
          const category = item.category;
          
          if (category && menuData[category]) {
            // Dosya adından timestamp çıkar veya addedAt kullan
            const fileName = key.replace('./', '').replace('.json', '');
            let sortOrder = 0;
            
            if (item.addedAt) {
              // addedAt varsa onu kullan (yeni sistem)
              sortOrder = new Date(item.addedAt).getTime();
            } else {
              // addedAt yoksa dosya adından timestamp çıkarmaya çalış (eski dosyalar)
              const timestampMatch = fileName.match(/-(\d{10,})$/); // Unix timestamp
              if (timestampMatch) {
                sortOrder = parseInt(timestampMatch[1]);
              } else {
                // Hiçbiri yoksa dosya adından hash (en eski dosyalar için)
                sortOrder = fileName.split('').reduce((hash, char) => {
                  return char.charCodeAt(0) + ((hash << 5) - hash);
                }, 0);
              }
            }
            
            allItems.push({
              ...item,
              _sortOrder: sortOrder
            });
          }
        } catch (error) {
          console.warn(`Item yüklenemedi: ${key}`, error);
        }
      });
      
      // Timestamp'e göre sırala (küçükten büyüğe = eski -> yeni)
      allItems.sort((a, b) => a._sortOrder - b._sortOrder);
      
      // Sıralı ID'ler ata ve kategorilere dağıt
      allItems.forEach((item, index) => {
        item.id = index + 1;
        
        if (menuData[item.category]) {
          menuData[item.category].push(item);
        }
      });

      // Kategorilerdeki öğeleri zaten sıralı, tekrar sıralamaya gerek yok
      // Çünkü allItems zaten sıralı ve kategorilere sırayla eklendi

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