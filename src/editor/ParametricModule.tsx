import React from 'react';
import { Module, useEditorStore } from '../store/useEditorStore';
import { PivotControls, Html } from '@react-three/drei';

interface ParametricModuleProps {
  module: Module;
}

export const ParametricModule: React.FC<ParametricModuleProps> = ({ module }) => {
  const { selectedModuleId, selectModule, updateModule, activeTool, modules } = useEditorStore();
  const { width, height, depth, thickness } = module.dimensions;
  const isSelected = selectedModuleId === module.id;

  // Snapping logic
  const handleDrag = (l: any, dl: any, w: any, dw: any) => {
    if (activeTool === 'move') {
      let newPos: [number, number, number] = [w.elements[12], w.elements[13], w.elements[14]];
      
      // Basic snapping to other modules or walls
      modules.forEach(other => {
        if (other.id === module.id) return;
        
        // Snap X
        if (Math.abs(newPos[0] - (other.position[0] + other.dimensions.width)) < 50) {
          newPos[0] = other.position[0] + other.dimensions.width;
        } else if (Math.abs(newPos[0] + width - other.position[0]) < 50) {
          newPos[0] = other.position[0] - width;
        }

        // Snap Z
        if (Math.abs(newPos[2] - other.position[2]) < 50) {
          newPos[2] = other.position[2];
        }
      });

      updateModule(module.id, { position: newPos });
    } else if (activeTool === 'rotate') {
      // Extract rotation from matrix
      const rotation: [number, number, number] = [
        Math.atan2(w.elements[9], w.elements[10]),
        Math.atan2(-w.elements[8], Math.sqrt(w.elements[0]**2 + w.elements[4]**2)),
        Math.atan2(w.elements[4], w.elements[0])
      ];
      updateModule(module.id, { rotation });
    } else if (activeTool === 'scale') {
      const scaleX = Math.sqrt(w.elements[0]**2 + w.elements[1]**2 + w.elements[2]**2);
      const scaleY = Math.sqrt(w.elements[4]**2 + w.elements[5]**2 + w.elements[6]**2);
      const scaleZ = Math.sqrt(w.elements[8]**2 + w.elements[9]**2 + w.elements[10]**2);
      
      updateModule(module.id, {
        dimensions: {
          ...module.dimensions,
          width: Math.max(10, width * scaleX),
          height: Math.max(10, height * scaleY),
          depth: Math.max(10, depth * scaleZ),
        }
      });
    } else if (activeTool === 'push-pull') {
      // Simple push-pull logic: use drag delta to change dimensions
      const deltaX = dl.elements[12];
      const deltaY = dl.elements[13];
      const deltaZ = dl.elements[14];
      
      updateModule(module.id, {
        dimensions: {
          ...module.dimensions,
          width: Math.max(100, width + deltaX),
          height: Math.max(100, height + deltaY),
          depth: Math.max(100, depth + deltaZ),
        }
      });
    }
  };

  let parts: { pos: [number, number, number]; dim: [number, number, number]; color?: string; type?: string }[] = [];

  if (module.type === 'wall' || module.type === 'pillar' || module.type === 'viga') {
    parts = [{ pos: [0, height / 2, 0], dim: [width, height, thickness || 150] }];
  } else if (module.type === 'panel') {
    parts = [{ pos: [0, height / 2, 0], dim: [width, height, thickness || 18] }];
  } else if (module.type === 'door' || module.type === 'window') {
    parts = [{ pos: [0, height / 2, 0], dim: [width, height, thickness], color: module.type === 'window' ? '#add8e6' : '#8b4513' }];
  } else if (module.type === 'niche') {
    parts = [
      { pos: [-width / 2 + thickness / 2, height / 2, 0], dim: [thickness, height, depth] }, // Left
      { pos: [width / 2 - thickness / 2, height / 2, 0], dim: [thickness, height, depth] }, // Right
      { pos: [0, thickness / 2, 0], dim: [width - 2 * thickness, thickness, depth] }, // Base
      { pos: [0, height - thickness / 2, 0], dim: [width - 2 * thickness, thickness, depth] }, // Top
      { pos: [0, height / 2, -depth / 2 + 3], dim: [width - 2 * thickness, height - 2 * thickness, 6], color: '#f0f0f0' }, // Back
    ];
  } else {
    // Structure
    parts = [
      { pos: [-width / 2 + thickness / 2, height / 2, 0], dim: [thickness, height, depth] }, // Left
      { pos: [width / 2 - thickness / 2, height / 2, 0], dim: [thickness, height, depth] }, // Right
      { pos: [0, thickness / 2, 0], dim: [width - 2 * thickness, thickness, depth] }, // Base
      { pos: [0, height - thickness / 2, 0], dim: [width - 2 * thickness, thickness, depth] }, // Top
      { pos: [0, height / 2, -depth / 2 + 3], dim: [width - 2 * thickness, height - 2 * thickness, 6], color: '#f0f0f0' }, // Back
    ];

    // Shelves
    if (module.config?.shelves) {
      const shelfCount = module.config.shelves;
      const shelfSpacing = (height - 2 * thickness) / (shelfCount + 1);
      for (let i = 1; i <= shelfCount; i++) {
        parts.push({
          pos: [0, thickness + i * shelfSpacing, 0],
          dim: [width - 2 * thickness, thickness, depth - 10],
          type: 'shelf'
        });
      }
    }

    // Partitions
    if (module.config?.partitions) {
      const partCount = module.config.partitions;
      const partSpacing = (width - 2 * thickness) / (partCount + 1);
      for (let i = 1; i <= partCount; i++) {
        parts.push({
          pos: [-width / 2 + thickness + i * partSpacing, height / 2, 0],
          dim: [thickness, height - 2 * thickness, depth - 10],
          type: 'partition'
        });
      }
    }

    // Drawers
    if (module.config?.drawers) {
      const drawerCount = module.config.drawers;
      const drawerHeight = (height - 2 * thickness) / drawerCount;
      for (let i = 0; i < drawerCount; i++) {
        const yPos = thickness + drawerHeight / 2 + i * drawerHeight;
        parts.push({ pos: [0, yPos, depth / 2 - 9], dim: [width - 4, drawerHeight - 4, 18], type: 'drawer-front' });
        if (module.config.hasHardware) {
          parts.push({ pos: [0, yPos + drawerHeight / 4, depth / 2 + 5], dim: [120, 10, 20], color: '#999', type: 'handle' });
        }
      }
    }

    // Doors
    if (module.config?.doors && !module.config?.drawers) {
      const doorCount = module.config.doors;
      const isSliding = module.config.doorType === 'sliding';
      const doorWidth = (width - 4) / doorCount;
      
      for (let i = 0; i < doorCount; i++) {
        const xPos = -width / 2 + 2 + doorWidth / 2 + i * doorWidth;
        const zOffset = isSliding ? (i % 2 === 0 ? 10 : 30) : 9;
        
        parts.push({ 
          pos: [xPos, height / 2, depth / 2 + zOffset], 
          dim: [doorWidth - 2, height - 4, 18], 
          type: 'door-front' 
        });

        if (module.config.hasHardware) {
          if (isSliding) {
            // Sliding door handles
            const handleX = i % 2 === 0 ? xPos + doorWidth / 2 - 40 : xPos - doorWidth / 2 + 40;
            parts.push({ pos: [handleX, height / 2, depth / 2 + zOffset + 10], dim: [10, 120, 20], color: '#999', type: 'handle' });
          } else {
            // Hinged door handles
            const handleX = i === 0 ? xPos + doorWidth / 3 : xPos - doorWidth / 3;
            parts.push({ pos: [handleX, height / 2, depth / 2 + zOffset + 11], dim: [10, 120, 20], color: '#999', type: 'handle' });
          }
        }
      }
    }
  }

  return (
    <group 
      position={module.position} 
      rotation={module.rotation}
      onClick={(e) => {
        e.stopPropagation();
        selectModule(module.id);
      }}
    >
      {isSelected && activeTool !== 'select' ? (
        <PivotControls
          anchor={[0, 0, 0]}
          depthTest={false}
          fixed={false}
          scale={200}
          activeAxes={[
            activeTool === 'move' || activeTool === 'push-pull' || activeTool === 'scale', 
            activeTool === 'move' || activeTool === 'push-pull' || activeTool === 'scale', 
            activeTool === 'move' || activeTool === 'push-pull' || activeTool === 'scale'
          ]}
          disableRotations={activeTool !== 'rotate'}
          disableAxes={activeTool === 'rotate'}
          onDrag={handleDrag}
        >
          <ModuleGeometry parts={parts} module={module} isSelected={isSelected} />
        </PivotControls>
      ) : (
        <ModuleGeometry parts={parts} module={module} isSelected={isSelected} />
      )}
      
      {isSelected && (
        <Html position={[0, height + 100, 0]} center>
          <div className="bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap shadow-lg flex gap-2">
            <span>{width}x{height}x{depth}mm</span>
            <span className="opacity-70">| {module.material}</span>
          </div>
        </Html>
      )}
    </group>
  );
};

