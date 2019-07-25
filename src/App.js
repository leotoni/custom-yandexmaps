import React from 'react';
import { YMaps } from 'react-yandex-maps';
import MainLayout from './modules/container/MainLayout';

function App() {
  return (
    <div className="App">
      <YMaps>
        <MainLayout />
      </YMaps>
    </div>
  );
}

export default App;
