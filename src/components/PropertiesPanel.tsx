import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { saveProject } from '../services/supabaseService';
import { 
  X, Save, FileText, Scissors, Drill, Trash2, Settings,
  Loader2
} from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const selectedModuleId = useEditorStore((state) => state.selectedModuleId);
  const modules = useEditorStore((state) => state.modules);
  const room = useEditorStore((state) => state.room);
  const updateModule = useEditorStore((state) => state.updateModule);
  const removeModule = useEditorStore((state) => state.removeModule);
  const selectModule = useEditorStore((state) => state.selectModule);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProject(room?.name || 'Projeto Sem Nome', { modules, room });
      alert('Projeto salvo com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar projeto. Verifique a configuração do Supabase.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  if (!selectedModule) {
    return (
      <div className="w-80 bg-neutral-800 border-l border-neutral-700 p-4 text-neutral-400 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center">
          <Settings className="w-6 h-6 text-neutral-500" />
        </div>
        <p className="text-sm">Selecione um módulo para editar suas propriedades.</p>
      </div>
    );
  }

  const handleChange = (field: string, value: any, index?: number) => {
    if (['width', 'height', 'depth', 'thickness'].includes(field)) {
      updateModule(selectedModule.id, {
        dimensions: { ...selectedModule.dimensions, [field]: Number(value) },
      });
    } else if (field === 'position' && index !== undefined) {
      const newPos = [...selectedModule.position] as [number, number, number];
      newPos[index] = Number(value);
      updateModule(selectedModule.id, { position: newPos });
    } else if (field === 'rotation' && index !== undefined) {
      const newRot = [...selectedModule.rotation] as [number, number, number];
      newRot[index] = Number(value) * (Math.PI / 180); // Convert to radians
      updateModule(selectedModule.id, { rotation: newRot });
    } else {
      updateModule(selectedModule.id, { [field]: value });
    }
  };

  const handleRemove = () => {
    removeModule(selectedModule.id);
    selectModule(null);
  };

  return (
    <div className="w-80 bg-neutral-800 border-l border-neutral-700 flex flex-col h-full text-neutral-300">
      <div className="p-4 border-b border-neutral-700 font-bold text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="capitalize">{selectedModule.type}</span>
          <span className="text-[10px] text-neutral-500 font-mono">#{selectedModule.id.slice(0, 6)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRemove} className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={() => selectModule(null)} className="p-1 hover:bg-neutral-700 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Dimensions */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Dimensões (mm)</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-neutral-500 block mb-1">Largura</span>
              <input
                type="number"
                value={selectedModule.dimensions.width}
                onChange={(e) => handleChange('width', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block mb-1">Altura</span>
              <input
                type="number"
                value={selectedModule.dimensions.height}
                onChange={(e) => handleChange('height', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block mb-1">Profundidade</span>
              <input
                type="number"
                value={selectedModule.dimensions.depth}
                onChange={(e) => handleChange('depth', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block mb-1">Espessura</span>
              <input
                type="number"
                value={selectedModule.dimensions.thickness}
                onChange={(e) => handleChange('thickness', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Position */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Posição (mm)</label>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, i) => (
              <div key={axis}>
                <span className="text-[10px] text-neutral-500 block mb-1">{axis}</span>
                <input
                  type="number"
                  value={selectedModule.position[i]}
                  onChange={(e) => handleChange('position', e.target.value, i)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Rotação (Graus)</label>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, i) => (
              <div key={axis}>
                <span className="text-[10px] text-neutral-500 block mb-1">{axis}</span>
                <input
                  type="number"
                  value={Math.round(selectedModule.rotation[i] * (180 / Math.PI))}
                  onChange={(e) => handleChange('rotation', e.target.value, i)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Configuration */}
        {selectedModule.type === 'cabinet' && (
          <div className="space-y-3 pt-4 border-t border-neutral-700">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Configuração</label>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-neutral-500 block mb-1">Quantidade de Gavetas</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={selectedModule.config?.drawers || 0}
                  onChange={(e) => updateModule(selectedModule.id, { 
                    config: { ...selectedModule.config, drawers: Number(e.target.value) } 
                  })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block mb-1">Quantidade de Portas</span>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={selectedModule.config?.doors || 0}
                  onChange={(e) => updateModule(selectedModule.id, { 
                    config: { ...selectedModule.config, doors: Number(e.target.value) } 
                  })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              {selectedModule.config?.doors && selectedModule.config.doors > 0 && (
                <div>
                  <span className="text-[10px] text-neutral-500 block mb-1">Tipo de Abertura</span>
                  <select 
                    value={selectedModule.config?.doorType || 'hinged'}
                    onChange={(e) => updateModule(selectedModule.id, { config: { ...selectedModule.config, doorType: e.target.value as 'sliding' | 'hinged' } })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="hinged">Giro (Dobradiça)</option>
                    <option value="sliding">Deslizante (Trilho)</option>
                  </select>
                </div>
              )}
              <div>
                <span className="text-[10px] text-neutral-500 block mb-1">Prateleiras Internas</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={selectedModule.config?.shelves || 0}
                  onChange={(e) => updateModule(selectedModule.id, { 
                    config: { ...selectedModule.config, shelves: Number(e.target.value) } 
                  })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block mb-1">Divisórias Verticais</span>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={selectedModule.config?.partitions || 0}
                  onChange={(e) => updateModule(selectedModule.id, { 
                    config: { ...selectedModule.config, partitions: Number(e.target.value) } 
                  })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">Incluir Ferragens (Puxadores)</span>
                <input
                  type="checkbox"
                  checked={selectedModule.config?.hasHardware || false}
                  onChange={(e) => updateModule(selectedModule.id, { 
                    config: { ...selectedModule.config, hasHardware: e.target.checked } 
                  })}
                  className="w-4 h-4 accent-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Material & Hardware */}
        <div className="space-y-4 pt-4 border-t border-neutral-700">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Materiais e Ferragens</label>
          
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-neutral-500 block mb-1">Padrão MDF</span>
              <select 
                value={selectedModule.material}
                onChange={(e) => updateModule(selectedModule.id, { material: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Branco Diamante">Branco Diamante</option>
                <option value="Louro Freijó">Louro Freijó</option>
                <option value="Carvalho Hanover">Carvalho Hanover</option>
                <option value="Nogueira Caiena">Nogueira Caiena</option>
                <option value="Grafite">Grafite</option>
                <option value="Preto Silk">Preto Silk</option>
                <option value="Madeira">Madeira Maciça</option>
                <option value="Vidro">Vidro</option>
                <option value="Alvenaria">Alvenaria</option>
              </select>
            </div>

            {selectedModule.type === 'cabinet' && (
              <>
                <div>
                  <span className="text-[10px] text-neutral-500 block mb-1">Tipo de Puxador</span>
                  <select 
                    value={selectedModule.config?.handleType || 'perfil'}
                    onChange={(e) => updateModule(selectedModule.id, { config: { ...selectedModule.config, handleType: e.target.value } })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="perfil">Perfil Alumínio (Leo)</option>
                    <option value="ponto">Ponto Cromado</option>
                    <option value="alca">Alça Escovada</option>
                    <option value="cava">Cava no MDF</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-500 block mb-1">Tipo de Corrediça</span>
                  <select 
                    value={selectedModule.config?.slideType || 'telescopica'}
                    onChange={(e) => updateModule(selectedModule.id, { config: { ...selectedModule.config, slideType: e.target.value } })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="telescopica">Telescópica Standard</option>
                    <option value="invisivel">Invisível com Amortecedor</option>
                    <option value="quadro">Quadro V6</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-neutral-700">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Ações Técnicas</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => {
                const newModule = { ...selectedModule, id: Math.random().toString(36).substr(2, 9), position: [selectedModule.position[0] + 100, selectedModule.position[1], selectedModule.position[2] + 100] as [number, number, number] };
                useEditorStore.getState().addModule(newModule);
              }}
              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-xs text-white hover:bg-neutral-700 transition-colors"
            >
              Duplicar
            </button>
            <button 
              onClick={() => {
                updateModule(selectedModule.id, { rotation: [selectedModule.rotation[0], selectedModule.rotation[1] + Math.PI, selectedModule.rotation[2]] });
              }}
              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-xs text-white hover:bg-neutral-700 transition-colors"
            >
              Espelhar
            </button>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => useEditorStore.getState().setShowCuttingPlan(true)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm"
            >
              <Scissors className="w-4 h-4" />
              Plano de Corte
            </button>
            <button 
              onClick={() => useEditorStore.getState().setShowDrillingPlan(true)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              <Drill className="w-4 h-4" />
              Plano de Furação
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-neutral-700">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors shadow-lg disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Salvando...' : 'Salvar Projeto'}
        </button>
      </div>
    </div>
  );
};
