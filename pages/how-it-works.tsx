export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-black p-8 text-white">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">How Veena Works</h1>
        <ol className="mb-6 list-decimal list-inside space-y-3">
          <li>
            <b>Ask Your Question</b><br />
            Enter your insurance query either by typing in the chat box or by using the microphone button to speak.
          </li>
          <li>
            <b>AI Processing</b><br />
            Veena’s AI, powered by the local Llama 3.2 model (through Ollama), interprets your question. If it's not insurance related, you'll be asked to stick to insurance topics.
          </li>
          <li>
            <b>Get Your Answer</b><br />
            Veena responds in the chat bubble with a clear answer. If you’re using voice, the reply will also be spoken aloud in your selected language.
          </li>
          <li>
            <b>All Data is Private</b><br />
            Everything runs locally on your computer—your questions and answers are never sent to the cloud.
          </li>
        </ol>
        <p>
          <b>Supported features:</b> policy info, claims, renewal, premium calculation, insurance FAQs, and more.{" "}
          <br />
          <b>Not supported:</b> general chit-chat, non-insurance questions, or topics outside the insurance domain (as per strict model instructions).
        </p>
      </section>
    </main>
  );
}
