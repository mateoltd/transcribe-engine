'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createBubbleMaterial } from '@/lib/utils/create-bubble-material';

interface BubbleProps {
  volume: number;
}

/**
 * Enhanced 3D Bubble component that reacts to audio input with improved visuals
 *
 * @param volume - Audio volume value between 0 and 1
 */
export function Bubble({ volume }: BubbleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Initialize materials
  useEffect(() => {
    if (meshRef.current) {
      // Create and apply the main bubble material
      materialRef.current = createBubbleMaterial();
      meshRef.current.material = materialRef.current;

      // Make sure the mesh casts shadows for better visual depth
      if (meshRef.current) {
        meshRef.current.castShadow = true;
        meshRef.current.receiveShadow = true;
      }
    }
  }, []);

  // Animation loop with enhanced effects
  useFrame(({ clock }) => {
    if (materialRef.current) {
      const time = clock.getElapsedTime();

      // Update time uniform with smoother animation
      materialRef.current.uniforms.uTime.value = time;

      // Enhanced amplitude response based on volume
      const baseAmplitude = 0.25; // Higher base amplitude for more pronounced effect
      const volumeInfluence = 1.0; // Increased volume influence
      const targetAmplitude = baseAmplitude + volume * volumeInfluence;

      // Smooth transition for amplitude changes
      materialRef.current.uniforms.uAmplitude.value += (targetAmplitude - materialRef.current.uniforms.uAmplitude.value) * 0.1;

      // Enhanced brightness response with more dynamic range
      const targetBrightness = Math.pow(volume, 1.5) * 1.5; // Non-linear response for more dramatic effect
      materialRef.current.uniforms.uBrightness.value += (targetBrightness - materialRef.current.uniforms.uBrightness.value) * 0.15;

      if (meshRef.current) {
        // More organic rotation with slight variation
        meshRef.current.rotation.y += 0.001 + volume * 0.0005;
        meshRef.current.rotation.x += 0.0005 + volume * 0.0002;
        meshRef.current.rotation.z += 0.0002 * Math.sin(time * 0.2);

        // Enhanced scaling with volume - more responsive
        const pulseEffect = Math.sin(time * 2) * 0.03 * volume; // Add subtle pulsing based on volume
        const targetScale = 1 + volume * 0.3 + pulseEffect;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
      }

      // Update glow mesh if present
      if (glowRef.current) {
        // Scale the glow slightly larger than the main bubble
        const glowScale = (meshRef.current?.scale.x || 1) * 1.15;
        glowRef.current.scale.set(glowScale, glowScale, glowScale);

        // Match rotation with the main bubble
        if (meshRef.current) {
          glowRef.current.rotation.copy(meshRef.current.rotation);
        }
      }
    }
  });

  return (
    <group>
      {/* Main bubble with high-poly geometry for smooth shading */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 24]} /> {/* Increased detail for smoother surface */}
      </mesh>

      {/* Outer glow layer */}
      <mesh ref={glowRef} scale={1.15}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#4080ff"
          transparent={true}
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
