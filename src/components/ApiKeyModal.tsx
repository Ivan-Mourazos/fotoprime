import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, ArrowRight } from 'lucide-react';
import { initGenAI } from '../lib/gemini';

interface ApiKeyModalProps {
  onKeyValid: () => void;
  isOpen: boolean;
}

export const ApiKeyModal = ({ onKeyValid, isOpen }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('fotoprime_api_key');
    if (savedKey) {
      try {
        initGenAI(savedKey);
        onKeyValid();
      } catch (err) {
        // invalid key formats could throw
      }
    }
  }, [onKeyValid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Por favor, introduce una API Key válida.');
      return;
    }
    
    try {
      initGenAI(apiKey.trim());
      localStorage.setItem('fotoprime_api_key', apiKey.trim());
      onKeyValid();
    } catch (err: any) {
      setError('Error al inicializar cliente. Revisa el formato de la llave.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="glass-panel max-w-md w-full rounded-3xl p-8 relative overflow-hidden"
          >
            {/* Glow effect behind the panel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 box-glow-primary">
                <KeyRound className="w-8 h-8 text-primary-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Acceso a FotoPrime</h2>
              <p className="text-gray-400 mb-8 text-sm">
                Introduce tu llave de la API de Google Gemini para comenzar a generar y editar imágenes con IA multimodal.
              </p>

              <form onSubmit={handleSubmit} className="w-full">
                <div className="relative mb-4">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => { setApiKey(e.target.value); setError(''); }}
                    placeholder="AIzaSy..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-600"
                  />
                </div>
                
                {error && <p className="text-red-400 text-sm mb-4 text-left">{error}</p>}

                <button 
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl px-4 py-4 flex items-center justify-center gap-2 transition-all hover:box-glow-primary group"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
