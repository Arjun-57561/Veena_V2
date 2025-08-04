import dynamic from "next/dynamic";

const VoiceAssistant = dynamic(() => import('@/components/voice-assistant'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center">Welcome to Veena Insurance Assistant</h1>
        <VoiceAssistant />
      </div>
    </main>
  );
}
