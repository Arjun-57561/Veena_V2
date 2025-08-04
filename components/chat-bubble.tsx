import React from "react";

interface ChatBubbleProps {
  sender: "user" | "assistant";
  text: string;
}

export default function ChatBubble({ sender, text }: ChatBubbleProps) {
  return (
    <div className={sender === "user" ? "text-right" : "text-left"}>
      <span
        className={
          sender === "user"
            ? "inline-block bg-blue-600 text-white px-4 py-2 rounded-2xl shadow"
            : "inline-block bg-gray-700 text-blue-200 px-4 py-2 rounded-2xl shadow ml-6"
        }
      >
        {text}
      </span>
    </div>
  );
}
