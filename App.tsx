
import React, { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import Experience from './components/Experience';
import Overlay from './components/Overlay';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.FORMED);

  const toggleState = useCallback(() => {
    setTreeState(prev => prev === TreeState.CHAOS ? TreeState.FORMED : TreeState.CHAOS);
  }, []);

  return (
    <div className="w-full h-screen relative bg-[#010a08]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 4, 12]} fov={45} />
        
        <color attach="background" args={['#010a08']} />
        
        <Suspense fallback={null}>
          <Experience state={treeState} />
          <Environment preset="night" />
          
          <ambientLight intensity={0.4} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={2} 
            castShadow 
            color="#ffd700"
          />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#043927" />
        </Suspense>

        <ContactShadows 
          opacity={0.4} 
          scale={20} 
          blur={2.4} 
          far={10} 
          resolution={256} 
          color="#000000" 
        />

        <OrbitControls 
          enablePan={false}
          minDistance={5}
          maxDistance={25}
          autoRotate={treeState === TreeState.FORMED}
          autoRotateSpeed={0.5}
        />

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.8} 
            mipmapBlur 
            intensity={1.2} 
            radius={0.4}
          />
          <Noise opacity={0.03} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          <ChromaticAberration offset={[0.0005, 0.0005]} />
        </EffectComposer>
      </Canvas>

      <Overlay state={treeState} onToggle={toggleState} />
    </div>
  );
};

export default App;
