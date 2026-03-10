import React, { useState, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, Mesh } from 'three';
import { useEditorStore } from '../store/useEditorStore';
import { v4 as uuidv4 } from 'uuid';

export const WallTool: React.FC = () => {
  const { activeTool, addModule } = useEditorStore();
  const { raycaster, mouse, camera, scene } = useThree();
  const [startPoint, setStartPoint] = useState<Vector3 | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Vector3 | null>(null);
  const previewRef = useRef<Mesh>(null);

  if (activeTool !== 'wall') return null;

  const getFloorPoint = () => {
    raycaster.setFromCamera(mouse, camera);
    const floor = scene.getObjectByName('floor');
    if (!floor) return null;
    const intersects = raycaster.intersectObject(floor);
    if (intersects.length > 0) {
      return intersects[0].point;
    }
    return null;
  };

  const handlePointerDown = (e: any) => {
    if (e.button !== 0) return;
    const point = getFloorPoint();
    if (point) {
      if (!startPoint) {
        setStartPoint(point.clone());
      } else {
        // Finish wall
        const endPoint = point.clone();
        const distance = startPoint.distanceTo(endPoint);
        const center = startPoint.clone().add(endPoint).multiplyScalar(0.5);
        const angle = Math.atan2(endPoint.x - startPoint.x, endPoint.z - startPoint.z);

        addModule({
          id: uuidv4(),
          type: 'wall',
          position: [center.x, 0, center.z],
          rotation: [0, angle + Math.PI / 2, 0],
          dimensions: {
            width: distance,
            height: 2600,
            depth: 150,
            thickness: 150
          },
          material: 'Alvenaria Branca'
        });

        setStartPoint(null);
        setCurrentPoint(null);
      }
    }
  };

  const handlePointerMove = () => {
    if (startPoint) {
      const point = getFloorPoint();
      if (point) {
        setCurrentPoint(point.clone());
      }
    }
  };

  return (
    <group onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}>
      {/* Invisible plane to catch clicks if floor is not enough */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} visible={false}>
        <planeGeometry args={[20000, 20000]} />
      </mesh>

      {startPoint && currentPoint && (
        <mesh 
          position={[
            (startPoint.x + currentPoint.x) / 2,
            1300,
            (startPoint.z + currentPoint.z) / 2
          ]}
          rotation={[0, Math.atan2(currentPoint.x - startPoint.x, currentPoint.z - startPoint.z) + Math.PI / 2, 0]}
        >
          <boxGeometry args={[startPoint.distanceTo(currentPoint), 2600, 150]} />
          <meshStandardMaterial color="#3b82f6" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Visual indicator for start point */}
      {startPoint && (
        <mesh position={[startPoint.x, 10, startPoint.z]}>
          <cylinderGeometry args={[20, 20, 20]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
      )}
    </group>
  );
};
