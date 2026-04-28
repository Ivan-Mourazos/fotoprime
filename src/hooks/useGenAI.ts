import { useState, useRef, useCallback } from 'react';
import { getGenAIClient } from '../lib/gemini';

export interface GenAIOptions {
  prompt: string;
  model: string;
  image?: string; // base64 string
  mimeType?: string;
  size?: string;
  aspectRatio?: string;
}

export const useGenAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  
  const stopRequested = useRef(false);

  const stopGeneration = useCallback(() => {
    stopRequested.current = true;
    setIsGenerating(false);
  }, []);

  const generate = useCallback(async (options: GenAIOptions, isContinuous: boolean = false) => {
    setIsGenerating(true);
    setAttempts(0);
    setError(null);
    setResult(null);
    stopRequested.current = false;

    let currentAttempt = 0;

    while (!stopRequested.current) {
      currentAttempt++;
      setAttempts(currentAttempt);

      try {
        const client = getGenAIClient();
        
        // Preparation of parts for the multimodal prompt
        const parts: any[] = [];
        // Enriquecemos el prompt para forzar resolución y formato de alta calidad
        const aspectRatioText = options.aspectRatio ? `, manteniendo estrictamente la proporción ${options.aspectRatio}` : '';
        const enhancedPrompt = options.prompt 
          ? `${options.prompt}\n\n[INSTRUCCIÓN DE SISTEMA: Genera esta imagen con la máxima calidad y nivel de detalle posible. La resolución objetivo debe ser de al menos ${options.size || 1024}px en el lado más largo${aspectRatioText}. Genera y devuelve los datos obligatoriamente en formato image/png sin compresión para evitar artefactos jpg.]`
          : `Genera una imagen con la máxima calidad posible a resolución de al menos ${options.size || 1024}px${aspectRatioText} en formato image/png.`;

        if (options.prompt) {
          parts.push({ text: enhancedPrompt });
        } else {
          parts.push({ text: enhancedPrompt });
        }
        
        if (options.image && options.mimeType) {
          parts.push({
            inlineData: {
              data: options.image,
              mimeType: options.mimeType,
            }
          });
        }

        // Mapeo de resoluciones para la API de Gemini 3
        const getGeminiSize = (size?: string) => {
          if (!size) return '1K';
          if (size === '512' || size === '256') return '512';
          if (size === '1024') return '1K';
          if (size === '2048') return '2K';
          if (size === '4096') return '4K';
          return '1K';
        };

        // Configuración de imagen
        const imageConfig: any = {};
        if (options.aspectRatio) imageConfig.aspectRatio = options.aspectRatio;
        if (options.size && options.model.startsWith('gemini')) {
          imageConfig.imageSize = getGeminiSize(options.size);
        }

        if (options.model.startsWith('imagen')) {
          // Usar el endpoint correcto para modelos de Imagen
          const response = await client.models.generateImages({
            model: options.model,
            prompt: options.prompt || "A photorealistic image",
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: options.aspectRatio || '1:1',
            }
          });
          
          if (stopRequested.current) break;

          const base64 = response.generatedImages?.[0]?.image?.imageBytes;
          if (base64) {
            setResult(`data:image/png;base64,${base64}`);
            setIsGenerating(false);
            return;
          } else {
            throw new Error("No se devolvió ninguna imagen generada.");
          }

        } else {
          // Si el modelo seleccionado es uno de los de Gemini
          const response = await client.models.generateContent({
            model: options.model,
            contents: parts,
            config: {
              responseModalities: ["IMAGE"],
              ...(Object.keys(imageConfig).length > 0 ? { imageConfig } : {})
            }
          });

          if (stopRequested.current) break;

          // Extraer los datos inlineData (base64) del candidato devuelto por Gemini
          const candidates = response.candidates;
          if (candidates && candidates.length > 0) {
            const partsResponse = candidates[0].content?.parts;
            if (partsResponse) {
              const imagePart = partsResponse.find(p => p.inlineData);
              if (imagePart && imagePart.inlineData) {
                // Priorizar el formato original que devolvió la API, si no, asumir PNG porque lo forzamos
                setResult(`data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`);
                setIsGenerating(false);
                return; // Éxito! Salimos del bucle
              } else {
                const textPart = partsResponse.find(p => p.text);
                if (textPart && textPart.text) {
                  throw new Error("La API devolvió texto: " + textPart.text.substring(0, 50) + "...");
                }
              }
            }
          }
          throw new Error("No se encontró imagen en la respuesta del modelo.");
        }
        
      } catch (err: any) {
        console.error("Error en generación:", err);
        
        // Manejo de errores críticos
        const errorMessage = err.message || "Error desconocido";
        if (errorMessage.includes("API key") || errorMessage.includes("security") || errorMessage.includes("SAFETY")) {
          setError(`Error crítico: ${errorMessage}`);
          setIsGenerating(false);
          break; // Detener bucle para errores no recuperables
        }

        if (!isContinuous) {
          setError(errorMessage);
          setIsGenerating(false);
          break;
        }

        // Si es continuo, esperamos 1.5s y volve头os a intentar
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
  }, []);

  return { generate, stopGeneration, isGenerating, attempts, error, result, setResult };
};
