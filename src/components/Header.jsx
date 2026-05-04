import React from 'react';
import { Smartphone, Sun, ChevronDown, Check } from 'lucide-react';
import { useHome } from '../context/HomeContext';
import rCoreLogo from '../assets/R Core logo.png';

const Header = () => {
  const { lightsOn, setLightsOn, bodyColor, setBodyColor, buttonColor, setButtonColor } = useHome();
  const [showBodyOpts, setShowBodyOpts] = React.useState(false);

  const toggleMobileMode = () => {
    document.body.classList.toggle('mobile-mode');
  };

  const colors = [
    { id: 'wood', color: '#8B5A2B' },
    { id: 'black', color: '#2a2a2a' },
    { id: 'gold', color: '#d19e59' },
    { id: 'blue', color: '#3f6ca8' },
    { id: 'white', color: '#ffffff' },
    { id: 'green', color: '#8fa88f' }
  ];

  return (
    <header className="header">
      <div className="brand">
        <img src={rCoreLogo} alt="R Core" style={{ height: '80%', objectFit: 'contain', marginLeft: '-10px', transform: 'scale(2.2)', transformOrigin: 'left center' }} />
      </div>
      
      <div className="header-controls">
        <button className="pill-btn" onClick={toggleMobileMode}>
          <Smartphone size={16} /> APP
        </button>
        
        <button 
          className={`pill-btn ${lightsOn ? 'active' : ''}`}
          onClick={() => setLightsOn(!lightsOn)}
        >
          <Sun size={16} /> LIGHT
        </button>

        <div style={{position: 'relative'}}>
          <button className="pill-btn" onClick={() => setShowBodyOpts(!showBodyOpts)}>
            <span className="color-dot" style={{backgroundColor: bodyColor === 'black' ? '#222' : '#fff'}}></span>
            BODY <ChevronDown size={14} />
          </button>
          
          {showBodyOpts && (
            <div style={{position: 'absolute', top: '100%', left: 0, marginTop: 10, background: 'var(--bg-panel)', padding: 15, borderRadius: 12, border: '1px solid var(--border-color)', display: 'flex', gap: 10}}>
              <div 
                style={{width: 30, height: 30, borderRadius: 6, background: '#fff', cursor: 'pointer', border: bodyColor==='white'?'2px solid var(--accent-color)':'1px solid #333'}}
                onClick={() => { setBodyColor('white'); setShowBodyOpts(false); }}
              />
              <div 
                style={{width: 30, height: 30, borderRadius: 6, background: '#222', cursor: 'pointer', border: bodyColor==='black'?'2px solid var(--accent-color)':'1px solid #333'}}
                onClick={() => { setBodyColor('black'); setShowBodyOpts(false); }}
              />
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
