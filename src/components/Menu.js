  //src/components/Menu.js

import React, { useState, useRef } from 'react';
import { Coffee, Thermometer, Snowflake, Martini, Wine, Cookie, Droplets, ChevronDown } from 'lucide-react';
import menuData from '../data/menuData';
import './Menu.css';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('sicakIcecekler');
  const [showWelcome, setShowWelcome] = useState(true);
  const menuRef = useRef(null);

  const categories = [
    { id: 'sicakIcecekler', name: 'Sıcak İçecekler', icon: Thermometer },
    { id: 'turkKahvesi', name: 'Türk Kahvesi', icon: Coffee },
    { id: 'sicakKahveler', name: 'Sıcak Kahveler', icon: Coffee },
    { id: 'sogukKahveler', name: 'Soğuk Kahveler', icon: Snowflake },
    { id: 'frozenMilkshake', name: 'Frozen & Milkshake', icon: Droplets },
    { id: 'spesiyel', name: 'SPESİYEL', icon: Martini },
    { id: 'mesrubatlar', name: 'Meşrubatlar', icon: Wine },
    { id: 'tatlilar', name: 'Tatlılar', icon: Cookie }
  ];

  const scrollToMenu = () => {
    setShowWelcome(false);
    setTimeout(() => {
      menuRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    // Kategori değişince menünün başına scroll et
    setTimeout(() => {
      menuRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (showWelcome) {
    return (
      <div className="welcome-screen">
        <div className="welcome-content">
         <div className="logo-container">
  <div className="logo-icon">
  <img src="/images/kahve-icon.png" alt="Kahve Logo" className="logo-png" />
  </div>
  <p className="main-slogan">Bohem dokunuş, eşsiz lezzet</p>
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
          <h1 className="logo">LOESS</h1>
          <p className="slogan">Bohem atmosferde lezzet yolculuğu</p>
          <div className="divider"></div>
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation">
        <div className="nav-container">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`nav-button ${selectedCategory === category.id ? 'active' : ''}`}
              >
                <IconComponent size={18} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-content">
        <div className="menu-grid">
          {menuData[selectedCategory]?.map((item) => (
            <div key={item.id} className="menu-item">
              <div className="item-content">
                <div className="item-info">
                  <div className="item-header">
                    <h3 className="item-name">{item.name}</h3>
                    <span className="item-price">{item.price}</span>
                  </div>
                  <p className="item-description">{item.description}</p>
                </div>
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-title">LOESS</h3>
          </div>
          
          <div className="footer-contact">
            <div className="contact-item">
              <span className="contact-emoji">📞</span>
              <span>0XXX XXX XX XX</span>
            </div>
            <div className="contact-item">
              <span className="contact-emoji">🕐</span>
              <span>14:00 - 02:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;