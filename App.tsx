
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Uploader } from './components/Uploader';
import { TranscriptionResultView } from './components/TranscriptionResultView';
import { AppStatus, FileData, TranscriptionResult } from './types';
import { transcribeMedia } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const intervalRef = useRef<number | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    if (status === AppStatus.UPLOADING || status === AppStatus.PROCESSING) {
      if (progress > 95) setProgressLabel("Polindo os últimos detalhes...");
      else if (progress > 75) setProgressLabel("O Gemini está decifrando o contexto...");
      else if (progress > 50) setProgressLabel("Processamento neural em andamento...");
      else if (progress > 25) setProgressLabel("Analisando fluxos de áudio...");
      else setProgressLabel("Iniciando motor de IA...");
    }
  }, [progress, status]);

  const handleFileSelect = async (data: FileData) => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setError(null);
    setFileData(data);
    setStatus(AppStatus.UPLOADING);
    setProgress(5);
    
    const isSmallFile = data.file.size < 5 * 1024 * 1024;
    const stepTime = isSmallFile ? 80 : 400;

    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98;
        const increment = isSmallFile ? (prev > 80 ? 0.5 : 4) : (prev > 80 ? 0.1 : 1.2);
        return prev + increment;
      });
    }, stepTime);

    try {
      const transcription = await transcribeMedia(data.base64, data.file.type);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      setProgress(100);
      setProgressLabel("Transcriçao realizada.");
      
      setTimeout(() => {
        setResult(transcription);
        setStatus(AppStatus.COMPLETED);
      }, 500);
    } catch (err: any) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      console.error("Erro na transcrição:", err);
      setError('A excelência falhou momentaneamente. Tente novamente.');
      setStatus(AppStatus.ERROR);
    }
  };

  const reset = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setStatus(AppStatus.IDLE);
    setFileData(null);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        {status === AppStatus.IDLE && (
          <div className="text-center mb-24 mt-12 animate-in fade-in slide-in-from-top-12 duration-1000">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#ED9A6444] bg-[#ED9A6411] text-[#ED9A64] text-[10px] font-bold uppercase tracking-[0.2em]">
              A Próxima Geração da Transcrição
            </div>
            <h1 className="text-7xl md:text-9xl font-black mb-10 tracking-tight leading-[0.9] text-[#0D474F] italic">
              AI <span className="gradient-heading not-italic">VoxStream</span>
            </h1>
            <p className="text-xl text-[#557E83] max-w-2xl mx-auto leading-relaxed font-medium">
              Experiência de transcrição premium para mentes exigentes. Transforme horas de mídia em inteligência acionável instantaneamente.
            </p>
          </div>
        )}

        {(status === AppStatus.IDLE || status === AppStatus.ERROR) && (
          <div className="space-y-16">
            <div className="premium-card p-4">
               <Uploader onFileSelect={handleFileSelect} disabled={status === AppStatus.UPLOADING || status === AppStatus.PROCESSING} />
            </div>
            
            {status === AppStatus.ERROR && (
              <div className="bg-[#ED9A6411] border border-[#ED9A6444] backdrop-blur-md p-8 rounded-[2rem] flex items-center space-x-6 text-[#0D474F] font-bold animate-in zoom-in duration-300">
                <div className="bg-[#ED9A64] p-3 rounded-2xl shadow-lg shadow-[#ED9A6433]">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 pb-20">
              {[
                { title: 'Velocidade de Elite', desc: 'Processamento adaptativo que entende a escala do seu conteúdo.', icon: '⚡' },
                { title: 'Inteligência Gemini', desc: 'O estado da arte em processamento de linguagem natural.', icon: '✨' },
                { title: 'Design Exclusivo', desc: 'Uma interface pensada para produtividade e deleite visual.', icon: '🥂' }
              ].map((f, i) => (
                <div key={i} className="premium-card p-10 hover:translate-y-[-8px] transition-all duration-500 cursor-default group">
                  <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500 inline-block">{f.icon}</div>
                  <h4 className="font-black text-[#0D474F] text-xl mb-4 tracking-tight">{f.title}</h4>
                  <p className="text-sm text-[#557E83] font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(status === AppStatus.UPLOADING || status === AppStatus.PROCESSING) && (
          <div className="flex flex-col items-center justify-center py-32 space-y-16 animate-in fade-in duration-700">
            <div className="w-full max-w-xl text-center">
              <div className="inline-block animate-pulse mb-8 bg-[#0D474F11] px-4 py-1 rounded-full text-[#0D474F] text-[10px] font-black tracking-widest uppercase">
                {progress < 50 ? 'Extração' : progress < 80 ? 'Análise' : 'Finalização'}
              </div>
              <div className="flex flex-col items-center mb-8">
                <h3 className="text-4xl font-black text-[#0D474F] tracking-tighter mb-2">{progressLabel}</h3>
                <div className="flex items-center space-x-2">
                   <span className="text-[#ED9A64] font-black text-5xl">{Math.floor(progress)}%</span>
                </div>
              </div>
              
              <div className="h-4 w-full bg-white/50 backdrop-blur-sm rounded-full overflow-hidden shadow-inner border border-white p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-[#0D474F] via-[#557E83] to-[#ED9A64] rounded-full transition-all duration-300 ease-out relative shadow-[0_0_20px_rgba(237,154,100,0.3)]"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>

              {fileData && (
                <p className="mt-6 text-[#557E83] font-bold text-xs uppercase tracking-widest opacity-60">
                  Documento: {formatFileSize(fileData.file.size)} • {fileData.file.name.slice(0, 20)}...
                </p>
              )}
            </div>
          </div>
        )}

        {status === AppStatus.COMPLETED && result && (
          <TranscriptionResultView result={result} onReset={reset} />
        )}
      </div>
    </Layout>
  );
};

export default App;
