// src/components/Menu.js

import React, { useState, useRef, useEffect } from 'react';
import { Coffee, Wine, Snowflake, Martini, ChevronDown, Flame, IceCream2, Cake, Soup, Droplets } from 'lucide-react';
import { loadMenuData, loadCafeInfo } from '../utils/menuLoader';
import './Menu.css';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('sicakIcecekler');
  const [showWelcome, setShowWelcome] = useState(true);
  const [menuData, setMenuData] = useState({});
  const [cafeInfo, setCafeInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef(null);

  const categories = [
    { id: 'sicakIcecekler', name: 'Sıcak İçecekler', icon: Soup },
    { id: 'turkKahvesi', name: 'Türk Kahvesi', icon: Flame },
    { id: 'sicakKahveler', name: 'Sıcak Kahveler', icon: Coffee },
    { id: 'sogukKahveler', name: 'Soğuk Kahveler', icon: Droplets },
    { id: 'frozenMilkshake', name: 'Frozen & Milkshake', icon: IceCream2 },
    { id: 'spesiyel', name: 'SPESİYEL', icon: Martini },
    { id: 'mesrubatlar', name: 'Meşrubatlar', icon: Wine },
    { id: 'tatlilar', name: 'Tatlılar', icon: Cake }
  ];

  // Veri yükleme
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [loadedMenuData, loadedCafeInfo] = await Promise.all([
          loadMenuData(),
          loadCafeInfo()
        ]);
        
        // Verileri sırala - ilk eklenen en üstte olsun
        const sortedMenuData = {};
        Object.keys(loadedMenuData).forEach(category => {
          sortedMenuData[category] = loadedMenuData[category].sort((a, b) => {
            // Alfabetik sıralama ile ilk eklenen en üstte olacak
            return a.name.localeCompare(b.name);
          });
        });
        
        setMenuData(sortedMenuData);
        setCafeInfo(loadedCafeInfo);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const scrollToMenu = () => {
    setShowWelcome(false);
    setTimeout(() => {
      menuRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setTimeout(() => {
      menuRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // ID oluşturma fonksiyonu - isim ve kategoriden unique ID oluştur
  const generateId = (item, index) => {
    if (item.id) return item.id;
    return `${item.name?.replace(/\s+/g, '-').toLowerCase()}-${index}` || `item-${index}`;
  };

  // Yükleme ekranı
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Menü yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="welcome-screen">
        <div className="welcome-content">
          <div className="logo-container">
            <div className="logo-icon">
              <img 
                src={cafeInfo.logo || "/images/kahve-icon.png"} 
                alt="Kahve Logo" 
                className="logo-png" 
              />
            </div>
            <p className="main-slogan">
              {cafeInfo.mainSlogan || "Bohem dokunuş, eşsiz lezzet"}
            </p>
          </div>

          <button onClick={scrollToMenu} className="menu-button">
            <span>MENÜYE GİT</span>
            <ChevronDown size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-container" ref={menuRef}>
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-logo">
            <img 
              src={cafeInfo.logo || "/images/kahve-icon.png"} 
              alt="Kahve Logo" 
              className="header-logo-png" 
            />
          </div>
          <p className="slogan">
            {cafeInfo.subSlogan || "Bohem atmosferde lezzet yolculuğu"}
          </p>
          <div className="divider"></div>
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation">
        <div className="nav-container">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const itemCount = menuData[category.id]?.length || 0;
            
            // Eğer kategoride hiç öğe yoksa gizle
            if (itemCount === 0) return null;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`nav-button ${selectedCategory === category.id ? 'active' : ''} ${category.id === 'spesiyel' ? 'special-category' : ''}`}
              >
                <IconComponent size={18} />
                <span>{category.name}</span>
                <small className="item-count">({itemCount})</small>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-content">
        <div className="menu-grid">
          {menuData[selectedCategory]?.map((item, index) => (
            <div key={generateId(item, index)} className="menu-item">
              <div className="item-content">
                <div className="item-info">
                  <div className="item-header">
                    <h3 className="item-name">{item.name}</h3>
                    <span className="item-price">{item.price}</span>
                  </div>
                  {/* Açıklama varsa göster */}
                  {item.description && (
                    <p className="item-description">{item.description}</p>
                  )}
                </div>
                {/* Resim varsa göster */}
                {item.image && (
                  <div className="item-image-container">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )) || (
            <div className="empty-category">
              <p>Bu kategoride henüz ürün bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-title">{cafeInfo.name || "LOESS"}</h3>
          </div>
          
          <div className="footer-contact">
            <div className="contact-item">
              <span className="contact-emoji">🕐</span>
              <span>{cafeInfo.openingTime || "14:00"} - {cafeInfo.closingTime || "02:00"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;