import React, { useState } from 'react';
import { useHome } from '../context/HomeContext';
import remoteImg from '../assets/remote desktop.png';
import remoteDarkImg from '../assets/remote desktop dark.png';
import mobileImg from '../assets/remote mobile .png';
import mobileDarkImg from '../assets/remote mobile dark.png';

const ControlPanel = () => {
  const { focusState, setFocusState, lightsOn, setLightsOn, relaxMode, toggleRelaxMode, acTemp, setAcTemp, acOn, setAcOn, fanSpeed, setFanSpeed, curtainPos, setCurtainPos, switchOn, setSwitchOn, bodyColor } = useHome();
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const handleClickOutside = (e) => {
      if (e.target.closest('.remote-zone') || e.target.closest('.vertical-popup')) {
        return;
      }
      setFocusState(null);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // For mobile taps
    
    return () => {
      clearInterval(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [setFocusState]);

  const timeString = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const desktopSrc = bodyColor === 'black' ? remoteDarkImg : remoteImg;
  const mobileSrc = bodyColor === 'black' ? mobileDarkImg : mobileImg;

  const buttons = [
    { id: 'lights', className: 'zone-lights', action: () => setLightsOn(!lightsOn) },
    { id: 'fan', className: 'zone-fan', action: () => {
        if (focusState === 'fan') {
          // Closing popup → turn fan off
          setFocusState(null);
          setFanSpeed(0);
        } else {
          // Opening popup → auto-start fan at speed 2 if currently off
          setFocusState('fan');
          if (Number(fanSpeed) === 0) setFanSpeed(2);
        }
      }
    },
    { id: 'curtain', className: 'zone-curtain', action: () => {
        if (focusState === 'curtain') {
          // Closing popup → close curtain fully
          setFocusState(null);
          setCurtainPos(0);
        } else {
          // Opening popup → if curtain is fully closed, open it to 50%
          setFocusState('curtain');
          if (Number(curtainPos) === 0) setCurtainPos(50);
        }
      }
    },
    { id: 'ac', className: 'zone-ac', action: () => {
        if (focusState === 'ac') {
          // Closing popup → turn AC off
          setFocusState(null);
          setAcOn(false);
        } else {
          // Opening popup → turn AC on at default 24°C if off
          setFocusState('ac');
          setAcOn(true);
          if (!acOn) setAcTemp(24);
        }
      }
    },
    { id: 'switch', className: 'zone-switch', action: () => setSwitchOn(!switchOn) },
    { id: 'relax', className: 'zone-relax', action: toggleRelaxMode },
  ];

  return (
    <div className="left-panel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', padding: 0 }}>
      
      <div className="remote-wrapper" style={{ position: 'relative', height: '100%', display: 'flex', justifyContent: 'center' }}>
        
        <img className="remote-img-desktop" src={desktopSrc} alt="Remote Desktop" style={{ height: '100%', objectFit: 'contain' }} />
        <img className="remote-img-mobile" src={mobileSrc} alt="Remote Mobile" style={{ height: '100%', objectFit: 'contain' }} />

        {/* Time overlay at the top circle */}
        <div className="time-overlay" style={{
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          fontWeight: '300',
          letterSpacing: '2px',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          {timeString}
        </div>

        {/* Clickable Zones */}
        {buttons.map(btn => (
          <div
            key={btn.id}
            title={btn.id}
            onClick={btn.action}
            className={`remote-zone ${btn.className} ${focusState === btn.id ? 'active' : ''}`}
            style={{
              position: 'absolute',
              cursor: 'pointer',
              border: focusState === btn.id ? '2px solid var(--accent-color)' : 'none',
              backgroundColor: focusState === btn.id ? 'rgba(255,255,255,0.05)' : 'transparent',
            }}
          />
        ))}

        {/* Vertical Popup Sliders beside the clicked button areas */}
        {focusState === 'ac' && (
          <div className="vertical-popup" style={{ top: '55%', right: '5%' }}>
            <div className="popup-val">{acTemp}°C</div>
            <div className="vertical-slider-wrapper">
              <input type="range" min="16" max="30" value={acTemp} onChange={(e) => setAcTemp(e.target.value)} />
            </div>
          </div>
        )}

        {focusState === 'fan' && (
          <div className="vertical-popup" style={{ top: '31%', right: '5%' }}>
            <div className="popup-val">Lv {fanSpeed}</div>
            <div className="vertical-slider-wrapper">
              <input type="range" min="0" max="4" value={fanSpeed} onChange={(e) => setFanSpeed(e.target.value)} />
            </div>
          </div>
        )}

        {focusState === 'curtain' && (
          <div className="vertical-popup" style={{ top: '55%', left: '5%' }}>
            <div className="popup-val">{curtainPos}%</div>
            <div className="vertical-slider-wrapper">
              <input type="range" min="0" max="100" value={curtainPos} onChange={(e) => setCurtainPos(e.target.value)} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ControlPanel;
