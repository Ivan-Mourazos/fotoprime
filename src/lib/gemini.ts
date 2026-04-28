import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export const initGenAI = (apiKey: string) => {
  aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
};

export const getGenAIClient = () => {
  if (!aiClient) throw new Error('GenAI Client no inicializado. Se requiere API Key.');
  return aiClient;
};

// Utils for file conversion
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Extract the actual base64 part, removing the "data:image/jpeg;base64," prefix
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
