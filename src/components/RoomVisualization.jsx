import React, { useRef, useEffect, useState } from 'react';
import { useHome } from '../context/HomeContext';
import roomVideo from '../assets/room.mp4';

const RoomVisualization = () => {
  const { lightsOn, relaxMode, fanSpeed, curtainPos, acTemp, acOn, switchOn } = useHome();
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const getLightClass = () => {
    if (relaxMode) return 'relax';
    if (lightsOn) return 'on';
    return 'off';
  };

  const speedNum = Number(fanSpeed);
  const fanAnimationSpeed = speedNum === 0 ? '0s' : `${2.5 / speedNum}s`;

  // Robustly fetch duration
  useEffect(() => {
    const checkDuration = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 1) {
        setDuration(videoRef.current.duration);
        videoRef.current.pause();
        clearInterval(checkDuration);
      }
    }, 100);
    return () => clearInterval(checkDuration);
  }, []);

  useEffect(() => {
    if (videoRef.current && duration > 0) {
      // Map 100% to 0.00s and 0% to the end of the video
      const targetTime = (1 - (curtainPos / 100)) * duration;
      // Use requestAnimationFrame to ensure the browser paints the new frame instantly
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = targetTime;
        }
      });
    }
  }, [curtainPos, duration]);

  return (
    <div className="right-panel">
      <div className="room-container">
        {/* Base room video scrubbed by slider */}
        <video 
          ref={videoRef}
          src={roomVideo} 
          className="room-bg" 
          muted 
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Lighting layer overlaying the room */}
        <div className={`lighting-overlay ${getLightClass()}`}></div>

        {/* AC Flow Layer */}
        <div 
          className={`ac-flow-container ${acOn || acTemp < 28 ? 'active' : ''}`} 
          style={{ '--intensity': Math.max(0.1, (30 - acTemp) / 14) }}
        >
          <div className="ac-wind-line" style={{ top: '35%', animationDuration: '2.5s', animationDelay: '0s' }}></div>
          <div className="ac-wind-line" style={{ top: '50%', animationDuration: '3s', animationDelay: '0.7s' }}></div>
          <div className="ac-wind-line" style={{ top: '65%', animationDuration: '2.8s', animationDelay: '1.4s' }}></div>
        </div>

        {/* Fan layer */}
        <div className="fan-container">
          <div className="fan-center"></div>
          <div className="fan-blades-wrapper" style={{ animationDuration: fanAnimationSpeed, animationPlayState: speedNum === 0 ? 'paused' : 'running' }}>
            <div className="fan-blade"></div>
            <div className="fan-blade"></div>
            <div className="fan-blade"></div>
          </div>
        </div>

        {/* Switch Indicator near the bed */}
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: switchOn ? 'var(--accent-color)' : 'rgba(255,255,255,0.4)',
          border: `2px solid ${switchOn ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)'}`,
          padding: '8px 24px',
          borderRadius: '8px',
          fontSize: '1.2rem',
          fontWeight: '600',
          letterSpacing: '3px',
          boxShadow: switchOn ? '0 0 20px var(--accent-glow)' : 'none',
          zIndex: 15,
          transition: 'all 0.3s ease',
          pointerEvents: 'none'
        }}>
          {switchOn ? 'ON' : 'OFF'}
        </div>

      </div>
    </div>
  );
};

export default RoomVisualization;
