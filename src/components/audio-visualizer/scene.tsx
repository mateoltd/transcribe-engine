'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Bubble } from './bubble';

interface SceneProps {
  volume: number;
}

/**
 * 3D Scene component that contains the bubble and lighting
 * 
 * @param volume - Audio volume value between 0 and 1
 */
export function Scene({ volume }: SceneProps) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#0066ff" />
      <Bubble volume={volume || 0} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
