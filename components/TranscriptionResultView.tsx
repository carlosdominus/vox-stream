
import React, { useState } from 'react';
import { TranscriptionResult } from '../types';

interface TranscriptionResultViewProps {
  result: TranscriptionResult;
  onReset: () => void;
}

const CopyButton: React.FC<{ text: string; primary?: boolean }> = ({ text, primary }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`btn-shine flex items-center space-x-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        copied 
          ? 'bg-[#ED9A64] text-white shadow-[0_10px_20px_rgba(237,154,100,0.3)]' 
          : primary 
            ? 'bg-[#0D474F] text-white shadow-[0_10px_20px_rgba(13,71,79,0.2)]'
            : 'bg-white/80 text-[#0D474F] border border-[#557E8322] hover:bg-white shadow-sm'
      }`}
    >
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
};

export const TranscriptionResultView: React.FC<TranscriptionResultViewProps> = ({ result, onReset }) => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-3 mb-4">
             <span className="bg-[#ED9A64] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {result.language}
             </span>
             <span className="text-[#557E83] text-[9px] font-black uppercase tracking-widest opacity-60">
                Processamento Concluído
             </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-[#0D474F] tracking-tight leading-none italic">
             {result.title}
          </h2>
        </div>
        <button 
          onClick={onReset}
          className="btn-shine px-10 py-5 bg-[#0D474F] text-white rounded-[1.5rem] hover:bg-[#1a5f68] transition-all font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(13,71,79,0.35)]"
        >
          Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          <section className="premium-card p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ED9A6408] rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-[#0D474F] tracking-tight italic">
                Resumo <span className="text-[#ED9A64]">Executivo</span>
              </h3>
              <CopyButton text={result.summary} primary />
            </div>
            <p className="text-[#313131] leading-relaxed text-xl font-medium tracking-tight">
              {result.summary}
            </p>
          </section>

          <section className="premium-card p-12">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-[#0D474F] tracking-tight italic">
                Transcrição <span className="opacity-30">Íntegra</span>
              </h3>
              <CopyButton text={result.fullTranscription} />
            </div>
            <div className="bg-[#FFEFE444] p-10 rounded-3xl border border-white/50 max-h-[700px] overflow-y-auto custom-scrollbar">
              <p className="text-[#313131] whitespace-pre-wrap leading-loose text-lg font-medium tracking-tight opacity-90">
                {result.fullTranscription}
              </p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <section className="premium-card p-10 border-t-4 border-[#ED9A64]">
            <h3 className="text-xl font-black mb-8 text-[#0D474F] flex items-center italic">
              Key Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.keyTopics.map((topic, idx) => (
                <span key={idx} className="px-4 py-2 bg-white text-[#0D474F] text-[10px] font-black rounded-xl border border-[#557E8311] shadow-sm uppercase tracking-wider">
                  {topic}
                </span>
              ))}
            </div>
          </section>

          <section className="premium-card p-10 bg-[#0D474F] text-white border-none shadow-[0_30px_60px_-15px_rgba(13,71,79,0.4)]">
            <h3 className="text-xl font-black mb-8 italic flex items-center">
              Action Items
            </h3>
            <ul className="space-y-6">
              {result.actionItems.map((item, idx) => (
                <li key={idx} className="flex items-start text-sm font-medium leading-relaxed group">
                  <span className="mr-4 w-6 h-6 flex items-center justify-center bg-[#ED9A64] text-white rounded-lg shrink-0 text-[10px] font-black">
                    {idx + 1}
                  </span>
                  <span className="opacity-90 group-hover:opacity-100 transition-opacity">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
