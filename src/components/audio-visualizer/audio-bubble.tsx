'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useAudioAnalyzer } from './use-audio-analyzer';
import { createBubbleMaterial } from './bubble-material';

// Bubble mesh component
function Bubble({ volume }: { volume: number }) {
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

// Background component
function Background() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#0066ff" />
    </>
  );
}

// Main AudioBubble component
export default function AudioBubble() {
  const { volume, isRecording, startRecording, stopRecording } = useAudioAnalyzer();
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  
  // Handle microphone permission
  const handleMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      startRecording();
    } catch (error) {
      console.error('Microphone access denied:', error);
      setPermissionGranted(false);
    }
  };
  
  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (permissionGranted) {
        startRecording();
      } else {
        handleMicrophoneAccess();
      }
    }
  };
  
  return (
    <div className="relative w-full h-full min-h-[500px]">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} />
        <Background />
        <Bubble volume={volume || 0} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={toggleRecording}
          className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {isRecording ? 'Stop Microphone' : 'Start Microphone'}
        </button>
        
        {permissionGranted === false && (
          <p className="text-red-500 mt-2 text-center">
            Microphone access denied. Please allow microphone access.
          </p>
        )}
      </div>
    </div>
  );
}
