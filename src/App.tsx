import React, { useState } from 'react';
import { IntroScreen } from './components/layout/IntroScreen';
import { MainExperience } from './components/layout/MainExperience';
import { AudioEngine } from './audio/AudioEngine';

export const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState<boolean>(false);

  const handleEnter = async () => {
    // Unlock browser audio context on user gesture
    const engine = AudioEngine.getInstance();
    await engine.initContext();
    setHasEntered(true);
  };

  return (
    <div className="w-full h-full">
      {!hasEntered ? (
        <IntroScreen onEnter={handleEnter} />
      ) : (
        <MainExperience />
      )}
    </div>
  );
};

export default App;
