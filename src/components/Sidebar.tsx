import React, { useState } from 'react';
import { useEditorStore, ModuleType } from '../store/useEditorStore';
import { syncLeoMadeiras } from '../services/leoService';
import { 
  Plus, Trash2, Settings, Layers, Box, Layout, Package, Users, 
  BarChart3, Hammer, ShoppingBag, FileCheck, ClipboardList, Home,
  Palette, Ruler, ChevronRight, Sparkles, Loader2
} from 'lucide-react';

interface SidebarProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

const LEO_MADEIRAS_PATTERNS = [
  { name: 'Branco Diamante', hex: '#ffffff' },
  { name: 'Louro Freijó', hex: '#a67c52' },
  { name: 'Carvalho Hanover', hex: '#d2b48c' },
  { name: 'Nogueira Caiena', hex: '#5d4037' },
  { name: 'Grafite', hex: '#424242' },
  { name: 'Preto Silk', hex: '#1a1a1a' },
];

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentSection }) => {
  const { addModule, room, setRoom } = useEditorStore();
  const [showCustom, setShowCustom] = useState(false);
  const [customDim, setCustomDim] = useState({ w: 600, h: 720, d: 580 });
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncLeo = async () => {
    setIsSyncing(true);
    try {
      await syncLeoMadeiras();
      alert('Biblioteca Leo Madeiras sincronizada com sucesso!');
    } catch (error) {
      alert('Erro ao sincronizar biblioteca.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleImport3D = () => {
    alert('Selecione um arquivo GLB/OBJ para importar.');
    // Mock implementation
    addModule({
      id: Math.random().toString(36).substr(2, 9),
      type: 'cabinet',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      dimensions: { width: 400, height: 400, depth: 400, thickness: 18 },
      material: 'Importado',
      metadata: { isImported: true }
    });
  };

  const handleAddModule = (type: ModuleType, config?: any) => {
    onNavigate('editor');
    addModule({
      id: Math.random().toString(36).substr(2, 9),
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      dimensions: {
        width: config?.w || 600,
        height: config?.h || 720,
        depth: config?.d || 580,
        thickness: 18,
      },
      material: 'MDF Leo Madeiras',
      config: config?.config || { hasHardware: true, hardwareType: 'premium' }
    });
  };

  const roomTypes = [
    { id: 'kitchen', label: 'Cozinha' },
    { id: 'bedroom', label: 'Quarto' },
    { id: 'bathroom', label: 'Banheiro' },
    { id: 'office', label: 'Escritório' },
    { id: 'living', label: 'Sala' },
    { id: 'closet', label: 'Closet' },
  ];

  return (
    <div className="w-64 bg-neutral-800 border-r border-neutral-700 flex flex-col h-full text-neutral-300">
      <div className="p-4 border-b border-neutral-700 font-bold text-white flex items-center gap-2">
        <Box className="w-5 h-5 text-emerald-500" />
        Marcenaria AI
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Ambiente</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {roomTypes.map(t => (
              <button 
                key={t.id}
                onClick={() => setRoom({ ...room!, type: t.id as any, name: `Nova ${t.label}` })}
                className={`px-2 py-1 border rounded text-[10px] transition-all ${
                  room?.type === t.id 
                    ? 'bg-emerald-600 border-emerald-500 text-white' 
                    : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-emerald-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-[10px] text-neutral-500">
              <span>Dimensões (mm)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="number" placeholder="Largura" 
                value={room?.dimensions.width} 
                onChange={e => setRoom({ ...room!, dimensions: { ...room!.dimensions, width: Number(e.target.value) } })}
                className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-[10px]"
              />
              <input 
                type="number" placeholder="Profundidade" 
                value={room?.dimensions.depth} 
                onChange={e => setRoom({ ...room!, dimensions: { ...room!.dimensions, depth: Number(e.target.value) } })}
                className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-[10px]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <button 
              onClick={() => handleAddModule('wall', { w: 3000, h: 2600, d: 150 })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
            >
              <Layout className="w-4 h-4" />
              Parede
            </button>
            <button 
              onClick={() => handleAddModule('door', { w: 800, h: 2100, d: 40 })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Porta
            </button>
            <button 
              onClick={() => handleAddModule('window', { w: 1200, h: 1000, d: 40 })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Janela
            </button>
            <button 
              onClick={() => handleAddModule('pillar', { w: 400, h: 2600, d: 400 })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
            >
              <Box className="w-4 h-4" />
              Pilar
            </button>
            <button 
              onClick={() => handleAddModule('viga', { w: 3000, h: 400, d: 400 })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
            >
              <Box className="w-4 h-4" />
              Viga
            </button>
            <button 
              onClick={() => handleAddModule('niche', { w: 600, h: 600, d: 300 })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
            >
              <Layout className="w-4 h-4" />
              Nicho
            </button>
            <button 
              onClick={() => handleAddModule('panel', { w: 1200, h: 2700, d: 18 })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
            >
              <Layers className="w-4 h-4" />
              Painel
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center justify-between">
            Biblioteca de Módulos
            <button onClick={() => setShowCustom(!showCustom)} className="text-emerald-500 hover:text-emerald-400">
              <Plus className="w-3 h-3" />
            </button>
          </h3>
          
          {showCustom && (
            <div className="mb-4 p-3 bg-neutral-900 rounded-lg border border-neutral-700 space-y-3">
              <p className="text-[10px] font-bold text-neutral-500 uppercase">Criar do Zero</p>
              <div className="grid grid-cols-3 gap-2">
                <input 
                  type="number" placeholder="W" 
                  value={customDim.w} onChange={e => setCustomDim({...customDim, w: Number(e.target.value)})}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-1 py-1 text-[10px]" 
                />
                <input 
                  type="number" placeholder="H" 
                  value={customDim.h} onChange={e => setCustomDim({...customDim, h: Number(e.target.value)})}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-1 py-1 text-[10px]" 
                />
                <input 
                  type="number" placeholder="D" 
                  value={customDim.d} onChange={e => setCustomDim({...customDim, d: Number(e.target.value)})}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-1 py-1 text-[10px]" 
                />
              </div>
              <button 
                onClick={() => handleAddModule('cabinet', customDim)}
                className="w-full bg-emerald-600 text-white text-[10px] font-bold py-1 rounded hover:bg-emerald-700"
              >
                Adicionar Personalizado
              </button>
            </div>
          )}

          <div className="space-y-1">
            <button 
              onClick={() => handleAddModule('cabinet', { w: 600, h: 720, d: 580, config: { doors: 1 } })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
            >
              <Package className="w-4 h-4" />
              Balcão 1 Porta
            </button>
            <button 
              onClick={() => handleAddModule('cabinet', { w: 800, h: 720, d: 580, config: { doors: 2 } })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
            >
              <Package className="w-4 h-4" />
              Balcão 2 Portas
            </button>
            <button 
              onClick={() => handleAddModule('cabinet', { w: 600, h: 720, d: 580, config: { drawers: 4 } })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
            >
              <Package className="w-4 h-4" />
              Gaveteiro
            </button>
            <button 
              onClick={() => handleAddModule('cabinet', { w: 600, h: 2200, d: 580, config: { doors: 2, shelves: 4 } })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
            >
              <Package className="w-4 h-4" />
              Torre Quente
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Biblioteca Leo Madeiras</h3>
          <div className="grid grid-cols-2 gap-2">
            {LEO_MADEIRAS_PATTERNS.map((p) => (
              <button 
                key={p.name}
                onClick={() => {
                  const selectedId = useEditorStore.getState().selectedModuleId;
                  if (selectedId) {
                    useEditorStore.getState().updateModule(selectedId, { material: p.name });
                  } else {
                    alert('Selecione um móvel primeiro para aplicar o padrão.');
                  }
                }}
                className="group relative flex flex-col items-center gap-1 p-2 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-emerald-500 transition-all"
              >
                <div 
                  className="w-full aspect-square rounded shadow-inner" 
                  style={{ backgroundColor: p.hex }}
                />
                <span className="text-[9px] font-bold text-neutral-500 group-hover:text-white truncate w-full text-center">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-neutral-700 space-y-2">
        <button 
          onClick={handleSyncLeo}
          disabled={isSyncing}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm text-emerald-500 disabled:opacity-50"
        >
          {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Leo'}
        </button>
        <button 
          onClick={handleImport3D}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
        >
          <Layers className="w-4 h-4" />
          Importar 3D
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm">
          <Settings className="w-4 h-4" />
          Configurações
        </button>
      </div>
    </div>
  );
};
