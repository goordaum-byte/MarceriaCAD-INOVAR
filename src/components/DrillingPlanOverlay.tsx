import React from 'react';
import { X, Drill, Download, Printer } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';

interface DrillingPlanOverlayProps {
  onClose: () => void;
}

export const DrillingPlanOverlay: React.FC<DrillingPlanOverlayProps> = ({ onClose }) => {
  const modules = useEditorStore((state) => state.modules);

  const generateDrillingData = () => {
    const drillings: any[] = [];
    modules.forEach(module => {
      if (module.type === 'cabinet' || module.type === 'drawer') {
        const { width, height, depth, thickness } = module.dimensions;
        
        // Hinges for doors
        if (module.config?.doors) {
          const doorCount = module.config.doors;
          for (let i = 0; i < doorCount; i++) {
            drillings.push({
              module: module.id,
              part: `Porta ${i + 1}`,
              type: 'Dobradiça Caneco 35mm',
              pos: [100, 37, 12],
              diameter: 35,
              depth: 11.5
            });
            drillings.push({
              module: module.id,
              part: `Porta ${i + 1}`,
              type: 'Dobradiça Caneco 35mm',
              pos: [height - 100, 37, 12],
              diameter: 35,
              depth: 11.5
            });
          }
        }

        // Slides for drawers
        if (module.config?.drawers) {
          const drawerCount = module.config.drawers;
          const drawerHeight = (height - 2 * thickness) / drawerCount;
          for (let i = 0; i < drawerCount; i++) {
            drillings.push({
              module: module.id,
              part: `Lateral Direita`,
              type: 'Corrediça Telescópica',
              pos: [thickness + i * drawerHeight + 37, 37, 0],
              diameter: 5,
              depth: 10
            });
          }
        }

        // Handles
        if (module.config?.hasHardware) {
          drillings.push({
            module: module.id,
            part: 'Frente',
            type: 'Puxador (Furo)',
            pos: [height / 2, width / 2 - 64, 0],
            diameter: 5,
            depth: 18
          });
          drillings.push({
            module: module.id,
            part: 'Frente',
            type: 'Puxador (Furo)',
            pos: [height / 2, width / 2 + 64, 0],
            diameter: 5,
            depth: 18
          });
        }
      }
    });
    return drillings;
  };

  const drillings = generateDrillingData();

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-neutral-900 w-full max-w-5xl h-full rounded-2xl border border-neutral-800 flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <Drill className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Plano de Furação Automático</h2>
              <p className="text-sm text-neutral-400">Coordenadas de furação para CNC e montagem manual</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm">
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
              <Download className="w-4 h-4" />
              Exportar DXF/XML
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-800 text-neutral-400 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Peça / Componente</th>
                    <th className="px-4 py-3 font-medium">Tipo de Furo</th>
                    <th className="px-4 py-3 font-medium text-center">X (mm)</th>
                    <th className="px-4 py-3 font-medium text-center">Y (mm)</th>
                    <th className="px-4 py-3 font-medium text-center">Ø (mm)</th>
                    <th className="px-4 py-3 font-medium text-center">Prof. (mm)</th>
                    <th className="px-4 py-3 font-medium">Referência</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-neutral-300 divide-y divide-neutral-700/50">
                  {drillings.map((drill, idx) => (
                    <tr key={idx} className="hover:bg-neutral-700/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{drill.part}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold uppercase">
                          {drill.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono">{drill.pos[0]}</td>
                      <td className="px-4 py-3 text-center font-mono">{drill.pos[1]}</td>
                      <td className="px-4 py-3 text-center font-mono">{drill.diameter}</td>
                      <td className="px-4 py-3 text-center font-mono">{drill.depth}</td>
                      <td className="px-4 py-3 text-xs text-neutral-500">Módulo: {drill.module.slice(0, 8)}</td>
                    </tr>
                  ))}
                  {drillings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-neutral-500 italic">
                        Nenhum dado de furação disponível para os módulos atuais.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-neutral-800/30 p-4 rounded-xl border border-neutral-700/50">
                <h3 className="text-xs font-bold text-neutral-500 uppercase mb-2">Total de Furos</h3>
                <p className="text-2xl font-bold text-white">{drillings.length}</p>
              </div>
              <div className="bg-neutral-800/30 p-4 rounded-xl border border-neutral-700/50">
                <h3 className="text-xs font-bold text-neutral-500 uppercase mb-2">Dobradiças (Caneco)</h3>
                <p className="text-2xl font-bold text-white">
                  {drillings.filter(d => d.type.includes('Dobradiça')).length}
                </p>
              </div>
              <div className="bg-neutral-800/30 p-4 rounded-xl border border-neutral-700/50">
                <h3 className="text-xs font-bold text-neutral-500 uppercase mb-2">Tempo Est. CNC</h3>
                <p className="text-2xl font-bold text-white">~{Math.ceil(drillings.length * 0.5)} min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
