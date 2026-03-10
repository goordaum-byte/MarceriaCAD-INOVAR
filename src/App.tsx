import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Scene3D } from './editor/Scene3D';
import { PropertiesPanel } from './components/PropertiesPanel';
import { useEditorStore } from './store/useEditorStore';
import { Dashboard } from './erp/Dashboard';
import { Production } from './erp/Production';
import { Sales } from './erp/Sales';
import { Purchases } from './erp/Purchases';
import { Documents } from './erp/Documents';
import { Login } from './components/Login';
import { ModelingToolbar } from './components/ModelingToolbar';
import { TechnicalDrawingOverlay } from './components/TechnicalDrawingOverlay';
import { CuttingPlanOverlay } from './components/CuttingPlanOverlay';
import { DrillingPlanOverlay } from './components/DrillingPlanOverlay';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<'editor' | 'dashboard'>('editor');
  const [erpSection, setErpSection] = useState<'main' | 'production' | 'sales' | 'purchases' | 'documents'>('main');
  const { 
    modules, 
    showCuttingPlan, 
    setShowCuttingPlan,
    showDrillingPlan,
    setShowDrillingPlan,
    showTechnicalDrawing,
    setShowTechnicalDrawing
  } = useEditorStore();
  const selectModule = useEditorStore((state) => state.selectModule);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderERP = () => {
    switch (erpSection) {
      case 'production': return <Production />;
      case 'sales': return <Sales />;
      case 'purchases': return <Purchases />;
      case 'documents': return <Documents />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-neutral-900 overflow-hidden font-sans">
      <Sidebar onNavigate={(section) => {
        if (section === 'editor') {
          setView('editor');
        } else {
          setView('dashboard');
          setErpSection(section as any);
        }
      }} currentSection={view === 'editor' ? 'editor' : erpSection} />
      
      <main className="flex-1 relative flex flex-col">
        {view === 'editor' && <ModelingToolbar />}
        {showTechnicalDrawing && <TechnicalDrawingOverlay onClose={() => setShowTechnicalDrawing(false)} />}
        {showCuttingPlan && <CuttingPlanOverlay onClose={() => setShowCuttingPlan(false)} />}
        {showDrillingPlan && <DrillingPlanOverlay onClose={() => setShowDrillingPlan(false)} />}
        {/* Toolbar */}
        <div className="h-12 bg-neutral-800 border-b border-neutral-700 flex items-center px-4 justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-500 uppercase font-bold">Projeto: Cozinha Moderna</span>
            <div className="h-4 w-px bg-neutral-700" />
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setView('dashboard')}
                className={`px-3 py-1 text-xs rounded transition-colors ${view === 'dashboard' ? 'bg-emerald-600 text-white' : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setView('editor')}
                className={`px-3 py-1 text-xs rounded transition-colors ${view === 'editor' ? 'bg-emerald-600 text-white' : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'}`}
              >
                Editor 3D
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const modules = useEditorStore.getState().modules;
                console.log('--- PLANO DE CORTE (OTIMIZADO) ---');
                modules.filter(m => m.type !== 'wall').forEach(m => {
                  console.log(`Módulo: ${m.type} (${m.dimensions.width}x${m.dimensions.height}x${m.dimensions.depth})`);
                  console.log(`- Laterais (2x): ${m.dimensions.height} x ${m.dimensions.depth} mm`);
                  console.log(`- Base/Teto (2x): ${m.dimensions.width - 2*m.dimensions.thickness} x ${m.dimensions.depth} mm`);
                  if (m.config?.shelves) console.log(`- Prateleiras (${m.config.shelves}x): ${m.dimensions.width - 2*m.dimensions.thickness} x ${m.dimensions.depth - 10} mm`);
                });
                alert('Plano de Corte e Furação gerado no console do desenvolvedor!');
              }}
              className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              Exportar Projeto Técnico
            </button>
            <span className="text-xs text-neutral-500">Sincronizado com Nuvem</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden">
          {view === 'editor' ? (
            <>
              <Scene3D />
              <div className="absolute bottom-4 left-4 flex gap-2">
                {modules.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => selectModule(m.id)}
                    className="px-3 py-1 bg-neutral-800/80 backdrop-blur border border-neutral-700 rounded-full text-xs text-white hover:bg-neutral-700"
                  >
                    {m.type} #{m.id.slice(0,4)}
                  </button>
                ))}
              </div>
            </>
          ) : (
            renderERP()
          )}
        </div>
      </main>

      {view === 'editor' && <PropertiesPanel />}
    </div>
  );
}
