
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FOLIAGE_COUNT, TREE_HEIGHT, TREE_RADIUS, LUXURY_PALETTE } from '../constants';

const foliageVertexShader = `
  uniform float uProgress;
  uniform float uTime;
  attribute vec3 aChaosPosition;
  attribute vec3 aTargetPosition;
  varying float vDistance;
  varying vec3 vColor;

  void main() {
    vec3 mixedPosition = mix(aChaosPosition, aTargetPosition, uProgress);
    
    // Add subtle wind sway
    float sway = sin(uTime + mixedPosition.y * 2.0) * 0.05 * uProgress;
    mixedPosition.x += sway;
    mixedPosition.z += sway;

    vec4 mvPosition = modelViewMatrix * vec4(mixedPosition, 1.0);
    gl_PointSize = (40.0 / -mvPosition.z) * (1.0 + 0.5 * sin(uTime * 2.0 + mixedPosition.y));
    gl_Position = projectionMatrix * mvPosition;

    vDistance = length(mixedPosition);
    vColor = mix(vec3(0.015, 0.22, 0.15), vec3(0.83, 0.68, 0.21), uProgress * (1.0 - mixedPosition.y / 8.0));
  }
`;

const foliageFragmentShader = `
  varying vec3 vColor;
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.2, dist);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

interface FoliageProps {
  progressRef: React.MutableRefObject<number>;
}

const Foliage: React.FC<FoliageProps> = ({ progressRef }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { chaosPositions, targetPositions } = useMemo(() => {
    const chaos = new Float32Array(FOLIAGE_COUNT * 3);
    const target = new Float32Array(FOLIAGE_COUNT * 3);

    for (let i = 0; i < FOLIAGE_COUNT; i++) {
      // Chaos: Random in a large sphere
      const r = 10 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      chaos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      chaos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      chaos[i * 3 + 2] = r * Math.cos(phi);

      // Target: Cone shape (Christmas Tree)
      const h = Math.random() * TREE_HEIGHT;
      const radiusAtHeight = (1 - h / TREE_HEIGHT) * TREE_RADIUS;
      const angle = Math.random() * Math.PI * 2;
      const spiralFactor = h * 2.0; // Adds a slight spiral density
      const dist = Math.sqrt(Math.random()) * radiusAtHeight;
      
      target[i * 3] = Math.cos(angle + spiralFactor) * dist;
      target[i * 3 + 1] = h;
      target[i * 3 + 2] = Math.sin(angle + spiralFactor) * dist;
    }

    return { chaosPositions: chaos, targetPositions: target };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = progressRef.current;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={FOLIAGE_COUNT} 
          array={chaosPositions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-aChaosPosition" 
          count={FOLIAGE_COUNT} 
          array={chaosPositions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-aTargetPosition" 
          count={FOLIAGE_COUNT} 
          array={targetPositions} 
          itemSize={3} 
        />
      </bufferGeometry>
      <shaderMaterial 
        ref={materialRef}
        vertexShader={foliageVertexShader}
        fragmentShader={foliageFragmentShader}
        uniforms={{
          uProgress: { value: 0 },
          uTime: { value: 0 }
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default Foliage;
