import { useState, useEffect } from 'react';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ImageDropzone } from './components/ImageDropzone';
import { ConfigPanel } from './components/ConfigPanel';
import { ResultModal } from './components/ResultModal';
import { SessionHistory } from './components/SessionHistory';
import type { HistoryItem } from './components/SessionHistory';
import { useGenAI } from './hooks/useGenAI';
import { Sparkles, Key } from 'lucide-react';

function App() {
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [sourceImage, setSourceImage] = useState<{base64: string, mimeType: string} | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(true);

  const { generate, stopGeneration, isGenerating, attempts, error, result, setResult } = useGenAI();

  // Handle generation success
  useEffect(() => {
    if (result) {
      setShowResult(true);
      // Auto-save to history
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(7),
        image: result,
        prompt: "Generated Image", // Idealmente aquí pasariamos el prompt usado
        timestamp: Date.now()
      };
      setHistory(prev => [newItem, ...prev]);
    }
  }, [result]);

  const handleGenerate = (options: any, isContinuous: boolean) => {
    generate({
      ...options,
      image: sourceImage?.base64,
      mimeType: sourceImage?.mimeType,
    }, isContinuous);
  };

  const handleUseAsSource = (base64: string) => {
    setSourceImage({ base64, mimeType: 'image/jpeg' });
  };

  const handleChangeKey = () => {
    setShowKeyModal(true);
    setIsKeyValid(false);
  };

  return (
    <div className="w-screen h-screen bg-background flex flex-col overflow-hidden font-sans">
      <ApiKeyModal 
        isOpen={!isKeyValid && showKeyModal} 
        onKeyValid={() => {
          setIsKeyValid(true);
          setShowKeyModal(false);
        }} 
      />

      {/* Header */}
      <header className="h-16 shrink-0 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center box-glow-primary">
            <Sparkles className="w-4 h-4 text-primary-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Foto<span className="text-primary-500 text-glow-primary">Prime</span>
          </h1>
        </div>
        
        {isKeyValid && (
          <button 
            onClick={handleChangeKey}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <Key className="w-4 h-4" />
            Cambiar API Key
          </button>
        )}
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col relative">
          
          {/* Error Banner */}
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-3 rounded-full text-sm font-medium shadow-xl backdrop-blur-md flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              {error}
            </div>
          )}

          <div className="flex-1 overflow-auto relative">
            <ImageDropzone 
              imagePreview={sourceImage?.base64 || null}
              onImageSelect={(base64, mimeType) => setSourceImage({ base64, mimeType })}
              onClear={() => setSourceImage(null)}
            />
          </div>

          <SessionHistory 
            history={history}
            onSelect={(img) => {
              setResult(img);
              setShowResult(true);
            }}
            onDelete={(id) => setHistory(prev => prev.filter(h => h.id !== id))}
          />
        </div>

        {/* Configuration Sidebar */}
        <ConfigPanel 
          onGenerate={handleGenerate}
          onStop={stopGeneration}
          isGenerating={isGenerating}
          attempts={attempts}
        />
      </main>

      <ResultModal 
        isOpen={showResult}
        resultImage={result}
        onClose={() => setShowResult(false)}
        onUseAsSource={handleUseAsSource}
      />
    </div>
  );
}

export default App;
