'use client';

import dynamic from 'next/dynamic';

// Dynamically import the AudioBubble component with no SSR
// This is necessary because it uses browser APIs that aren't available during server rendering
const AudioBubble = dynamic(
  () => import('./audio-bubble'),
  { ssr: false }
);

export default function AudioBubbleWrapper() {
  return <AudioBubble />;
}
