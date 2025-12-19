
import React, { useState, useCallback, useRef } from 'react';
import { FileData } from '../types';

interface UploaderProps {
  onFileSelect: (data: FileData) => void;
  disabled?: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');

    if (!isVideo && !isAudio) {
      alert('Selecione um arquivo de áudio ou vídeo válido.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // Aumentado para 50MB para suportar arquivos mais longos
      alert('O arquivo deve ter menos de 50MB.');
      return;
    }

    setIsReading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;
      const base64 = result.split(',')[1];
      onFileSelect({
        file,
        preview: URL.createObjectURL(file),
        base64
      });
      setIsReading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div 
      onClick={() => !disabled && !isReading && fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if(f) processFile(f); }}
      className={`
        relative border-2 border-dashed rounded-3xl p-16 transition-all duration-500 flex flex-col items-center justify-center text-center
        ${isDragging ? 'border-[#ED9A64] bg-[#ED9A64]11 scale-[1.02]' : 'border-[#557E83] hover:border-[#0D474F] bg-white'}
        ${(disabled || isReading) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl shadow-indigo-100'}
      `}
    >
      <input ref={fileInputRef} type="file" accept="video/*,audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if(f) processFile(f); e.target.value = ''; }} disabled={disabled || isReading} />
      
      <div className="mb-8 w-24 h-24 bg-[#FFEFE4] rounded-full flex items-center justify-center mx-auto shadow-inner">
        {isReading ? (
          <svg className="animate-spin h-12 w-12 text-[#0D474F]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#0D474F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </div>
      
      <h3 className="text-2xl font-bold mb-3 text-[#313131]">
        {isReading ? 'Preparando Mídia...' : 'Arraste seu áudio ou vídeo'}
      </h3>
      <p className="text-[#557E83] max-w-sm mx-auto mb-8 font-medium">
        Suporta gravações longas, reuniões e podcasts em MP3, WAV, MP4 e mais.
      </p>
      
      {!isReading && (
        <div className="px-8 py-3 bg-[#0D474F] text-white rounded-2xl font-bold hover:bg-[#557E83] transition-all shadow-lg">
          Selecionar do Computador
        </div>
      )}
    </div>
  );
};
