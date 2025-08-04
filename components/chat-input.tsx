import React, { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
        placeholder="Type your message..."
        className="flex-grow rounded px-3 py-2 bg-slate-800 text-white border border-slate-600"
      />
      <button
        type="submit"
        disabled={disabled}
        className="px-4 py-2 bg-blue-600 rounded disabled:bg-blue-400"
      >
        Send
      </button>
    </form>
  );
}
