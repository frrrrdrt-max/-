
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ORNAMENT_COUNT, TREE_HEIGHT, TREE_RADIUS, COLORS, LUXURY_PALETTE } from '../constants';
import { OrnamentData } from '../types';

interface OrnamentsProps {
  progressRef: React.MutableRefObject<number>;
}

const Ornaments: React.FC<OrnamentsProps> = ({ progressRef }) => {
  const meshRefBalls = useRef<THREE.InstancedMesh>(null);
  const meshRefGifts = useRef<THREE.InstancedMesh>(null);
  const meshRefLights = useRef<THREE.InstancedMesh>(null);

  const ornaments = useMemo(() => {
    const data: OrnamentData[] = [];
    for (let i = 0; i < ORNAMENT_COUNT; i++) {
      const type = i % 10 === 0 ? 'gift' : (i % 3 === 0 ? 'light' : 'ball');
      
      // Target: Randomly placed on the surface of the tree cone
      const h = Math.random() * (TREE_HEIGHT - 0.5);
      const radiusAtHeight = (1 - h / TREE_HEIGHT) * TREE_RADIUS;
      const angle = Math.random() * Math.PI * 2;
      
      const targetPos: [number, number, number] = [
        Math.cos(angle) * radiusAtHeight * 0.95,
        h,
        Math.sin(angle) * radiusAtHeight * 0.95
      ];

      // Chaos: Random in outer shell
      const r = 12 + Math.random() * 8;
      const cTheta = Math.random() * Math.PI * 2;
      const cPhi = Math.acos(2 * Math.random() - 1);
      const chaosPos: [number, number, number] = [
        r * Math.sin(cPhi) * Math.cos(cTheta),
        r * Math.sin(cPhi) * Math.sin(cTheta),
        r * Math.cos(cPhi)
      ];

      data.push({
        id: i,
        type,
        chaosPos,
        targetPos,
        color: COLORS[i % COLORS.length],
        weight: type === 'gift' ? 3.0 : (type === 'ball' ? 1.0 : 0.2)
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ mouse, clock }) => {
    const progress = progressRef.current;
    const time = clock.elapsedTime;

    // We use a single loop but check types for instanced mesh updates
    let ballIdx = 0, giftIdx = 0, lightIdx = 0;
    
    ornaments.forEach((o) => {
      // Lerp with weight-based lag for "physical" feel
      // Heavier objects (gifts) lag more
      const localProgress = Math.pow(progress, 1 + o.weight * 0.5);
      
      const x = THREE.MathUtils.lerp(o.chaosPos[0], o.targetPos[0], localProgress);
      const y = THREE.MathUtils.lerp(o.chaosPos[1], o.targetPos[1], localProgress);
      const z = THREE.MathUtils.lerp(o.chaosPos[2], o.targetPos[2], localProgress);

      dummy.position.set(x, y, z);
      
      // Interaction push (mouse repulsion)
      const mouseVec = new THREE.Vector3(mouse.x * 5, mouse.y * 5 + 3, 0);
      const dist = dummy.position.distanceTo(mouseVec);
      if (dist < 2.5) {
        const force = (1 - dist / 2.5) * 0.5 / o.weight;
        const dir = dummy.position.clone().sub(mouseVec).normalize();
        dummy.position.add(dir.multiplyScalar(force));
      }

      // Individual rotation
      dummy.rotation.set(
        time * 0.5 * (o.id % 2 === 0 ? 1 : -1),
        time * 0.3,
        0
      );

      // Scale pulse for lights
      const scale = o.type === 'light' ? (0.05 + Math.sin(time * 3 + o.id) * 0.02) : (o.type === 'gift' ? 0.4 : 0.15);
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();

      if (o.type === 'ball' && meshRefBalls.current) {
        meshRefBalls.current.setMatrixAt(ballIdx++, dummy.matrix);
        meshRefBalls.current.setColorAt(ballIdx - 1, new THREE.Color(o.color));
      } else if (o.type === 'gift' && meshRefGifts.current) {
        meshRefGifts.current.setMatrixAt(giftIdx++, dummy.matrix);
        meshRefGifts.current.setColorAt(giftIdx - 1, new THREE.Color(o.color));
      } else if (o.type === 'light' && meshRefLights.current) {
        meshRefLights.current.setMatrixAt(lightIdx++, dummy.matrix);
        meshRefLights.current.setColorAt(lightIdx - 1, new THREE.Color(LUXURY_PALETTE.GOLD));
      }
    });

    if (meshRefBalls.current) {
        meshRefBalls.current.instanceMatrix.needsUpdate = true;
        if (meshRefBalls.current.instanceColor) meshRefBalls.current.instanceColor.needsUpdate = true;
    }
    if (meshRefGifts.current) {
        meshRefGifts.current.instanceMatrix.needsUpdate = true;
        if (meshRefGifts.current.instanceColor) meshRefGifts.current.instanceColor.needsUpdate = true;
    }
    if (meshRefLights.current) {
        meshRefLights.current.instanceMatrix.needsUpdate = true;
        if (meshRefLights.current.instanceColor) meshRefLights.current.instanceColor.needsUpdate = true;
    }
  });

  const ballCount = ornaments.filter(o => o.type === 'ball').length;
  const giftCount = ornaments.filter(o => o.type === 'gift').length;
  const lightCount = ornaments.filter(o => o.type === 'light').length;

  return (
    <>
      <instancedMesh ref={meshRefBalls} args={[undefined, undefined, ballCount]} castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} />
      </instancedMesh>
      
      <instancedMesh ref={meshRefGifts} args={[undefined, undefined, giftCount]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial 
            metalness={0.5} 
            roughness={0.2} 
            clearcoat={1} 
            clearcoatRoughness={0.1} 
        />
      </instancedMesh>

      <instancedMesh ref={meshRefLights} args={[undefined, undefined, lightCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial />
      </instancedMesh>
    </>
  );
};

export default Ornaments;
