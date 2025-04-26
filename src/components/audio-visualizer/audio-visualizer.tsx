'use client';

import { useState, useEffect } from 'react';
import { useAudioAnalyzer } from '@/hooks/use-audio-analyzer';
import { Scene } from './scene';

/**
 * Enhanced AudioVisualizer component with improved UI and responsiveness
 */
export default function AudioVisualizer() {
  const { volume, isRecording, startRecording, stopRecording } = useAudioAnalyzer();
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [volumeLevel, setVolumeLevel] = useState<string>('silent');

  // Update volume level indicator
  useEffect(() => {
    if (!isRecording) {
      setVolumeLevel('silent');
      return;
    }

    if (volume > 0.6) {
      setVolumeLevel('high');
    } else if (volume > 0.3) {
      setVolumeLevel('medium');
    } else if (volume > 0.1) {
      setVolumeLevel('low');
    } else {
      setVolumeLevel('silent');
    }
  }, [volume, isRecording]);

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

  // Get volume indicator classes
  const getVolumeIndicatorClasses = (level: string) => {
    const baseClasses = "w-1 h-8 rounded-full mx-0.5 transition-all duration-200";

    switch (level) {
      case 'high':
        return `${baseClasses} bg-blue-500 scale-y-100`;
      case 'medium':
        return `${baseClasses} bg-blue-400 scale-y-75`;
      case 'low':
        return `${baseClasses} bg-blue-300 scale-y-50`;
      default:
        return `${baseClasses} bg-gray-700 scale-y-25`;
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-50">
      {/* 3D Scene */}
      <Scene volume={volume || 0} />

      {/* UI Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
        {/* Volume indicator */}
        {isRecording && (
          <div className="flex items-end justify-center mb-4 h-10">
            <div className={getVolumeIndicatorClasses(volumeLevel === 'low' ? 'low' : 'silent')}></div>
            <div className={getVolumeIndicatorClasses(volumeLevel === 'medium' ? 'medium' : (volumeLevel === 'high' ? 'low' : 'silent'))}></div>
            <div className={getVolumeIndicatorClasses(volumeLevel === 'high' ? 'high' : 'silent')}></div>
            <div className={getVolumeIndicatorClasses(volumeLevel === 'medium' ? 'medium' : (volumeLevel === 'high' ? 'low' : 'silent'))}></div>
            <div className={getVolumeIndicatorClasses(volumeLevel === 'low' ? 'low' : 'silent')}></div>
          </div>
        )}

        {/* Microphone button with enhanced styling */}
        <button
          onClick={toggleRecording}
          className={`px-6 py-3 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
              : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/20'
          }`}
        >
          {/* Microphone icon */}
          <svg
            className={`w-5 h-5 mr-2 transition-all duration-300 ${isRecording ? 'text-red-400 animate-pulse' : 'text-white'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
              clipRule="evenodd"
            />
          </svg>
          {isRecording ? 'Stop Microphone' : 'Start Microphone'}
        </button>

        {/* Permission denied message */}
        {permissionGranted === false && (
          <div className="mt-3 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm text-center">
              Microphone access denied. Please allow microphone access.
            </p>
          </div>
        )}

        {/* Usage hint */}
        {!isRecording && permissionGranted !== false && (
          <p className="mt-3 text-blue-300/70 text-sm">
            Click to start and speak or play sounds to see the bubble react
          </p>
        )}
      </div>
    </div>
  );
}
