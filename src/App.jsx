import React from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import RoomVisualization from './components/RoomVisualization';

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <ControlPanel />
        <RoomVisualization />
      </div>
    </div>
  );
}

export default App;
