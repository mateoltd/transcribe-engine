import { useEffect, useState, useRef } from 'react';

interface AudioAnalyzerHook {
  audioData: Uint8Array | null;
  volume: number;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

/**
 * Hook for analyzing audio input from the microphone
 * 
 * @returns Object containing audio data, volume, recording state, and control functions
 */
export function useAudioAnalyzer(): AudioAnalyzerHook {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [volume, setVolume] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(newAudioContext);
      
      const newAnalyzer = newAudioContext.createAnalyser();
      newAnalyzer.fftSize = 1024;
      newAnalyzer.smoothingTimeConstant = 0.8;
      setAnalyzer(newAnalyzer);
      
      const bufferLength = newAnalyzer.frequencyBinCount;
      setAudioData(new Uint8Array(bufferLength));
      
      return () => {
        if (newAudioContext.state !== 'closed') {
          newAudioContext.close();
        }
      };
    }
  }, []);

  // Function to start recording
  const startRecording = async () => {
    if (!audioContext || !analyzer) return;
    
    try {
      // Resume audio context if it's suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      // Connect the microphone to the analyzer
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzer);
      
      setIsRecording(true);
      
      // Start analyzing audio data
      const analyzeAudio = () => {
        if (!analyzer || !audioData) return;
        
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);
        analyzer.getByteFrequencyData(dataArray);
        setAudioData(dataArray);
        
        // Calculate volume (average of frequency data)
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setVolume(average / 255); // Normalize to 0-1
        
        animationFrameRef.current = requestAnimationFrame(analyzeAudio);
      };
      
      analyzeAudio();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    setIsRecording(false);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [audioContext]);

  return {
    audioData,
    volume,
    isRecording,
    startRecording,
    stopRecording
  };
}
