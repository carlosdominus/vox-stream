
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-8 border-b border-[#557E8322] bg-white/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#0D474F] rounded-lg flex items-center justify-center shadow-lg shadow-[#0D474F33]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0D474F]">
              VoxStream <span className="text-[#ED9A64]">AI</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#313131]">
            <a href="#" className="hover:text-[#ED9A64] transition-colors">Início</a>
            <a href="#" className="hover:text-[#ED9A64] transition-colors">Transcrições</a>
            <a href="#" className="hover:text-[#ED9A64] transition-colors">API</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="bg-[#0D474F] hover:bg-[#557E83] text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md">
              Acessar Pro
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        {children}
      </main>

      <footer className="py-8 px-8 border-t border-[#557E8322] text-center text-[#557E83] text-sm">
        <p>&copy; 2024 VoxStream AI. Inteligência Artificial de Ponta.</p>
      </footer>
    </div>
  );
};
