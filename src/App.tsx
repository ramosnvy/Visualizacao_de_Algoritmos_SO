import React from 'react';
import { PageReplacement } from './components/PageReplacement';
import { DiskScheduling } from './components/DiskScheduling';
import { BookOpen, HardDrive, Info, Github } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 mb-12 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Visualização de Algoritmos de Sistemas Operacionais
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Demonstrações interativas dos algoritmos de Substituição de Páginas
            e Escalonamento de Disco. Explore como esses algoritmos funcionam e
            impactam o desempenho do sistema.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4">
        {/* Page Replacement Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <BookOpen size={40} className="text-indigo-600" />
            <h2 className="text-4xl font-bold text-indigo-900">
              Algoritmos de Substituição de Páginas
            </h2>
          </div>
          <div className="prose max-w-none mb-8">
            <p className="text-indigo-700 text-lg">
              Os algoritmos de substituição de páginas são fundamentais para o
              gerenciamento de memória virtual em sistemas operacionais. Quando
              ocorre um <strong>page fault</strong> e não há frames livres na
              memória, o sistema operacional precisa escolher qual página será
              removida para dar lugar à nova página requisitada.
            </p>
            <p className="text-indigo-700 text-lg">
              Nesta simulação, você pode explorar dois algoritmos populares:
            </p>
            <ul className="text-indigo-700 text-lg list-disc pl-6">
              <li>
                <strong>FIFO (First In, First Out)</strong>: Substitui a página
                mais antiga na memória.
              </li>
              <li>
                <strong>LRU (Least Recently Used)</strong>: Substitui a página
                que não foi utilizada há mais tempo.
              </li>
            </ul>
          </div>
          <PageReplacement />
        </section>

        {/* Disk Scheduling Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <HardDrive size={40} className="text-purple-600" />
            <h2 className="text-4xl font-bold text-purple-900">
              Algoritmos de Escalonamento de Disco
            </h2>
          </div>
          <div className="prose max-w-none mb-8">
            <p className="text-purple-700 text-lg">
              Os algoritmos de escalonamento de disco são responsáveis por
              determinar a ordem em que as requisições de I/O são atendidas. O
              objetivo é minimizar o tempo de busca (<strong>seek time</strong>)
              e maximizar a eficiência do disco.
            </p>
            <p className="text-purple-700 text-lg">
              Nesta simulação, você pode explorar três algoritmos populares:
            </p>
            <ul className="text-purple-700 text-lg list-disc pl-6">
              <li>
                <strong>FCFS (First Come, First Served)</strong>: Atende as
                requisições na ordem de chegada.
              </li>
              <li>
                <strong>SSTF (Shortest Seek Time First)</strong>: Atende a
                requisição mais próxima da posição atual do cabeçote.
              </li>
              <li>
                <strong>SCAN (Elevator Algorithm)</strong>: Move o cabeçote em
                uma direção, atendendo requisições no caminho.
              </li>
            </ul>
          </div>
          <DiskScheduling />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 mt-16 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="https://github.com/ramosnvy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-indigo-300 transition-colors"
            >
              <Github size={24} />
              <span>Ver no GitHub</span>
            </a>
            <a
              href="https://github.com/ramosnvy"
              className="flex items-center gap-2 text-white hover:text-indigo-300 transition-colors"
            >
              <Info size={24} />
              <span>Saiba Mais</span>
            </a>
          </div>
          <p className="text-lg">
            Ferramenta Educacional Interativa para Conceitos de Sistemas
            Operacionais
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Desenvolvido com ❤️ por Pedro Ramos
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
