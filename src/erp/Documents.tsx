import React from 'react';
import { ShieldCheck, FileText, Receipt, Scale, Clock, CheckCircle } from 'lucide-react';

const docs = [
  { id: 'DOC-001', name: 'Contrato de Prestação de Serviços - João Silva', type: 'Contrato', date: '2026-03-01', status: 'Assinado' },
  { id: 'NF-552', name: 'Nota Fiscal Eletrônica - Venda 552', type: 'NF-e', date: '2026-03-07', status: 'Emitida' },
  { id: 'GAR-102', name: 'Termo de Garantia - Cozinha Moderna', type: 'Garantia', date: '2026-03-05', status: 'Ativo' },
];

export const Documents: React.FC = () => {
  return (
    <div className="p-8 space-y-6 bg-neutral-900 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Documentos e Garantias</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm hover:bg-neutral-700">Novo Documento</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Contratos Ativos', value: '24', icon: Scale, color: 'text-blue-500' },
          { label: 'Garantias Vigentes', value: '112', icon: ShieldCheck, color: 'text-emerald-500' },
          { label: 'NFs Emitidas (Mês)', value: '15', icon: Receipt, color: 'text-amber-500' },
        ].map((s, i) => (
          <div key={i} className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{s.label}</p>
                <h3 className="text-2xl font-bold mt-1">{s.value}</h3>
              </div>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-700 bg-neutral-900/30">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Arquivo Digital</h3>
        </div>
        <div className="divide-y divide-neutral-700">
          {docs.map((doc) => (
            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-neutral-700/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-neutral-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">{doc.type}</span>
                    <span className="text-[10px] text-neutral-600">•</span>
                    <span className="text-[10px] text-neutral-500">{new Date(doc.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                  <CheckCircle className="w-3 h-3" />
                  {doc.status}
                </span>
                <button className="px-3 py-1 bg-neutral-700 rounded text-xs hover:bg-neutral-600">Visualizar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
