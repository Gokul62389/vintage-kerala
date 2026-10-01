import React, { useEffect } from 'react';
import { MainExperience } from './components/layout/MainExperience';
import { AudioEngine } from './audio/AudioEngine';

export const App: React.FC = () => {
  useEffect(() => {
    // Automatically initialize / resume AudioContext on first user interaction anywhere
    const handleFirstInteraction = () => {
      const engine = AudioEngine.getInstance();
      engine.initContext();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <MainExperience />
    </div>
  );
};

export default App;