const LEO_MADEIRAS_COLORS: Record<string, string> = {
  'Branco Diamante': '#ffffff',
  'Louro Freijó': '#a67c52',
  'Carvalho Hanover': '#d2b48c',
  'Nogueira Caiena': '#5d4037',
  'Grafite': '#424242',
  'Preto Silk': '#1a1a1a',
};

const ModuleGeometry = ({ parts, module, isSelected }: any) => {
  const { width, height, depth, thickness } = module.dimensions;
  const materialColor = LEO_MADEIRAS_COLORS[module.material] || '#d4a373';
  const getPartColor = (part: any) => {
    if (part.color) return part.color;
    if (module.metadata?.isImported) return '#6366f1'; // Indigo for imported
    if (module.type === 'wall') return '#e5e5e5';
    if (module.type === 'pillar') return '#d4d4d4';
    if (module.type === 'viga') return '#a3a3a3';
    return materialColor;
  };

  return (
    <>
      {parts.map((part: any, i: number) => (
        <mesh key={i} position={part.pos} castShadow receiveShadow>
          <boxGeometry args={part.dim} />
          <meshStandardMaterial 
            color={getPartColor(part)} 
            emissive={isSelected && part.type !== 'handle' ? '#3b82f6' : '#000000'}
            emissiveIntensity={isSelected ? 0.1 : 0}
            roughness={0.7}
            metalness={part.type === 'handle' ? 0.8 : 0.1}
          />
        </mesh>
      ))}
      {isSelected && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width + 4, height + 4, (module.type === 'wall' ? thickness : depth) + 4]} />
          <meshStandardMaterial color="#3b82f6" wireframe transparent opacity={0.2} />
        </mesh>
      )}
    </>
  );
};
