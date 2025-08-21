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
      
      // Tüm dosyaları yükle ve bilgileri topla
      const allItems = [];
      
      context.keys().forEach(key => {
        try {
          const item = context(key);
          const category = item.category;
          
          if (category && menuData[category]) {
            // Dosya adından tarih çıkar (Netlify CMS dosya adı formatı)
            // Format: category-slug-timestamp veya category-slug
            const fileName = key.replace('./', '').replace('.json', '');
            
            // Eğer item'de zaten id varsa onu kullan, yoksa dosya adından çıkar
            let itemId = item.id;
            if (!itemId) {
              // Dosya adından timestamp'i bul veya dosya adı sırasına göre ID ver
              const parts = fileName.split('-');
              const lastPart = parts[parts.length - 1];
              
              // Eğer son kısım sayıysa (timestamp benzeri) onu kullan
              if (/^\d+$/.test(lastPart)) {
                itemId = parseInt(lastPart);
              } else {
                // Yoksa dosya adına göre hash oluştur (tutarlı sıralama için)
                itemId = fileName.split('').reduce((hash, char) => {
                  return char.charCodeAt(0) + ((hash << 5) - hash);
                }, 0);
              }
            }
            
            allItems.push({
              ...item,
              _fileName: fileName,
              _fileId: itemId
            });
          }
        } catch (error) {
          console.warn(`Item yüklenemedi: ${key}`, error);
        }
      });
      
      // Tüm items'ları file ID'ye göre sırala (küçükten büyüğe = eski -> yeni)
      allItems.sort((a, b) => a._fileId - b._fileId);
      
      // Sıralı ID'ler ata (1, 2, 3...)
      allItems.forEach((item, index) => {
        item.id = index + 1;
        
        // Kategoriye ekle
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