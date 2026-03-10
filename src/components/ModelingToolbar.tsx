import React from 'react';
import { 
  MousePointer2, Move, RotateCw, Maximize2, 
  Square, ArrowUpFromLine, Box, Layout, 
  Eye, EyeOff, Grid3X3, Ruler, Sparkles,
  FileText
} from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';

export const ModelingToolbar: React.FC = () => {
  const { 
    activeTool, setActiveTool, viewMode, setViewMode, 
    renderMode, setRenderMode, setShowTechnicalDrawing 
  } = useEditorStore();

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Selecionar (S)' },
    { id: 'move', icon: Move, label: 'Mover (M)' },
    { id: 'rotate', icon: RotateCw, label: 'Girar (R)' },
    { id: 'scale', icon: Maximize2, label: 'Escalar (E)' },
    { id: 'push-pull', icon: ArrowUpFromLine, label: 'Empurrar/Puxar (P)' },
    { id: 'wall', icon: Square, label: 'Parede (W)' },
  ];

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-neutral-800/90 backdrop-blur border border-neutral-700 rounded-xl shadow-2xl z-50">
      <div className="flex items-center gap-1 pr-2 border-r border-neutral-700">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id as any)}
            title={tool.label}
            className={`p-2 rounded-lg transition-all ${
              activeTool === tool.id 
                ? 'bg-emerald-600 text-white shadow-inner' 
                : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
            }`}
          >
            <tool.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 pl-1">
        <button
          onClick={() => setShowTechnicalDrawing(true)}
          title="Gerar Projeto Técnico (2D)"
          className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all"
        >
          <FileText className="w-5 h-5" />
        </button>

        <button
          onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
          title={viewMode === '3d' ? 'Vista 2D (Planta)' : 'Vista 3D (Perspectiva)'}
          className={`p-2 rounded-lg transition-all ${
            viewMode === '2d' 
              ? 'bg-blue-600 text-white shadow-inner' 
              : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
          }`}
        >
          {viewMode === '3d' ? <Layout className="w-5 h-5" /> : <Box className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setRenderMode(renderMode === 'standard' ? 'realistic' : 'standard')}
          title={renderMode === 'standard' ? 'Ativar Render Realista' : 'Voltar para Modo Padrão'}
          className={`p-2 rounded-lg transition-all ${
            renderMode === 'realistic' 
              ? 'bg-amber-500 text-white shadow-inner' 
              : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
          }`}
        >
          <Sparkles className="w-5 h-5" />
        </button>
        
        <button
          title="Snap Automático"
          className="p-2 rounded-lg text-emerald-500 hover:bg-neutral-700 transition-all"
        >
          <Grid3X3 className="w-5 h-5" />
        </button>

        <button
          title="Medidas"
          className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all"
        >
          <Ruler className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
