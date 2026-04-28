import { useState } from 'react';
import { Settings, Sparkles, RefreshCcw, StopCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfigPanelProps {
  onGenerate: (options: any, isContinuous: boolean) => void;
  onStop: () => void;
  isGenerating: boolean;
  attempts: number;
}

const MODELS = [
  { id: 'gemini-3.1-flash-image-preview', label: 'Gemini 3.1 Flash (Rápido)' },
  { id: 'gemini-3-pro-image-preview', label: 'Gemini 3 Pro (Alta Calidad)' },
  { id: 'imagen-3.0-generate-002', label: 'Imagen 3 (Generación)' }
];

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '3:4', '4:3', 'Auto'];
const SIZES = [
  { id: '256', label: '256px' },
  { id: '512', label: '512px' },
  { id: '1024', label: '1K (1024px)' },
  { id: '2048', label: '2K (2048px)' },
  { id: '4096', label: '4K (4096px)' }
];

export const ConfigPanel = ({ onGenerate, onStop, isGenerating, attempts }: ConfigPanelProps) => {
  const [model, setModel] = useState(MODELS[0].id);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [size, setSize] = useState('512');
  const [prompt, setPrompt] = useState('');
  const [isContinuous, setIsContinuous] = useState(false);

  // Ajuste automático de tamaño según modelo
  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    if (newModel.includes('pro') || newModel.includes('imagen')) {
      if (parseInt(size) < 1024) setSize('1024'); // Mínimo 1024 para pro/imagen
    }
  };

  const handleSubmit = () => {
    if (!prompt.trim() && !isGenerating) return;
    
    if (isGenerating) {
      onStop();
    } else {
      onGenerate({
        model,
        prompt,
        aspectRatio: aspectRatio === 'Auto' ? undefined : aspectRatio,
        size: size,
      }, isContinuous);
    }
  };

  return (
    <div className="w-80 glass-panel border-l border-white/5 h-full flex flex-col z-10 shrink-0">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <Settings className="w-5 h-5 text-accent-500" />
        <h3 className="font-medium tracking-tight text-white">Configuración</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
        {/* Model Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Modelo AI</label>
          <div className="flex flex-col gap-2">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => handleModelChange(m.id)}
                className={`text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                  model === m.id 
                  ? 'bg-primary-500/10 border-primary-500/50 text-primary-400 box-glow-primary' 
                  : 'border-white/5 bg-black/20 text-gray-400 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Proporción</label>
          <div className="grid grid-cols-3 gap-2">
            {ASPECT_RATIOS.map((ar) => (
              <button
                key={ar}
                onClick={() => setAspectRatio(ar)}
                className={`py-2 rounded-lg text-xs font-medium transition-all border ${
                  aspectRatio === ar
                  ? 'bg-accent-500/10 border-accent-500/50 text-accent-400 box-glow-primary'
                  : 'border-white/5 bg-black/20 text-gray-400 hover:bg-white/5'
                }`}
              >
                {ar}
              </button>
            ))}
          </div>
        </div>

        {/* Quality / Size Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Calidad (Tamaño)</label>
            <span className="text-xs text-primary-400 font-medium">{size}px</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => {
              const isProOrImagen = model.includes('pro') || model.includes('imagen');
              const isDisabledSmall = isProOrImagen && parseInt(s.id) < 1024;
              const isDisabled4K = isProOrImagen && s.id === '4096';
              const isDisabled = isDisabledSmall || isDisabled4K;
              
              return (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id)}
                  disabled={isDisabled}
                  className={`flex-1 py-2 px-1 rounded-lg text-[11px] font-medium transition-all border whitespace-nowrap ${
                    size === s.id
                    ? 'bg-primary-500/10 border-primary-500/50 text-primary-400 box-glow-primary'
                    : isDisabled 
                      ? 'border-white/5 bg-black/10 text-gray-600 cursor-not-allowed opacity-50'
                      : 'border-white/5 bg-black/20 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prompt de Edición</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe la imagen o los cambios deseados..."
            className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white resize-none outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-600"
          />
        </div>

        {/* Continuous Mode Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
          <div className="flex items-center gap-2">
            <RefreshCcw className={`w-4 h-4 ${isContinuous ? 'text-primary-400' : 'text-gray-500'}`} />
            <span className="text-sm font-medium text-gray-300">Modo Continuo</span>
          </div>
          <button 
            onClick={() => setIsContinuous(!isContinuous)}
            className={`w-10 h-6 rounded-full p-1 transition-colors ${isContinuous ? 'bg-primary-500' : 'bg-gray-700'}`}
          >
            <motion.div 
              className="w-4 h-4 bg-white rounded-full shadow-md"
              animate={{ x: isContinuous ? 16 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* Action Area */}
      <div className="p-6 border-t border-white/5 bg-black/20">
        <button
          onClick={handleSubmit}
          disabled={!prompt.trim() && !isGenerating}
          className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all relative overflow-hidden group
            ${isGenerating 
              ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50' 
              : !prompt.trim()
                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-500 text-white hover:box-glow-primary'
            }`}
        >
          {isGenerating ? (
            <>
              <StopCircle className="w-5 h-5" />
              Parar (Intento #{attempts})
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Generar Imagen
            </>
          )}

          {/* Progress bar effect for continuous generation */}
          {isGenerating && (
            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-red-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
        </button>
      </div>
    </div>
  );
};
