import React from 'react';
import { FileText, CheckCircle, Clock, XCircle, Download, FileSignature } from 'lucide-react';

const salesData = [
  { id: 'ORC-1024', client: 'Ricardo Almeida', value: 'R$ 12.500', status: 'Aprovado', date: '2026-03-05', type: 'Orçamento' },
  { id: 'VEN-552', client: 'Fernanda Souza', value: 'R$ 8.900', status: 'Faturado', date: '2026-03-07', type: 'Venda' },
  { id: 'ORC-1025', client: 'Condomínio Solar', value: 'R$ 45.000', status: 'Pendente', date: '2026-03-09', type: 'Orçamento' },
];

export const Sales: React.FC = () => {
  return (
    <div className="p-8 space-y-6 bg-neutral-900 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Vendas e Orçamentos</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm hover:bg-neutral-700">Novo Orçamento</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl">
          <h3 className="text-xs font-bold text-neutral-500 uppercase mb-4">Conversão de Orçamentos</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">68%</span>
            <span className="text-emerald-500 text-xs font-bold mb-1">+12% este mês</span>
          </div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl">
          <h3 className="text-xs font-bold text-neutral-500 uppercase mb-4">Ticket Médio</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">R$ 14.200</span>
          </div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl">
          <h3 className="text-xs font-bold text-neutral-500 uppercase mb-4">Vendas Totais (Mês)</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">R$ 156.000</span>
          </div>
        </div>
      </div>

      <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-700 bg-neutral-900/30">
          <h3 className="text-sm font-bold text-white">Histórico Recente</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="text-neutral-500 uppercase text-[10px] font-bold border-b border-neutral-700">
            <tr>
              <th className="px-6 py-3">Documento</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Valor</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {salesData.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-700/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neutral-500" />
                    <div>
                      <p className="font-bold text-white">{item.id}</p>
                      <p className="text-[10px] text-neutral-500 uppercase">{item.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-300">{item.client}</td>
                <td className="px-6 py-4 font-mono text-emerald-500">{item.value}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'Aprovado' || item.status === 'Faturado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-500">{new Date(item.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button title="Gerar Contrato" className="p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white">
                    <FileSignature className="w-4 h-4" />
                  </button>
                  <button title="Download PDF" className="p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
