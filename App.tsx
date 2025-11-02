
import React, { useState } from 'react';
import Calculator from './components/Calculator';
import { PhoneIcon, SettingsIcon } from './components/icons';

const App: React.FC = () => {
  const [showEditorSettings, setShowEditorSettings] = useState<boolean>(false);

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4">
      <header className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center text-center gap-8 mb-8 relative">
        {/* Title & Contact */}
        <div className="text-center">
            <h1 className="font-anton text-6xl md:text-7xl tracking-wider">
              <span className="text-orange-500">Neovid</span><span className="text-slate-100">Inspect</span>
            </h1>
            <p className="text-slate-300 text-lg mt-1">Calculator servicii canalizare - Curatare si inspectie video</p>

            {/* --- CONTACT INFO --- */}
            <div className="mt-6 flex items-center justify-center gap-6">
              <a href="tel:+40733519148" className="flex items-center gap-2 text-slate-200 hover:text-orange-400 transition-colors duration-300 bg-slate-800/50 px-4 py-2 rounded-lg">
                <PhoneIcon className="w-5 h-5" />
                <span className="font-semibold text-lg">0733 519 148</span>
              </a>
            </div>
        </div>

        {/* Editor Mode Toggle Button */}
        <button
          onClick={() => setShowEditorSettings(!showEditorSettings)}
          className="absolute top-0 right-0 p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/70 transition-colors duration-300 z-10"
          aria-label="Toggle editor mode"
        >
          <SettingsIcon className={`w-6 h-6 ${showEditorSettings ? 'text-orange-400' : 'text-slate-400'}`} />
        </button>
      </header>

      <main className="w-full max-w-4xl">
        <Calculator isEditorMode={showEditorSettings} />
      </main>

      <footer className="text-center mt-12 text-slate-400">
        <p>&copy; {new Date().getFullYear()} NEOVID. Toate drepturile rezervate.</p>
        <p className="text-sm mt-1">Pentru o ofertă exactă, vă rugăm să ne contactați!</p>
      </footer>
    </div>
  );
};

export default App;
