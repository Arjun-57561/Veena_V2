import os
import json
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, session, send_file
from flask_cors import CORS
from gtts import gTTS
import subprocess

# --- PATHS ---
AUDIO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../audio_files"))
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "./data"))
os.makedirs(AUDIO_DIR, exist_ok=True)

# --- FLASK ---
app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "veena-dev-secret")
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# --- OLLAMA CALL ---
def call_ollama_llm(prompt, model="llama3.2:latest", system_msg=None, timeout=60):
    system = system_msg or "You are Veena, a smart multilingual insurance assistant. Be friendly and helpful."
    full_prompt = f"{system}\n\nUser: {prompt}\nAssistant:"
    try:
        proc = subprocess.Popen(
            ["ollama", "run", model],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            encoding="utf-8",
            errors="replace"
        )
        out, err = proc.communicate(input=full_prompt, timeout=timeout)
        if proc.returncode != 0:
            print("Ollama error:", err)
            return "Sorry, I'm having technical difficulties. Please try again."
        return out.strip()
    except Exception as e:
        print("Ollama/LLM error:", e)
        return "Sorry, my AI brain is having trouble right now."

# --- API ENDPOINTS ---
@app.route("/health")
def health():
    return jsonify({"status": "ok", "timestamp": datetime.utcnow().isoformat()}), 200

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = (data.get("input") or "").strip()
    user_lang = data.get("language", "en")

    # --- Call LLAMA LLM! ---
    veena_reply = call_ollama_llm(user_input, system_msg=None)

    # --- TTS synth to audio_files ---
    fname = f"voice_{uuid.uuid4().hex}.mp3"
    fpath = os.path.join(AUDIO_DIR, fname)
    tts = gTTS(text=veena_reply, lang=user_lang if user_lang in ['en','hi','mr','gu','ta','te','bn','kn'] else 'en')
    tts.save(fpath)

    # (Basic entity/customer logic for demo)
    customer_data = {}
    entities = {}

    return jsonify({
        "response": veena_reply,
        "audio_url": f"/api/audio/{fname}",
        "customer_data": customer_data,
        "entities": entities,
        "conversation_history": []
    })

@app.route("/api/audio/<filename>")
def serve_audio(filename):
    audio_path = os.path.join(AUDIO_DIR, filename)
    if not os.path.exists(audio_path):
        return jsonify({"error": "Not found"}), 404
    return send_file(audio_path, mimetype="audio/mpeg")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
