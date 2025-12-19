
import React, { useState } from 'react';
import { TranscriptionResult } from '../types';

interface TranscriptionResultViewProps {
  result: TranscriptionResult;
  onReset: () => void;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
        copied ? 'bg-[#ED9A64] text-white border-[#ED9A64]' : 'bg-white text-[#0D474F] border-[#557E8344] hover:bg-[#FFEFE4]'
      }`}
    >
      {copied ? (
        <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span>Copiado!</span></>
      ) : (
        <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg><span>Copiar</span></>
      )}
    </button>
  );
};

export const TranscriptionResultView: React.FC<TranscriptionResultViewProps> = ({ result, onReset }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#ED9A64] mb-2 block">Processamento concluído</span>
          <h2 className="text-4xl font-black text-[#0D474F]">{result.title}</h2>
          <p className="text-[#557E83] mt-2 font-medium">Detectamos: <span className="bg-[#ED9A64]22 px-2 py-0.5 rounded text-[#0D474F] font-bold">{result.language}</span></p>
        </div>
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-[#0D474F] text-white rounded-2xl hover:bg-[#557E83] transition-all font-bold shadow-lg"
        >
          Nova Transcrição
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="card-panel p-10 custom-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#0D474F] flex items-center">
                <span className="w-2.5 h-8 bg-[#ED9A64] rounded-full mr-4"></span>
                Resumo Executivo
              </h3>
              <CopyButton text={result.summary} />
            </div>
            <p className="text-[#313131] leading-relaxed text-lg font-medium">
              {result.summary}
            </p>
          </section>

          <section className="card-panel p-10 custom-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#0D474F] flex items-center">
                <span className="w-2.5 h-8 bg-[#0D474F] rounded-full mr-4"></span>
                Transcrição Íntegra
              </h3>
              <CopyButton text={result.fullTranscription} />
            </div>
            <div className="bg-[#FFEFE4] p-8 rounded-2xl border border-[#557E8322] max-h-[600px] overflow-y-auto">
              <p className="text-[#313131] whitespace-pre-wrap leading-loose text-base">
                {result.fullTranscription}
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="card-panel p-8 border-l-8 border-l-[#ED9A64] custom-shadow">
            <h3 className="text-lg font-bold mb-6 text-[#0D474F] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[#ED9A64]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
              Tópicos Principais
            </h3>
            <div className="flex flex-wrap gap-3">
              {result.keyTopics.map((topic, idx) => (
                <span key={idx} className="px-4 py-2 bg-[#0D474F] text-white text-xs font-bold rounded-xl shadow-sm">
                  {topic}
                </span>
              ))}
            </div>
          </section>

          <section className="card-panel p-8 border-l-8 border-l-[#0D474F] custom-shadow">
            <h3 className="text-lg font-bold mb-6 text-[#0D474F] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[#0D474F]" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
              Checklist de Ação
            </h3>
            <ul className="space-y-4">
              {result.actionItems.map((item, idx) => (
                <li key={idx} className="flex items-start text-sm text-[#313131] font-medium leading-snug">
                  <span className="mr-3 mt-1 w-5 h-5 flex items-center justify-center bg-[#ED9A64] text-white rounded-full shrink-0 text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
