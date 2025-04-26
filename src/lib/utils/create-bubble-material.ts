import * as THREE from 'three';
import { vertexShader } from '@/components/audio-visualizer/shaders/bubble-vertex.glsl';
import { fragmentShader } from '@/components/audio-visualizer/shaders/bubble-fragment.glsl';

/**
 * Creates a custom shader material for the audio reactive bubble with enhanced visual effects
 *
 * @returns THREE.ShaderMaterial configured for the bubble effect
 */
export function createBubbleMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uAmplitude: { value: 0.25 },  // Increased amplitude for more pronounced deformation
      uFrequency: { value: 0.8 },   // Adjusted frequency for smoother waves
      uColor: { value: new THREE.Color(0x0055ff) }, // Deeper blue base color
      uBrightness: { value: 0.0 }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending, // Use additive blending for better glow effect
    depthWrite: false, // Disable depth writing for proper transparency
  });
}
