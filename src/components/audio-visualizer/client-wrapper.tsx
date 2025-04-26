'use client';

import dynamic from 'next/dynamic';

// Dynamically import the AudioVisualizer component with no SSR
const AudioVisualizer = dynamic(
  () => import('./audio-visualizer'),
  { ssr: false }
);

/**
 * Client component wrapper for the AudioVisualizer
 * This allows us to use dynamic import with ssr: false in a client component
 */
export default function AudioBubbleWrapper() {
  return <AudioVisualizer />;
}
