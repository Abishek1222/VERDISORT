import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

interface UploadSectionProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
}

export default function UploadSection({ onImageSelected, isLoading }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) return;
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageSelected(file);
  };

  const clearImage = () => {
    setPreviewUrl(null);
  };

  return (
    <div className="bg-dark-800 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-verde-500/5 blur-[100px] pointer-events-none"></div>
      
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-verde-400" />
        Analyze Waste Material
      </h2>

      {!previewUrl ? (
        <div 
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 ease-in-out
            ${dragActive ? 'border-verde-400 bg-verde-400/5' : 'border-gray-600 hover:border-gray-500 hover:bg-dark-700/50'}
            ${isLoading ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleChange}
            disabled={isLoading}
          />
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center">
              <UploadCloud className={`w-8 h-8 ${dragActive ? 'text-verde-400' : 'text-gray-400'}`} />
            </div>
          </div>
          <h3 className="text-lg font-medium text-white mb-1">Drag & drop an image</h3>
          <p className="text-sm text-gray-400">or click to browse from your computer</p>
          <p className="text-xs text-gray-500 mt-4">Supports JPG, PNG, WEBP (Max 5MB)</p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-dark-900 group aspect-video sm:aspect-[21/9] flex items-center justify-center">
          <img 
            src={previewUrl} 
            alt="Upload preview" 
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-40 blur-sm' : 'opacity-100'}`}
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-dark-700 border-t-verde-500 rounded-full animate-spin mb-4"></div>
              <p className="font-medium text-white animate-pulse">Running AI Classification...</p>
            </div>
          )}

          {!isLoading && (
            <button 
              onClick={clearImage}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/80 backdrop-blur-md rounded-full text-white transition-colors"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {/* Scanning line animation during loading */}
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-verde-500 shadow-[0_0_15px_#22c55e] animate-[scan_2s_ease-in-out_infinite]"></div>
          )}
        </div>
      )}
    </div>
  );
}
