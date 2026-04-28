import { motion, AnimatePresence } from 'framer-motion';
import { Download, Link, X } from 'lucide-react';

interface ResultModalProps {
  resultImage: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUseAsSource: (base64Data: string) => void;
}

export const ResultModal = ({ resultImage, isOpen, onClose, onUseAsSource }: ResultModalProps) => {
  if (!isOpen || !resultImage) return null;

  const handleDownload = () => {
    const isPng = resultImage.includes('image/png');
    const ext = isPng ? 'png' : 'jpg';
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `fotoprime-generation-${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUseAsSource = () => {
    // Extract base64 from data URL
    const base64Data = resultImage.split(',')[1];
    onUseAsSource(base64Data);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-8"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-full"
        >
          <X className="w-8 h-8" />
        </button>

        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative max-w-6xl w-full h-full max-h-[85vh] flex flex-col items-center justify-center"
        >
          {/* Image Container */}
          <div className="relative w-full h-full flex items-center justify-center flex-1 min-h-0">
            <img 
              src={resultImage} 
              alt="Generated Result" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Action Bar */}
          <div className="mt-8 flex items-center justify-center gap-4 shrink-0">
            <button 
              onClick={handleUseAsSource}
              className="glass-panel px-6 py-4 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors text-white font-medium"
            >
              <Link className="w-5 h-5 text-accent-400" />
              Utilizar como Origen
            </button>
            <button 
              onClick={handleDownload}
              className="bg-primary-600 hover:bg-primary-500 hover:box-glow-primary px-8 py-4 rounded-xl flex items-center gap-3 transition-all text-white font-medium"
            >
              <Download className="w-5 h-5" />
              Descargar Imagen
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
