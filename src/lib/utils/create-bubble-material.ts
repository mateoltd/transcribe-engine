import * as THREE from 'three';
import { vertexShader } from '@/components/audio-visualizer/shaders/bubble-vertex.glsl';
import { fragmentShader } from '@/components/audio-visualizer/shaders/bubble-fragment.glsl';

/**
 * Creates a custom shader material for the audio reactive bubble
 * 
 * @returns THREE.ShaderMaterial configured for the bubble effect
 */
export function createBubbleMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uAmplitude: { value: 0.2 },
      uFrequency: { value: 1.0 },
      uColor: { value: new THREE.Color(0x0066ff) },
      uBrightness: { value: 0.0 }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  });
}
