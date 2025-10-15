
import React, { useState, useRef } from 'react';
import { editImageWithGemini } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import ImageViewer from './components/ImageViewer';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOriginalImageFile(file);
      setEditedImage(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!originalImageFile || !prompt.trim()) {
      setError('Please upload an image and provide an editing prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const { base64, mimeType } = await fileToBase64(originalImageFile);
      const resultDataUri = await editImageWithGemini(base64, mimeType, prompt);
      setEditedImage(resultDataUri);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            AI Image Editor
          </h1>
          <p className="mt-2 text-lg text-gray-400">Powered by Gemini (Nano Banana)</p>
        </header>

        <main className="flex flex-col items-center gap-8">
          <ImageViewer 
            originalImage={originalImagePreview} 
            editedImage={editedImage}
            isLoading={isLoading}
          />
          
          <div className="w-full bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-grow w-full">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                  Editing Prompt
                </label>
                <textarea
                  id="prompt"
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-500"
                  placeholder="e.g., 'Make the sky look like a vibrant sunset' or 'Add a cute cat wearing a hat'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto self-start md:self-end mt-4 md:mt-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                <button
                  onClick={triggerFileSelect}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {originalImageFile ? 'Change Image' : 'Upload Image'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !originalImageFile || !prompt.trim()}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md hover:from-blue-600 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? 'Editing...' : 'Edit Image'}
                </button>
              </div>
            </div>
            {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
          </div>

          {editedImage && !isLoading && (
            <div className="text-center mt-4">
              <a
                href={editedImage}
                download={`edited-${originalImageFile?.name || 'image.png'}`}
                className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200"
              >
                Download Edited Image
              </a>
            </div>
          )}
        </main>

        <footer className="text-center mt-12 py-4 border-t border-gray-800">
          <p className="text-gray-500">Built with React, Tailwind CSS, and the Google Gemini API.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
