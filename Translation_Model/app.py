from flask import Flask, render_template, request, jsonify
from transformers import MarianMTModel, MarianTokenizer

app = Flask(__name__)

# Define available language pairs and their respective models
LANGUAGE_MODELS = {
    ("en", "fr"): "Helsinki-NLP/opus-mt-en-fr",
    ("fr", "en"): "Helsinki-NLP/opus-mt-fr-en",
    ("en", "de"): "Helsinki-NLP/opus-mt-en-de",
    ("de", "en"): "Helsinki-NLP/opus-mt-de-en",
    ("en", "es"): "Helsinki-NLP/opus-mt-en-es",
    ("es", "en"): "Helsinki-NLP/opus-mt-es-en",
    ("fr", "de"): "Helsinki-NLP/opus-mt-fr-de",
    ("de", "fr"): "Helsinki-NLP/opus-mt-de-fr",
    ("fr", "es"): "Helsinki-NLP/opus-mt-fr-es",
    ("es", "fr"): "Helsinki-NLP/opus-mt-es-fr",
    ("de", "es"): "Helsinki-NLP/opus-mt-de-es",
    ("es", "de"): "Helsinki-NLP/opus-mt-es-de",
}

def load_translation_model(src_lang, tgt_lang):
    """Dynamically load the correct MarianMT model based on source and target language."""
    model_name = LANGUAGE_MODELS.get((src_lang, tgt_lang))
    if not model_name:
        return None, None  # Return None if the language pair is not supported

    model = MarianMTModel.from_pretrained(model_name)
    tokenizer = MarianTokenizer.from_pretrained(model_name)
    return model, tokenizer

@app.route('/')
def home():
    return render_template('index.html')  # Serve the frontend

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()
    text = data.get('text')
    src_lang = data.get('src_lang')
    tgt_lang = data.get('tgt_lang')

    # Load the correct model for the given language pair
    model, tokenizer = load_translation_model(src_lang, tgt_lang)

    if model is None or tokenizer is None:
        return jsonify({"translated_text": "Translation not available for this language pair."}), 400

    # Translate text
    translated_text = translate_text(model, tokenizer, text)

    return jsonify({"translated_text": translated_text})

def translate_text(model, tokenizer, text):
    """Translate the input text using the specified model and tokenizer."""
    tokens = tokenizer(text, return_tensors='pt', padding=True, truncation=True)
    translated_tokens = model.generate(**tokens)
    translated_text = tokenizer.decode(translated_tokens[0], skip_special_tokens=True)
    return translated_text

if __name__ == '__main__':
    app.run(debug=True)
