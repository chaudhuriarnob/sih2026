from flask import Flask, render_template, request, jsonify
from ai.nlp_engine import NLPEngine

app = Flask(__name__)
ai_engine = NLPEngine()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend_standard():
    data = request.get_json()
    query = data.get('query', '')

    if not query:
        return jsonify({'error': 'Query field is required'}), 400

    matches = ai_engine.recommend(query)
    return jsonify({'query': query, 'matches': matches})

if __name__ == '__main__':
    app.run(debug=True, port=5000)