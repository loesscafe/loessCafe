// src/utils/menuLoader.js

export const loadMenuData = async () => {
  try {
    // Menü verilerini public/data/items/menu.json'dan çek
    const res = await fetch('/data/items/menu.json');
    if (!res.ok) throw new Error('Menü verisi bulunamadı');
    const data = await res.json();

    // Kategorileri kontrol et, eksikse boş array ata
    const categories = [
      'sicakIcecekler', 'turkKahvesi', 'sicakKahveler',
      'sogukKahveler', 'frozenMilkshake', 'spesiyel',
      'mesrubatlar', 'tatlilar'
    ];

    categories.forEach(cat => {
      if (!data[cat]) data[cat] = [];
    });

    return data;
  } catch (err) {
    console.error('Menü verisi yüklenirken hata:', err);

    // Fallback: boş menü
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
    const res = await fetch('/data/cafeInfo.json');
    if (!res.ok) throw new Error('Kafe bilgisi bulunamadı');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Kafe bilgileri yüklenemedi, varsayılan değerler kullanılıyor:', err);
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
