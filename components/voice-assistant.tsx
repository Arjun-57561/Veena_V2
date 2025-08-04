"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";
import API_CONFIG from "@/services/apiConfig";
import LanguageSelector from "./language-selector";
import EntityPanel from "./entity-panel";

// For Types
interface ChatMsg {
  type: "user" | "assistant";
  text: string;
  ts: string;
}

export default function VoiceAssistant() {
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- Microphone/Speech Recognition setup ---
  const recognitionRef = useRef<any>(null);
  useEffect(() => {
    // Only run in browser and with SpeechRecognition supported
    if (typeof window === "undefined" || (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window))) {
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = API_CONFIG.TTS_LANG_MAP[language] + "-IN" || "en-US";

    recognitionRef.current.onresult = (event: any) => {
      let final = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setCurrentTranscript(final || interim);
      if (final) {
        submitUserMessage(final);
      }
    };
    recognitionRef.current.onend = () => {
      if (isListening) recognitionRef.current.start();
    };

    return () => recognitionRef.current && recognitionRef.current.abort();
  }, [language, isListening]);

  // Handle voice button click
  const handleVoiceButton = () => {
    if (!isListening) {
      setCurrentTranscript("");
      setIsListening(true);
      recognitionRef.current?.start();
    } else {
      setIsListening(false);
      recognitionRef.current?.stop();
    }
  };

  // --- General chat send function (both voice and text input) ---
  async function submitUserMessage(text: string) {
    setChatHistory(prev => [...prev, { type: "user", text, ts: new Date().toISOString() }]);
    setIsProcessing(true);
    setIsListening(false);
    if (recognitionRef.current) recognitionRef.current.abort();
    setCurrentTranscript("");
    try {
      const resp = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CHAT), {
        method: "POST",
        headers: API_CONFIG.HEADERS,
        credentials: API_CONFIG.CREDENTIALS,
        body: JSON.stringify({ input: text, language }),
      });
      const data = await resp.json();
      setChatHistory(prev => [
        ...prev,
        { type: "assistant", text: data.response, ts: new Date().toISOString() }
      ]);
      setAudioUrl(data.audio_url || null);
      // Optionally play audio
      if (data.audio_url && audioRef.current) {
        audioRef.current.src = data.audio_url;
        audioRef.current.play();
      }
    } catch (e) {
      setChatHistory(prev => [
        ...prev,
        { type: "assistant", text: "Sorry, there was a connection error.", ts: new Date().toISOString() }
      ]);
    }
    setIsProcessing(false);
  }

  // --- ChatBar: handles text input send ---
  function ChatBar() {
    const [input, setInput] = useState("");
    return (
      <form
        className="flex mt-4"
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            submitUserMessage(input);
            setInput("");
          }
        }}
      >
        <input
          className="flex-1 p-2 rounded-l border border-slate-700 bg-slate-800 text-white outline-none"
          disabled={isProcessing}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button type="submit" className="rounded-l-none" disabled={isProcessing}>
          Send
        </Button>
      </form>
    );
  }

  return (
    <Card className="p-6 bg-slate-900 max-w-2xl mx-auto">
      <audio ref={audioRef} hidden />
      {/* --- Chat bubbles --- */}
      <div className="space-y-3 min-h-[24rem] mb-4">
        {chatHistory.map((msg, idx) => (
          <div key={msg.ts + idx} className={msg.type === "user" ? "text-right" : "text-left"}>
            <span
              className={
                msg.type === "user"
                  ? "inline-block bg-blue-800 text-white px-4 py-2 rounded-2xl shadow"
                  : "inline-block bg-slate-800 text-blue-100 px-4 py-2 rounded-2xl shadow ml-6"
              }
            >
              {msg.text}
            </span>
          </div>
        ))}
        {isListening && (
          <div className="text-right">
            <span className="inline-block bg-blue-400/50 text-white px-4 py-2 rounded-2xl animate-pulse">
              {currentTranscript || "Listening..."}
            </span>
          </div>
        )}
      </div>
      {/* --- Chat input bar --- */}
      <ChatBar />
      {/* --- Voice mic button and controls --- */}
      <div className="flex items-center space-x-4 mt-4">
        <Button
          size="lg"
          onClick={handleVoiceButton}
          className="rounded-full"
          disabled={isProcessing}
        >
          {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </Button>
        <LanguageSelector value={language} onValueChange={setLanguage} />
      </div>

      {/* Extra: Could include <EntityPanel ... /> below if you wish */}
    </Card>
  );
}
