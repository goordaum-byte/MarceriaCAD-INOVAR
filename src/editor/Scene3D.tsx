import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { useEditorStore } from '../store/useEditorStore';
import { ParametricModule } from './ParametricModule';
import { WallTool } from './WallTool';

export const Scene3D: React.FC = () => {
  const { modules, viewMode, renderMode, room, selectModule } = useEditorStore();

  return (
    <div className="w-full h-full bg-neutral-900">
      <Canvas shadows onPointerMissed={() => selectModule(null)}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={viewMode === '3d' ? [3000, 3000, 3000] : [0, 8000, 0]} far={100000} />
          
          <OrbitControls 
            makeDefault 
            target={[0, 0, 0]} 
            enableRotate={viewMode === '3d'}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.1}
          />

          <ambientLight intensity={renderMode === 'realistic' ? 0.3 : 0.7} />
          <pointLight position={[5000, 5000, 5000]} castShadow intensity={renderMode === 'realistic' ? 2 : 1.5} shadow-mapSize={[2048, 2048]} />
          <spotLight position={[-5000, 8000, 5000]} angle={0.15} penumbra={1} intensity={renderMode === 'realistic' ? 2 : 1} castShadow />
          <Environment preset={renderMode === 'realistic' ? 'apartment' : 'city'} />
          <ContactShadows opacity={renderMode === 'realistic' ? 0.6 : 0.4} scale={20000} blur={2} far={1000} />
          
          <Grid 
            infiniteGrid 
            fadeDistance={50000} 
            fadeStrength={5} 
            cellSize={100} 
            sectionSize={1000} 
            sectionColor="#444" 
            cellColor="#333" 
          />

          {/* Floor */}
          <mesh name="floor" rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[100000, 100000]} />
            <meshStandardMaterial color="#171717" roughness={0.8} />
          </mesh>

          <WallTool />

          {/* Room Boundary */}
          {room && (
            <mesh position={[0, 5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[room.dimensions.width, room.dimensions.depth]} />
              <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.2} />
            </mesh>
          )}

          {modules.map((module) => (
            <ParametricModule key={module.id} module={module} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
};
