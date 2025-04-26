'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import {
  EffectComposer,
  Bloom
} from '@react-three/postprocessing';
import { Bubble } from './bubble';

interface SceneProps {
  volume: number;
}

/**
 * Enhanced 3D Scene component with post-processing effects
 *
 * @param volume - Audio volume value between 0 and 1
 */
export function Scene({ volume }: SceneProps) {
  // Dynamic bloom intensity based on volume
  const bloomConfig = useMemo(() => {
    return {
      intensity: 0.6,
      luminanceThreshold: 0.2,
      luminanceSmoothing: 0.9,
      mipmapBlur: true
    };
  }, []);

  // No additional effects needed

  return (
    <Canvas dpr={[1, 2]} linear>
      <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={100} />

      {/* Deep black background for better contrast */}
      <color attach="background" args={['#000000']} />

      {/* Enhanced lighting setup for better visual depth */}
      <ambientLight intensity={0.15} /> {/* Reduced ambient for deeper shadows */}
      <pointLight position={[10, 10, 10]} intensity={0.4} color="#ffffff" />
      <pointLight position={[-8, -5, -10]} intensity={0.4} color="#0055ff" /> {/* Blue rim light (Increased) */}
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#4080ff" /> {/* Front fill light */}

      {/* Main bubble component */}
      <Suspense fallback={null}>
        <Bubble volume={volume || 0} />
      </Suspense>

      {/* Camera controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />

      {/* Post-processing effects */}
      <EffectComposer>
        {/* Bloom effect for the glow */}
        <Bloom
          intensity={bloomConfig.intensity}
          luminanceThreshold={bloomConfig.luminanceThreshold}
          luminanceSmoothing={bloomConfig.luminanceSmoothing}
          mipmapBlur={bloomConfig.mipmapBlur}
        />
      </EffectComposer>
    </Canvas>
  );
}
