import Link from 'next/link';
import AudioBubbleWrapper from '@/components/audio-visualizer/client-wrapper';

export default function VisualizerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="p-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          ← Back to Home
        </Link>
        <h1 className="text-2xl font-bold">Audio Visualizer</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full h-[600px] rounded-lg overflow-hidden shadow-2xl">
          <AudioBubbleWrapper />
        </div>

        <div className="mt-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">How it works</h2>
          <p className="text-gray-300">
            This visualizer creates a reactive WebGL bubble that responds to your microphone input.
            The bubble will pulse, change shape, and glow based on the volume and frequency of the sounds it detects.
          </p>
          <p className="mt-4 text-gray-400">
            Click the button below the bubble to start or stop the microphone.
          </p>
        </div>
      </main>
    </div>
  );
}
