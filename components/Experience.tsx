
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Foliage from './Foliage';
import Ornaments from './Ornaments';
import { TreeState } from '../types';

interface ExperienceProps {
  state: TreeState;
}

const Experience: React.FC<ExperienceProps> = ({ state }) => {
  const groupRef = useRef<THREE.Group>(null);
  const lerpFactor = useRef(0);

  useFrame((_, delta) => {
    // Smooth transition progress
    const target = state === TreeState.FORMED ? 1 : 0;
    lerpFactor.current = THREE.MathUtils.lerp(lerpFactor.current, target, delta * 2.5);
    
    if (groupRef.current) {
        // Subtle floating movement
        groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Foliage progressRef={lerpFactor} />
      <Ornaments progressRef={lerpFactor} />
      
      {/* Decorative Tree Base / Pot */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[1, 0.8, 1, 32]} />
        <meshStandardMaterial 
            color="#111" 
            metalness={0.9} 
            roughness={0.1} 
            emissive="#D4AF37" 
            emissiveIntensity={0.05} 
        />
      </mesh>
    </group>
  );
};

export default Experience;
