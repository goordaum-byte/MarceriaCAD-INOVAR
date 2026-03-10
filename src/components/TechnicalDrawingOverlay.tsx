import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { X, Printer, Download, FileText } from 'lucide-react';

interface TechnicalDrawingOverlayProps {
  onClose: () => void;
}

export const TechnicalDrawingOverlay: React.FC<TechnicalDrawingOverlayProps> = ({ onClose }) => {
  const { modules, room } = useEditorStore();

  return (
    <div className="absolute inset-0 bg-neutral-900/95 backdrop-blur-md z-50 flex flex-col p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Projeto Técnico Automático</h2>
            <p className="text-sm text-neutral-400">Vistas 2D, cotas e especificações de montagem</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm">
            <Printer className="w-4 h-4" />
            Imprimir PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm">
            <Download className="w-4 h-4" />
            Exportar DWG
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 border-2 border-neutral-700 rounded-2xl bg-white relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        {/* Title Block */}
        <div className="absolute bottom-0 right-0 bg-white border-l-2 border-t-2 border-neutral-800 p-6 min-w-[400px]">
          <h2 className="text-lg font-bold uppercase mb-4 border-b-2 border-neutral-800 pb-2 text-neutral-900">PROJETO: {room?.name}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-neutral-600">
            <span className="font-bold">CLIENTE:</span> <span>CONSUMIDOR FINAL</span>
            <span className="font-bold">DATA:</span> <span>{new Date().toLocaleDateString()}</span>
            <span className="font-bold">ESCALA:</span> <span>1:20</span>
            <span className="font-bold">UNIDADE:</span> <span>MM</span>
            <span className="font-bold">RESPONSÁVEL:</span> <span>MARCENARIA AI CAD</span>
          </div>
        </div>

        {/* Labels for Modules in 2D */}
        <div className="absolute inset-0 flex items-center justify-center">
          {modules.map(m => (
            <div 
              key={m.id}
              className="absolute text-[10px] font-bold text-neutral-800 uppercase"
              style={{
                left: `calc(50% + ${m.position[0] / 5}px)`,
                top: `calc(50% + ${m.position[2] / 5}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="border-2 border-neutral-800 bg-white/80 px-2 py-1 shadow-sm">
                {m.type} #{m.id.slice(0,3)}
                <div className="text-[8px] opacity-70">{m.dimensions.width}x{m.dimensions.depth}mm</div>
              </div>
            </div>
          ))}
        </div>

        {/* Room Dimensions Labels */}
        {room && (
          <>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-xs font-black text-neutral-400 border-b-2 border-neutral-200 px-4">
              LARGURA TOTAL: {room.dimensions.width}mm
            </div>
            <div className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-black text-neutral-400 border-b-2 border-neutral-200 px-4">
              PROFUNDIDADE: {room.dimensions.depth}mm
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <div className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg">
          PLANTA BAIXA (VISTA SUPERIOR)
        </div>
        <div className="px-6 py-3 bg-neutral-800 text-neutral-400 rounded-xl font-bold text-xs hover:bg-neutral-700 transition-colors cursor-pointer">
          ELEVAÇÃO FRONTAL
        </div>
        <div className="px-6 py-3 bg-neutral-800 text-neutral-400 rounded-xl font-bold text-xs hover:bg-neutral-700 transition-colors cursor-pointer">
          CORTES TÉCNICOS
        </div>
      </div>
    </div>
  );
};
