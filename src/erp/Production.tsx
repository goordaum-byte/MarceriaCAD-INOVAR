import React from 'react';
import { Clock, CheckCircle2, AlertCircle, PlayCircle } from 'lucide-react';

const productionOrders = [
  { id: 'OP-001', project: 'Cozinha Planejada - João', status: 'Em Produção', progress: 65, deadline: '2026-03-15' },
  { id: 'OP-002', project: 'Dormitório Casal - Maria', status: 'Aguardando MDF', progress: 10, deadline: '2026-03-20' },
  { id: 'OP-003', project: 'Painel TV - Pedro', status: 'Montagem', progress: 90, deadline: '2026-03-12' },
  { id: 'OP-004', project: 'Escritório Home Office', status: 'Concluído', progress: 100, deadline: '2026-03-08' },
];

export const Production: React.FC = () => {
  return (
    <div className="p-8 space-y-6 bg-neutral-900 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Controle de Produção</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm hover:bg-neutral-700">Imprimir Etiquetas</button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Nova Ordem de Produção</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Em Espera', count: 5, icon: Clock, color: 'text-amber-500' },
          { label: 'Em Corte', count: 3, icon: PlayCircle, color: 'text-blue-500' },
          { label: 'Em Montagem', count: 2, icon: PlayCircle, color: 'text-emerald-500' },
          { label: 'Atrasados', count: 1, icon: AlertCircle, color: 'text-red-500' },
        ].map((s, i) => (
          <div key={i} className="bg-neutral-800 border border-neutral-700 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-neutral-500 uppercase">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold mt-1">{s.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-900/50 text-neutral-500 uppercase text-[10px] font-bold">
            <tr>
              <th className="px-6 py-3">ID / Projeto</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Progresso</th>
              <th className="px-6 py-3">Prazo Final</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {productionOrders.map((op) => (
              <tr key={op.id} className="hover:bg-neutral-700/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-white">{op.id}</p>
                  <p className="text-xs text-neutral-500">{op.project}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    op.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-500' :
                    op.status === 'Em Produção' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {op.status}
                  </span>
                </td>
                <td className="px-6 py-4 w-48">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${op.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono">{op.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-400">
                  {new Date(op.deadline).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-emerald-500 hover:underline font-bold text-xs">Detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
