import React, { createContext, useState, useContext, useEffect } from 'react';

const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [lightsOn, setLightsOn] = useState(false);
  const [acTemp, setAcTemp] = useState(24);
  const [acOn, setAcOn] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(0); // 0-4
  const [curtainPos, setCurtainPos] = useState(100); // 100 = open, 0 = closed
  const [relaxMode, setRelaxMode] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  
  const [bodyColor, setBodyColor] = useState('black');
  const [buttonColor, setButtonColor] = useState('gold');

  const [focusState, setFocusState] = useState(null); // 'ac', 'fan', 'curtain', 'lights', null

  const toggleRelaxMode = () => {
    const newRelax = !relaxMode;
    setRelaxMode(newRelax);
    if (newRelax) {
      setLightsOn(true);
      setFanSpeed(2);
      setAcTemp(22);
      setAcOn(true);
      setCurtainPos(20);
    } else {
      setLightsOn(false);
      setFanSpeed(0);
      setAcOn(false);
      setCurtainPos(100);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme-body', bodyColor);
    document.documentElement.setAttribute('data-theme-accent', buttonColor);
  }, [bodyColor, buttonColor]);

  return (
    <HomeContext.Provider value={{
      lightsOn, setLightsOn,
      acTemp, setAcTemp,
      acOn, setAcOn,
      fanSpeed, setFanSpeed,
      curtainPos, setCurtainPos,
      relaxMode, toggleRelaxMode,
      bodyColor, setBodyColor,
      buttonColor, setButtonColor,
      focusState, setFocusState,
      switchOn, setSwitchOn
    }}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => useContext(HomeContext);
