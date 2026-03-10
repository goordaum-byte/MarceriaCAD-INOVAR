import React from 'react';
import { ShoppingCart, Package, ArrowDownRight, ArrowUpRight, History } from 'lucide-react';

const inventory = [
  { id: 'MDF-001', name: 'MDF Branco Diamante 18mm', stock: 45, unit: 'Chapas', min: 10, price: 'R$ 280,00' },
  { id: 'MDF-002', name: 'MDF Louro Freijó 15mm', stock: 12, unit: 'Chapas', min: 15, price: 'R$ 350,00' },
  { id: 'FER-050', name: 'Dobradiça Amortecedor 35mm', stock: 240, unit: 'Unid', min: 100, price: 'R$ 12,50' },
  { id: 'FER-088', name: 'Corrediça Telescópica 450mm', stock: 8, unit: 'Pares', min: 20, price: 'R$ 45,00' },
];

export const Purchases: React.FC = () => {
  return (
    <div className="p-8 space-y-6 bg-neutral-900 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Compras e Estoque</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm hover:bg-neutral-700">Solicitar Compra</button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Entrada de NF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase">Itens Críticos</p>
            <p className="text-2xl font-bold">4 itens</p>
          </div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase">Valor em Estoque</p>
            <p className="text-2xl font-bold">R$ 24.500</p>
          </div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase">Pedidos em Trânsito</p>
            <p className="text-2xl font-bold">2 pedidos</p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Estoque de Materiais</h3>
          <div className="relative">
             <input type="text" placeholder="Buscar material..." className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-emerald-500" />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-900/50 text-neutral-500 uppercase text-[10px] font-bold">
            <tr>
              <th className="px-6 py-3">Material</th>
              <th className="px-6 py-3">Estoque Atual</th>
              <th className="px-6 py-3">Mínimo</th>
              <th className="px-6 py-3">Preço Médio</th>
              <th className="px-6 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-700/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-white">{item.name}</p>
                  <p className="text-[10px] text-neutral-500 font-mono">{item.id}</p>
                </td>
                <td className="px-6 py-4 font-mono text-neutral-300">{item.stock} {item.unit}</td>
                <td className="px-6 py-4 text-neutral-500">{item.min} {item.unit}</td>
                <td className="px-6 py-4 text-neutral-400 font-mono">{item.price}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.stock <= item.min ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {item.stock <= item.min ? 'Reposição Necessária' : 'OK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
