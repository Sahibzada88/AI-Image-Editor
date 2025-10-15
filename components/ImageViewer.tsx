
import React from 'react';
import Spinner from './Spinner';

interface ImageViewerProps {
  originalImage: string | null;
  editedImage: string | null;
  isLoading: boolean;
}

interface ImagePanelProps {
  src: string | null;
  title: string;
  children?: React.ReactNode;
}

const ImagePanel: React.FC<ImagePanelProps> = ({ src, title, children }) => (
  <div className="flex flex-col items-center gap-4 w-full lg:w-1/2">
    <h2 className="text-xl font-semibold text-gray-300">{title}</h2>
    <div className="relative w-full aspect-square bg-gray-800 rounded-lg shadow-lg overflow-hidden flex items-center justify-center border-2 border-gray-700">
      {src ? (
        <img src={src} alt={title} className="object-contain w-full h-full" />
      ) : (
        <div className="text-gray-500 text-center p-4">
          {title === 'Original' ? 'Upload an image to get started' : 'Your edited image will appear here'}
        </div>
      )}
      {children}
    </div>
  </div>
);

const ImageViewer: React.FC<ImageViewerProps> = ({ originalImage, editedImage, isLoading }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <ImagePanel src={originalImage} title="Original" />
      <ImagePanel src={editedImage} title="Edited">
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center gap-4">
            <Spinner />
            <p className="text-white">Editing your image...</p>
          </div>
        )}
      </ImagePanel>
    </div>
  );
};

export default ImageViewer;
