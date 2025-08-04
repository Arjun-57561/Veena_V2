import os
import uuid
import re
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from gtts import gTTS
import subprocess

# --- Paths
AUDIO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../audio_files"))
os.makedirs(AUDIO_DIR, exist_ok=True)

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "veena-dev-secret")
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# --- Insurance Keyword Filter
EXPERT_INTENT_KEYWORDS = [
    'insurance', 'policy', 'claim', 'premium', 'renewal', 'coverage', 'benefit',
    'customer', 'agent', 'payment', 'terms', 'conditions', 'document', 'status',
    'health', 'auto', 'car', 'home', 'life', 'accident', 'travel'
]

def is_insurance_query(text: str) -> bool:
    text = text.lower()
    for kw in EXPERT_INTENT_KEYWORDS:
        if re.search(r'\b' + re.escape(kw) + r'\b', text):
            return True
    return False

def call_ollama_llm(prompt, model="llama3.2:latest", system_msg=None, timeout=60):
    system_prompt = system_msg or (
        "You are Veena, an AI assistant specialized strictly in insurance domain. "
        "Answer ONLY insurance related questions politely. If the question is off-topic, kindly respond you cannot answer."
    )
    full_prompt = f"{system_prompt}\n\nUser: {prompt}\nAssistant:"
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
            print(f"Ollama error: {err}")
            return "I'm sorry, I can only answer insurance-related questions."
        return out.strip()
    except Exception as e:
        print(f"LLM call exception: {e}")
        return "Sorry, I'm experiencing technical difficulties."

@app.route("/health")
def health():
    return jsonify({"status": "ok", "timestamp": datetime.utcnow().isoformat()}), 200

@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    data = request.json
    user_input = (data.get('input') or '').strip()
    user_lang = data.get('language', 'en')

    if not is_insurance_query(user_input):
        return jsonify({
            'response': "I'm specialized in insurance-related questions only. Please ask insurance-related queries."
        })

    ai_response = call_ollama_llm(user_input, model="llama3.2:latest")

    # Generate TTS audio
    fname = f"voice_{uuid.uuid4().hex}.mp3"
    fpath = os.path.join(AUDIO_DIR, fname)
    try:
        tts = gTTS(text=ai_response, lang=user_lang if user_lang in ['en','hi','mr','gu','ta','te','bn','kn'] else 'en')
        tts.save(fpath)
    except Exception as e:
        print(f"TTS generation failed: {e}")
        fname = None

    return jsonify({
        'response': ai_response,
        'audio_url': f'/api/audio/{fname}' if fname else None,
        'customer_data': {},
        'entities': {},
        'conversation_history': []
    })

@app.route("/api/audio/<filename>")
def serve_audio(filename):
    safe_dir = os.path.abspath(AUDIO_DIR)
    safe_file = os.path.join(safe_dir, filename)
    if not safe_file.startswith(safe_dir) or not os.path.exists(safe_file):
        return jsonify({"error": "Not found"}), 404
    return send_file(safe_file, mimetype='audio/mpeg')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
