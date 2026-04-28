# FotoPrime 🍌

FotoPrime es un editor de imágenes multimodal moderno y premium diseñado para aprovechar la potencia de los modelos **Gemini 3** de Google. Permite generar y editar imágenes de forma fluida mediante instrucciones de texto y referencias visuales, ofreciendo resoluciones de hasta **4K** nativo.

## ✨ Características

- **Edición Multimodal**: Combina imágenes y texto para realizar cambios precisos en tus fotos.
- **Generación en 4K**: Soporte nativo para resoluciones 1K, 2K y 4K (usando Gemini 3.1 Flash Image).
- **Estética Premium**: Interfaz oscura con efectos de cristal (glassmorphism) y animaciones fluidas con Framer Motion.
- **Modo Continuo**: Bucle de generación infinita para iterar rápidamente sobre una idea.
- **Historial de Sesión**: Acceso rápido a todas tus generaciones recientes.
- **Privacidad**: Tu API Key se guarda localmente en el navegador y nunca se comparte.

## 🚀 Tecnologías

- **Frontend**: React 19 + TypeScript.
- **Estilos**: Tailwind CSS v4.
- **Animaciones**: Framer Motion.
- **Iconos**: Lucide React.
- **IA**: SDK oficial de `@google/genai` (Google Gemini API).

## 🛠️ Instalación

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   pnpm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   pnpm dev
   ```
4. Introduce tu **Google Gemini API Key** en la pantalla de inicio.

## 📖 Uso de la API

Este proyecto utiliza los modelos de vista previa de Gemini 3:
- `gemini-3.1-flash-image-preview` (Soporta 4K)
- `gemini-3-pro-image-preview` (Soporta hasta 2K)
- `imagen-3.0-generate-002`

---

Desarrollado con ❤️ por Iván Mourazos & Antigravity AI.
