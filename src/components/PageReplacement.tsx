import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Play,
  Pause,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

// Interface que define a estrutura de uma página na memória
interface Page {
  id: number; // Identificador da página
  timestamp: number; // Timestamp do último acesso (usado no LRU)
  isEntering?: boolean; // Indica se a página está entrando na memória (para animação)
  isLeaving?: boolean; // Indica se a página está saindo da memória (para animação)
  prevValue?: number; // Valor anterior da página (usado para animação de substituição)
}

// Componente principal que simula a substituição de páginas
export function PageReplacement() {
  // Estados do componente
  const [pages, setPages] = useState<Page[]>([]); // Páginas atualmente na memória
  const [sequence, setSequence] = useState<number[]>([1, 3, 0, 3, 5, 6, 3]); // Sequência de referências de páginas
  const [currentStep, setCurrentStep] = useState(0); // Passo atual na sequência
  const [isPlaying, setIsPlaying] = useState(false); // Indica se a simulação está em execução
  const [algorithm, setAlgorithm] = useState<'FIFO' | 'LRU'>('FIFO'); // Algoritmo selecionado (FIFO ou LRU)
  const [pageFaults, setPageFaults] = useState(0); // Contador de page faults
  const [narration, setNarration] = useState(''); // Narração que explica o que está acontecendo
  const [isNarrating, setIsNarrating] = useState(false); // Indica se a narração está ativa
  const frameSize = 3; // Tamanho máximo da memória (número de páginas que cabem na memória)

  // Função que gera a narração com base no passo atual e no estado da simulação
  const getNarration = (
    step: number,
    newPage: number,
    isPageFault: boolean
  ) => {
    if (step === 0) {
      return `Bem-vindo! Vamos começar a simulação do algoritmo ${algorithm}. 
              Primeiro, vamos adicionar a página ${newPage} à memória.`;
    }

    if (isPageFault) {
      if (algorithm === 'FIFO') {
        return `Detectamos um page fault! 
                A página ${newPage} precisa ser carregada, mas a memória está cheia.
                Seguindo o princípio First-In-First-Out, vamos remover a página mais antiga.`;
      } else {
        return `Detectamos um page fault! 
                A página ${newPage} não está na memória.
                Usando LRU, vamos remover a página que não foi acessada há mais tempo.`;
      }
    }

    return algorithm === 'LRU'
      ? `Ótimo! A página ${newPage} já está na memória. 
         Vamos atualizar seu timestamp para registrar este acesso recente.`
      : `A página ${newPage} já está na memória. 
         No FIFO, não precisamos fazer nenhuma atualização adicional.`;
  };

  // Função que avança para o próximo passo na simulação
  const handleNext = () => {
    if (currentStep < sequence.length) {
      const newPage = sequence[currentStep];
      const isPageFault = !pages.some((p) => p.id === newPage); // Verifica se a página não está na memória

      setNarration(getNarration(currentStep, newPage, isPageFault));
      setIsNarrating(true);

      setTimeout(() => setIsNarrating(false), 3000);

      if (isPageFault) {
        setPageFaults((prev) => prev + 1);

        if (pages.length < frameSize) {
          // Se ainda há espaço na memória, adiciona a nova página
          setPages((prev) => [
            ...prev,
            {
              id: newPage,
              timestamp: Date.now(),
              isEntering: true,
            },
          ]);
        } else {
          // Se a memória está cheia, substitui uma página
          if (algorithm === 'FIFO') {
            const oldPage = pages[0];
            // Marca a página antiga para sair
            setPages((prev) =>
              prev.map((p, i) => (i === 0 ? { ...p, isLeaving: true } : p))
            );
            // Aguarda a animação de saída antes de adicionar a nova página
            setTimeout(() => {
              setPages((prev) => [
                ...prev.slice(1).map((p) => ({ ...p, isLeaving: false })),
                {
                  id: newPage,
                  timestamp: Date.now(),
                  isEntering: true,
                  prevValue: oldPage.id,
                },
              ]);
            }, 500); // Ajuste o tempo conforme necessário
          } else if (algorithm === 'LRU') {
            const leastRecentIndex = pages.reduce(
              (min, p, i, arr) => (p.timestamp < arr[min].timestamp ? i : min),
              0
            );
            const oldPage = pages[leastRecentIndex];
            // Marca a página antiga para sair
            setPages((prev) =>
              prev.map((p, i) =>
                i === leastRecentIndex ? { ...p, isLeaving: true } : p
              )
            );
            // Aguarda a animação de saída antes de adicionar a nova página
            setTimeout(() => {
              setPages((prev) => {
                const updatedPages = [...prev];
                updatedPages[leastRecentIndex] = {
                  id: newPage,
                  timestamp: Date.now(),
                  isEntering: true,
                  prevValue: oldPage.id,
                };
                return updatedPages;
              });
            }, 500); // Ajuste o tempo conforme necessário
          }
        }
      } else if (algorithm === 'LRU') {
        // Atualiza o timestamp da página acessada
        setPages((prev) =>
          prev.map((p) =>
            p.id === newPage ? { ...p, timestamp: Date.now() } : p
          )
        );
      }

      setCurrentStep((prev) => prev + 1);
    } else {
      setNarration(
        'Simulação concluída! Você pode reiniciar para ver novamente.'
      );
      setIsNarrating(true);
      setTimeout(() => setIsNarrating(false), 3000);
    }
  };

  // Função que reinicia a simulação
  const reset = () => {
    setPages([]);
    setCurrentStep(0);
    setPageFaults(0);
    setIsPlaying(false);
    setNarration('Selecione um algoritmo e clique em Play para começar.');
    setIsNarrating(true);
    setTimeout(() => setIsNarrating(false), 3000);
  };

  // Efeito que controla a execução automática da simulação
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < sequence.length) {
      interval = setInterval(handleNext, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-900">
            Algoritmo de Substituição de Páginas: {algorithm}
          </h2>
          <InfoTooltip
            title="O que são Page Faults?"
            content="Page Fault ocorre quando uma página requisitada não está presente na memória física (RAM) e precisa ser carregada do disco. Quanto menor o número de page faults, melhor o desempenho do algoritmo."
          />
        </div>

        <div className="flex gap-4 mb-8">
          {(['FIFO', 'LRU'] as const).map((alg) => (
            <button
              key={alg}
              onClick={() => {
                setAlgorithm(alg);
                reset();
              }}
              className={`px-6 py-3 rounded-xl transition-all transform hover:scale-105 ${
                algorithm === alg
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-indigo-700 hover:bg-indigo-50 shadow-md'
              }`}
            >
              <span className="font-semibold">{alg}</span>
              <div className="text-xs mt-1 font-normal">
                {alg === 'FIFO' ? 'First In, First Out' : 'Least Recently Used'}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex justify-center gap-4 mb-4">
            {pages.map((page, index) => (
              <div
                key={index}
                className={`relative w-20 h-20 flex items-center justify-center border-2 border-indigo-500 rounded-lg text-2xl font-bold transition-all duration-500 transform
        ${page.isEntering ? 'scale-110 bg-green-50' : 'bg-indigo-50'}
        ${page.isLeaving ? 'scale-90 opacity-0' : ''}`}
              >
                {page.prevValue && page.isEntering && (
                  <div className="absolute inset-0 flex items-center justify-center animate-fade-out">
                    {page.prevValue}
                  </div>
                )}
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    page.isEntering ? 'animate-fade-in' : ''
                  }`}
                >
                  {page.id}
                </div>
              </div>
            ))}
            {Array(frameSize - pages.length)
              .fill(null)
              .map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-indigo-200 rounded-lg"
                />
              ))}
          </div>
        </div>

        <div
          className={`bg-gradient-to-r from-indigo-100 to-blue-100 p-4 rounded-lg mb-6 transition-all duration-500 transform flex items-start gap-3 ${
            isNarrating ? 'scale-102 shadow-lg' : ''
          }`}
        >
          <MessageCircle
            className={`w-6 h-6 text-indigo-600 mt-1 ${
              isNarrating ? 'animate-bounce' : ''
            }`}
          />
          <p className="text-indigo-700 text-lg flex-1">{narration}</p>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-110 shadow-lg"
            title={isPlaying ? 'Pausar' : 'Iniciar'}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep >= sequence.length}
            className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Próximo passo"
          >
            <ChevronRight size={28} />
          </button>
          <button
            onClick={reset}
            className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-110 shadow-lg"
            title="Reiniciar"
          >
            <RefreshCw size={28} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-6 rounded-xl shadow-md">
            <p className="text-lg font-semibold text-indigo-900 mb-2">
              Sequência de Referências
            </p>
            <p className="text-indigo-700">{sequence.join(', ')}</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-6 rounded-xl shadow-md">
            <p className="text-lg font-semibold text-indigo-900 mb-2">
              Page Faults
            </p>
            <p className="text-3xl font-bold text-indigo-700">{pageFaults}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-indigo-900 mb-4">
            Sobre o Algoritmo
          </h3>
          <p className="text-indigo-700">
            {algorithm === 'FIFO'
              ? 'FIFO (First In, First Out) substitui a página mais antiga na memória, independentemente de sua frequência de uso. É simples de implementar, mas pode não ser o mais eficiente.'
              : 'LRU (Least Recently Used) substitui a página que não foi utilizada há mais tempo. É geralmente mais eficiente que o FIFO, pois considera o histórico de uso das páginas.'}
          </p>
        </div>
      </div>
    </div>
  );
}
