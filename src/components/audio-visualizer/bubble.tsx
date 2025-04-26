'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createBubbleMaterial } from '@/lib/utils/create-bubble-material';

interface BubbleProps {
  volume: number;
}

/**
 * 3D Bubble component that reacts to audio input
 * 
 * @param volume - Audio volume value between 0 and 1
 */
export function Bubble({ volume }: BubbleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  
  // Initialize material
  useEffect(() => {
    if (meshRef.current) {
      materialRef.current = createBubbleMaterial();
      meshRef.current.material = materialRef.current;
    }
  }, []);
  
  // Animation loop
  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Update time uniform
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      
      // Update amplitude based on volume
      const targetAmplitude = 0.2 + volume * 0.8;
      materialRef.current.uniforms.uAmplitude.value += (targetAmplitude - materialRef.current.uniforms.uAmplitude.value) * 0.1;
      
      // Update brightness based on volume
      const targetBrightness = volume * 1.2;
      materialRef.current.uniforms.uBrightness.value += (targetBrightness - materialRef.current.uniforms.uBrightness.value) * 0.1;
      
      // Rotate the bubble slightly
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.001;
        meshRef.current.rotation.x += 0.0005;
        
        // Scale based on volume
        const targetScale = 1 + volume * 0.2;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      }
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 20]} />
    </mesh>
  );
}
