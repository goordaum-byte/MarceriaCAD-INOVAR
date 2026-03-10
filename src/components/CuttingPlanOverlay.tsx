import React from 'react';
import { useEditorStore } from '../store/useEditorStore';

export const CuttingPlanOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { modules } = useEditorStore();

  const calculateParts = () => {
    const allParts: any[] = [];
    modules.filter(m => m.type !== 'wall').forEach(m => {
      const { width, height, depth, thickness } = m.dimensions;
      // Laterais
      allParts.push({ name: `Lateral ${m.type}`, dim: `${height} x ${depth}`, qty: 2, mat: m.material });
      // Base/Teto
      allParts.push({ name: `Base/Teto ${m.type}`, dim: `${width - 2 * thickness} x ${depth}`, qty: 2, mat: m.material });
      // Fundo
      allParts.push({ name: `Fundo ${m.type}`, dim: `${width - 2 * thickness} x ${height - 2 * thickness}`, qty: 1, mat: 'MDF 6mm Branco' });
      
      if (m.config?.shelves) {
        allParts.push({ name: `Prateleira ${m.type}`, dim: `${width - 2 * thickness} x ${depth - 10}`, qty: m.config.shelves, mat: m.material });
      }
      if (m.config?.drawers) {
        allParts.push({ name: `Frente Gaveta ${m.type}`, dim: `${(height - 2 * thickness) / m.config.drawers - 4} x ${width - 4}`, qty: m.config.drawers, mat: m.material });
      }
      if (m.config?.doors) {
        allParts.push({ name: `Porta ${m.type}`, dim: `${height - 4} x ${(width - 4) / m.config.doors - 2}`, qty: m.config.doors, mat: m.material });
      }
    });
    return allParts;
  };

  const parts = calculateParts();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-8">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Plano de Corte Otimizado</h2>
            <p className="text-sm text-neutral-500">Lista de peças para fabricação (Leo Madeiras)</p>
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors">
            Fechar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase text-neutral-500 border-b border-neutral-800">
                <th className="pb-3 font-bold">Peça</th>
                <th className="pb-3 font-bold">Dimensões (mm)</th>
                <th className="pb-3 font-bold">Qtd</th>
                <th className="pb-3 font-bold">Material</th>
                <th className="pb-3 font-bold">Bordas</th>
              </tr>
            </thead>
            <tbody className="text-sm text-neutral-300">
              {parts.map((p, i) => (
                <tr key={i} className="border-b border-neutral-800/50 hover:bg-white/5 transition-colors">
                  <td className="py-3">{p.name}</td>
                  <td className="py-3 font-mono text-emerald-500">{p.dim}</td>
                  <td className="py-3">{p.qty}</td>
                  <td className="py-3 text-xs">{p.mat}</td>
                  <td className="py-3 text-[10px] text-neutral-500">4 lados</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-neutral-700 bg-neutral-800/50 flex justify-between items-center">
          <div className="text-xs text-neutral-500">
            Total de peças: <span className="text-white font-bold">{parts.reduce((acc, p) => acc + p.qty, 0)}</span>
          </div>
          <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20">
            Enviar para Leo Madeiras (Corte Cloud)
          </button>
        </div>
      </div>
    </div>
  );
};
