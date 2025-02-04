import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

/**
 * Interface que representa uma requisição de disco.
 * - `position`: A posição no disco onde a requisição está localizada.
 * - `isServed`: Indica se a requisição já foi atendida.
 */
interface Request {
  position: number;
  isServed: boolean;
}

/**
 * Componente de Escalonamento de Disco
 *
 * Este componente implementa uma visualização interativa dos algoritmos de escalonamento de disco:
 * - FCFS (First Come, First Served)
 * - SSTF (Shortest Seek Time First)
 * - SCAN (Elevator Algorithm)
 *
 * Cada algoritmo tem sua própria estratégia para minimizar o tempo de busca total.
 */
export function DiskScheduling() {
  // Estados do componente
  const [requests, setRequests] = useState<Request[]>([
    { position: 98, isServed: false },
    { position: 183, isServed: false },
    { position: 37, isServed: false },
    { position: 122, isServed: false },
    { position: 14, isServed: false },
    { position: 124, isServed: false },
    { position: 65, isServed: false },
    { position: 67, isServed: false },
  ]);
  const [headPosition, setHeadPosition] = useState(50); // Posição inicial do cabeçote
  const [algorithm, setAlgorithm] = useState<'FCFS' | 'SSTF' | 'SCAN'>('FCFS'); // Algoritmo selecionado
  const [isPlaying, setIsPlaying] = useState(false); // Estado de reprodução (play/pause)
  const [direction, setDirection] = useState<'up' | 'down'>('up'); // Direção do cabeçote (SCAN)
  const [totalSeekTime, setTotalSeekTime] = useState(0); // Tempo total de busca

  const diskSize = 200; // Tamanho total do disco

  /**
   * Função para reiniciar a simulação.
   * - Reseta as requisições para o estado inicial.
   * - Volta o cabeçote para a posição inicial.
   * - Zera o tempo total de busca.
   * - Pausa a simulação.
   */
  const reset = () => {
    setRequests(requests.map((r) => ({ ...r, isServed: false })));
    setHeadPosition(50);
    setTotalSeekTime(0);
    setIsPlaying(false);
    setDirection('up');
  };

  /**
   * Função para obter a próxima requisição com base no algoritmo selecionado.
   * - FCFS: Atende as requisições na ordem de chegada.
   * - SSTF: Atende a requisição mais próxima da posição atual do cabeçote.
   * - SCAN: Move o cabeçote em uma direção, atendendo requisições no caminho.
   */
  const getNextRequest = () => {
    switch (algorithm) {
      case 'FCFS': // Atende as requisições na ordem de chegada
        return requests.find((r) => !r.isServed);
      case 'SSTF': // Atende a requisição mais próxima da posição atual
        return requests
          .filter((r) => !r.isServed)
          .reduce((closest, current) => {
            if (!closest) return current;
            return Math.abs(current.position - headPosition) <
              Math.abs(closest.position - headPosition)
              ? current
              : closest;
          }, null as Request | null);
      case 'SCAN': // Move o cabeçote em uma direção, atendendo requisições no caminho
        const unservedRequests = requests.filter((r) => !r.isServed);
        if (direction === 'up') {
          const nextUp = unservedRequests
            .filter((r) => r.position >= headPosition)
            .sort((a, b) => a.position - b.position)[0];
          if (nextUp) return nextUp;
          setDirection('down');
          return unservedRequests
            .filter((r) => r.position < headPosition)
            .sort((a, b) => b.position - a.position)[0];
        } else {
          const nextDown = unservedRequests
            .filter((r) => r.position <= headPosition)
            .sort((a, b) => b.position - a.position)[0];
          if (nextDown) return nextDown;
          setDirection('up');
          return unservedRequests
            .filter((r) => r.position > headPosition)
            .sort((a, b) => a.position - b.position)[0];
        }
    }
  };

  /**
   * Função para mover o cabeçote para a próxima requisição.
   * - Calcula o tempo de busca (seek time) até a próxima requisição.
   * - Atualiza a posição do cabeçote e marca a requisição como atendida.
   * - Se não houver mais requisições, pausa a simulação.
   */
  const moveHead = () => {
    const nextRequest = getNextRequest();
    if (nextRequest) {
      const seekTime = Math.abs(nextRequest.position - headPosition);
      setTotalSeekTime((prev) => prev + seekTime);
      setHeadPosition(nextRequest.position);
      setRequests(
        requests.map((r) => (r === nextRequest ? { ...r, isServed: true } : r))
      );
    } else {
      setIsPlaying(false);
    }
  };

  // Efeito para controlar a reprodução automática da simulação
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(moveHead, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, headPosition, requests, algorithm, direction]);

  return (
    <div className="bg-gradient-to-br from-purple-500 to-blue-600 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-purple-900">
            Algoritmo de Escalonamento de Disco: {algorithm}
          </h2>
          <InfoTooltip
            title="O que é Seek Time?"
            content="Seek Time é o tempo necessário para mover o cabeçote do disco de uma posição para outra. Quanto menor o seek time total, mais eficiente é o algoritmo."
          />
        </div>

        {/* Seleção de Algoritmo */}
        <div className="flex gap-4 mb-8">
          {(['FCFS', 'SSTF', 'SCAN'] as const).map((alg) => (
            <button
              key={alg}
              onClick={() => {
                setAlgorithm(alg);
                reset();
              }}
              className={`px-6 py-3 rounded-xl transition-all transform hover:scale-105 ${
                algorithm === alg
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-purple-700 hover:bg-purple-50 shadow-md'
              }`}
            >
              <span className="font-semibold">{alg}</span>
              <div className="text-xs mt-1 font-normal">
                {alg === 'FCFS'
                  ? 'First Come, First Served'
                  : alg === 'SSTF'
                  ? 'Shortest Seek Time First'
                  : 'Elevator Algorithm'}
              </div>
            </button>
          ))}
        </div>

        {/* Visualização do Disco */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="relative h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg mb-4">
            {/* Cabeçote */}
            <div
              className="absolute w-6 h-12 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500 rounded-lg shadow-lg"
              style={{ left: `${(headPosition / diskSize) * 100}%` }}
            />
            {/* Requisições */}
            {requests.map((request, index) => (
              <div
                key={index}
                className={`absolute w-4 h-8 transition-all duration-500 rounded-lg ${
                  request.isServed
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : 'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{
                  left: `${(request.position / diskSize) * 100}%`,
                  top: '12px',
                  marginLeft: '4px',
                  marginRight: '4px',
                }}
              />
            ))}
          </div>
          <div className="text-center text-sm text-purple-700">
            Visualização do Disco (Posição do Cabeçote e Requisições)
          </div>
        </div>

        {/* Controles de Simulação */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-110 shadow-lg"
            title={isPlaying ? 'Pausar' : 'Iniciar'}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button
            onClick={moveHead}
            disabled={!requests.some((r) => !r.isServed)}
            className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Próximo passo"
          >
            <Play size={28} />
          </button>
          <button
            onClick={reset}
            className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-110 shadow-lg"
            title="Reiniciar"
          >
            <RefreshCw size={28} />
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md">
            <p className="text-lg font-semibold text-purple-900 mb-2">
              Posição do Cabeçote
            </p>
            <p className="text-3xl font-bold text-purple-700">{headPosition}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md">
            <p className="text-lg font-semibold text-purple-900 mb-2">
              Tempo Total de Busca
            </p>
            <p className="text-3xl font-bold text-purple-700">
              {totalSeekTime}
            </p>
          </div>
        </div>

        {/* Descrição do Algoritmo */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-purple-900 mb-4">
            Sobre o Algoritmo
          </h3>
          <p className="text-purple-700">
            {algorithm === 'FCFS'
              ? 'FCFS atende as requisições na ordem exata em que chegaram. É simples mas pode resultar em movimentos ineficientes do cabeçote.'
              : algorithm === 'SSTF'
              ? 'SSTF sempre escolhe a requisição mais próxima da posição atual do cabeçote. É mais eficiente que FCFS mas pode causar starvation.'
              : 'SCAN (Algoritmo do Elevador) move o cabeçote em uma direção até o fim do disco, atendendo requisições no caminho, então inverte a direção.'}
          </p>
        </div>
      </div>
    </div>
  );
}
