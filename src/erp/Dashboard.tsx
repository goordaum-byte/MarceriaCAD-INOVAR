import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Users, Package, TrendingUp, DollarSign, Clock, FileText } from 'lucide-react';

const data = [
  { name: 'Jan', faturamento: 4000, despesas: 2400 },
  { name: 'Fev', faturamento: 3000, despesas: 1398 },
  { name: 'Mar', faturamento: 2000, despesas: 9800 },
  { name: 'Abr', faturamento: 2780, despesas: 3908 },
  { name: 'Mai', faturamento: 1890, despesas: 4800 },
  { name: 'Jun', faturamento: 2390, despesas: 3800 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Error fetching projects:', err));
  }, []);

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full bg-neutral-900">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-neutral-400">Visão geral da sua marcenaria</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm hover:bg-neutral-700">Exportar PDF</button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Novo Projeto</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Faturamento Mensal', value: 'R$ 45.200', icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Projetos Ativos', value: '12', icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Novos Clientes', value: '5', icon: Users, color: 'text-amber-500' },
          { label: 'Produção em Atraso', value: '2', icon: Clock, color: 'text-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Projects List */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-neutral-700 flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase text-neutral-500">Projetos Recentes</h3>
          <button className="text-xs text-emerald-500 hover:underline font-bold">Ver Todos</button>
        </div>
        <div className="divide-y divide-neutral-700">
          {projects.length > 0 ? projects.map((p: any) => (
            <div key={p.id} className="p-4 flex items-center justify-between hover:bg-neutral-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-neutral-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{p.name}</p>
                  <p className="text-xs text-neutral-500">Atualizado em: {new Date(p.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-neutral-700 rounded text-xs hover:bg-neutral-600">Abrir</button>
            </div>
          )) : (
            <div className="p-8 text-center text-neutral-500 text-sm italic">
              Nenhum projeto encontrado no banco de dados local.
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl h-[400px]">
          <h3 className="text-sm font-bold mb-6 uppercase text-neutral-500">Fluxo de Caixa</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="faturamento" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl h-[400px]">
          <h3 className="text-sm font-bold mb-6 uppercase text-neutral-500">Status de Produção</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Concluído', value: 400 },
                  { name: 'Em Produção', value: 300 },
                  { name: 'Aguardando MDF', value: 300 },
                  { name: 'Montagem', value: 200 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
