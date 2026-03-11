import { useState } from 'react';
import LiFiCellSimulation from './LiFiCellSimulation';
import LiFiSimulation from './LiFiSimulation';
import PureFlowLanding from './PureFlowLanding';

function App() {
  // We use a string state to route between views: 'landing', 'single', 'multi'
  const [view, setView] = useState('landing');

  return (
    <div className={`w-full bg-[#121212] ${view === 'landing' ? 'min-h-screen overflow-auto' : 'h-screen overflow-hidden'}`}>
      {view === 'landing' ? (
        <PureFlowLanding
          onSingleCell={() => setView('single')}
          onMultiCell={() => setView('multi')}
        />
      ) : view === 'multi' ? (
        <LiFiCellSimulation onBack={() => setView('landing')} />
      ) : (
        <LiFiSimulation onBack={() => setView('landing')} />
      )}
    </div>
  );
}

export default App;
