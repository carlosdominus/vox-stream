
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

  // Centralização da lógica de labels (fora de qualquer função aninhada)
  useEffect(() => {
    if (status === AppStatus.UPLOADING || status === AppStatus.PROCESSING) {
      if (progress > 95) setProgressLabel("Finalizando estruturação dos dados...");
      else if (progress > 75) setProgressLabel("O Gemini está analisando trechos complexos...");
      else if (progress > 50) setProgressLabel("Extraindo falas e identificando contexto...");
      else if (progress > 25) setProgressLabel("IA processando os pacotes de mídia...");
      else setProgressLabel("Preparando análise inteligente...");
    }
  }, [progress, status]);

  const handleFileSelect = async (data: FileData) => {
    // Limpeza de estado prévia
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setError(null);
    setFileData(data);
    setStatus(AppStatus.UPLOADING);
    setProgress(5);
    
    const isSmallFile = data.file.size < 5 * 1024 * 1024; // Menos de 5MB
    const stepTime = isSmallFile ? 100 : 500; // Muito mais rápido para arquivos pequenos

    // Início da simulação de progresso
    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98;
        // Incremento dinâmico baseado no tamanho
        const increment = isSmallFile ? (prev > 80 ? 0.4 : 3) : (prev > 80 ? 0.1 : 0.8);
        return prev + increment;
      });
    }, stepTime);

    try {
      // Chamada assíncrona real
      const transcription = await transcribeMedia(data.base64, data.file.type);
      
      // Sucesso: Finaliza barra e exibe resultado
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      setProgress(100);
      setProgressLabel("Transcrição concluída!");
      
      setTimeout(() => {
        setResult(transcription);
        setStatus(AppStatus.COMPLETED);
      }, 400);
    } catch (err: any) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      console.error("Erro na transcrição:", err);
      setError('Ocorreu um erro no processamento. Tente novamente ou use outro arquivo.');
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
      <div className="max-w-5xl mx-auto">
        {status === AppStatus.IDLE && (
          <div className="text-center mb-16 animate-in fade-in zoom-in duration-1000">
            <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter text-[#0D474F]">
              Poder <span className="text-[#ED9A64]">Auditivo</span><br/>com Inteligência.
            </h1>
            <p className="text-xl text-[#557E83] max-w-2xl mx-auto leading-relaxed font-medium">
              A transcrição mais rápida do mercado. Identificamos o tamanho da sua mídia para entregar resultados com agilidade recorde.
            </p>
          </div>
        )}

        {(status === AppStatus.IDLE || status === AppStatus.ERROR) && (
          <div className="space-y-8">
            <Uploader onFileSelect={handleFileSelect} disabled={status === AppStatus.UPLOADING || status === AppStatus.PROCESSING} />
            
            {status === AppStatus.ERROR && (
              <div className="bg-[#ED9A64]11 border-2 border-[#ED9A64] p-6 rounded-3xl flex items-center space-x-4 text-[#0D474F] font-bold animate-in slide-in-from-top-4 duration-300">
                <svg className="h-8 w-8 text-[#ED9A64]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
              {[
                { title: 'Agilidade Inteligente', desc: 'Sua mídia de 3MB ou 30MB processada no tempo certo.', icon: '⚡' },
                { title: 'Motor Gemini 3', desc: 'Aproveite o modelo mais recente e capaz do Google.', icon: '💎' },
                { title: 'Sem Instalação', desc: 'Tudo roda diretamente no seu navegador com total segurança.', icon: '🌐' }
              ].map((f, i) => (
                <div key={i} className="card-panel p-8 hover:scale-105 transition-transform cursor-default custom-shadow">
                  <div className="text-4xl mb-6">{f.icon}</div>
                  <h4 className="font-extrabold text-[#0D474F] text-lg mb-3">{f.title}</h4>
                  <p className="text-sm text-[#557E83] font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(status === AppStatus.UPLOADING || status === AppStatus.PROCESSING) && (
          <div className="flex flex-col items-center justify-center py-24 space-y-12">
            <div className="w-full max-w-md">
              <div className="flex justify-between items-end mb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-2xl font-black text-[#0D474F]">{progressLabel}</h3>
                    {fileData && (
                      <span className="bg-[#557E8322] text-[#557E83] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        {formatFileSize(fileData.file.size)}
                      </span>
                    )}
                  </div>
                  <p className="text-[#557E83] text-sm font-bold">
                    {fileData && fileData.file.size < 5 * 1024 * 1024 
                      ? "Mídia compacta: priorizando velocidade total." 
                      : "Conteúdo denso: realizando análise profunda..."}
                  </p>
                </div>
                <span className="text-[#ED9A64] font-black text-2xl">{Math.floor(progress)}%</span>
              </div>
              <div className="h-6 w-full bg-white rounded-full overflow-hidden shadow-inner border border-[#557E8322] p-1">
                <div 
                  className="h-full bg-gradient-to-r from-[#0D474F] to-[#ED9A64] rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl opacity-75">
               {['Mapeamento', 'Processamento', 'Identificação', 'Estruturação'].map((step, idx) => (
                 <div key={idx} className={`p-4 rounded-2xl border ${progress > (idx * 25) ? 'border-[#0D474F] bg-[#0D474F] text-white shadow-lg' : 'border-[#557E8322] text-[#557E83]'} text-center text-xs font-bold transition-all duration-500`}>
                   {step}
                 </div>
               ))}
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
