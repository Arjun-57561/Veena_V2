import React from "react";

interface TranscriptDisplayProps {
  transcript: string;
  response: string;
  isProcessing: boolean;
  conversationHistory: { user: string; assistant: string; timestamp: string }[];
}

export default function TranscriptDisplay({
  transcript,
  response,
  isProcessing,
  conversationHistory,
}: TranscriptDisplayProps) {
  return (
    <div className="max-w-xl mx-auto p-4 bg-slate-900 rounded shadow mt-8">
      <h3 className="font-semibold text-lg mb-2">Conversation Transcript</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {conversationHistory.length > 0 ? (
          conversationHistory.map(({ user, assistant, timestamp }, idx) => (
            <div key={idx} className="space-y-1">
              <div>
                <strong>User:</strong> {user}
              </div>
              <div>
                <strong>Veena:</strong> {assistant}
              </div>
              <div className="text-xs text-slate-400">{timestamp}</div>
            </div>
          ))
        ) : (
          <div className="italic text-slate-400">No conversation yet</div>
        )}
        {isProcessing && (
          <div className="text-blue-400 italic">Processing...</div>
        )}
        {transcript && (
          <div className="text-green-400 italic">Last spoken: {transcript}</div>
        )}
        {response && (
          <div className="text-yellow-400 italic">Last response: {response}</div>
        )}
      </div>
    </div>
  );
}
