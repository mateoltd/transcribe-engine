'use client';

import { useState } from 'react';
import { useAudioAnalyzer } from '@/hooks/use-audio-analyzer';
import { Scene } from './scene';

/**
 * Main AudioVisualizer component that handles microphone access and visualization
 */
export default function AudioVisualizer() {
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
      <Scene volume={volume || 0} />
      
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
