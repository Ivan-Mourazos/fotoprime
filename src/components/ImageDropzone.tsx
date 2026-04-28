import { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { fileToBase64 } from '../lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageDropzoneProps {
  imagePreview: string | null;
  onImageSelect: (base64: string, mimeType: string) => void;
  onClear: () => void;
}

export const ImageDropzone = ({ imagePreview, onImageSelect, onClear }: ImageDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const base64 = await fileToBase64(file);
      onImageSelect(base64, file.type);
    } catch (err) {
      console.error("Error reading file", err);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6 relative">
      <AnimatePresence mode="wait">
        {imagePreview ? (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl max-h-[80vh] flex items-center justify-center group"
          >
            <img 
              src={`data:image/jpeg;base64,${imagePreview}`} 
              alt="Preview" 
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            
            {/* Overlay controls on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center backdrop-blur-sm">
              <button 
                onClick={onClear}
                className="bg-red-500/80 hover:bg-red-500 text-white p-4 rounded-full flex items-center gap-2 transition-transform hover:scale-105"
              >
                <X className="w-6 h-6" />
                <span className="font-medium">Eliminar Origen</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`w-full max-w-2xl h-96 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer
              ${isDragging ? 'border-primary-500 bg-primary-500/5' : 'border-white/10 hover:border-white/20 bg-black/20 hover:bg-black/30'}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <div className={`p-6 rounded-full transition-colors ${isDragging ? 'bg-primary-500/20 text-primary-500' : 'bg-white/5 text-gray-400'}`}>
              <UploadCloud className="w-10 h-10" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-white mb-1">Arrastra una imagen o haz clic</p>
              <p className="text-gray-500 text-sm">PNG, JPG o WebP hasta 10MB</p>
            </div>
            
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={onFileInput}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
