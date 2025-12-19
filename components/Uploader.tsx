
import React, { useState, useRef } from 'react';
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

    if (!isVideo && !isAudio) return;
    if (file.size > 50 * 1024 * 1024) return;

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
        relative overflow-hidden rounded-[1.8rem] p-20 transition-all duration-700 flex flex-col items-center justify-center text-center group
        ${isDragging ? 'scale-[0.98] bg-[#0D474F08] border-2 border-[#ED9A64]' : 'bg-transparent border-2 border-dashed border-[#557E8322] hover:border-[#ED9A6444]'}
        ${(disabled || isReading) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <input ref={fileInputRef} type="file" accept="video/*,audio/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if(f) processFile(f); e.target.value = ''; }} disabled={disabled || isReading} />
      
      <div className="mb-10 w-28 h-28 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500 relative">
        {isReading ? (
          <svg className="animate-spin h-10 w-10 text-[#ED9A64]" viewBox="0 0 24 24">
            <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <div className="bg-gradient-to-br from-[#0D474F] to-[#ED9A64] p-4 rounded-2xl">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
             </svg>
          </div>
        )}
      </div>
      
      <h3 className="text-3xl font-black mb-4 text-[#0D474F] tracking-tighter">
        {isReading ? 'Preparando...' : 'Arraste para Iniciar'}
      </h3>
      <p className="text-[#557E83] max-w-sm mx-auto mb-10 font-bold text-xs uppercase tracking-[0.15em]">
        Reuniões • Podcasts • Vídeos • Palestras
      </p>
      
      {!isReading && (
        <div className="btn-shine px-12 py-4 bg-[#0D474F] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#1a5f68] transition-all shadow-[0_15px_30px_-10px_rgba(13,71,79,0.3)] hover:translate-y-[-2px]">
          Explorar Arquivos
        </div>
      )}
    </div>
  );
};
