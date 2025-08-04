export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-black p-8 text-white">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Veena</h1>
        <p className="mb-4">
          <b>Veena</b> is a multilingual AI-powered insurance assistant designed to help users with all their insurance-related questions and tasks.<br/>
          It combines cutting-edge language AI (Ollama LLM), advanced voice recognition, and helpful user experience to deliver accurate, friendly, and fast assistance—via both chat and voice.
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Strictly answers only insurance-related queries</li>
          <li>Supports both text and voice input/output</li>
          <li>Speaks your reply in your selected language</li>
          <li>Privacy focused: your data is never shared outside your device</li>
          <li>Powered by <b>Next.js</b>, <b>Flask</b>, and <b>Ollama</b> LLM (llama3.2:latest)</li>
        </ul>
        <p>
          Whether you need information on claims, renewals, or policy details, Veena is always ready to help—just chat or speak!
        </p>
      </section>
    </main>
  );
}
