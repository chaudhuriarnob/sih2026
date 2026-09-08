from flask import Flask, request, jsonify
from ai.nlp_engine import NLPEngine

app = Flask(__name__)

# Initialize the AI engine when the server boots up
ai_engine = NLPEngine()

@app.route('/recommend', methods=['POST'])
def recommend_standard():
    data = request.get_json()
    query = data.get('query', '')
    
    if not query:
        return jsonify({'error': 'Query field is required'}), 400
        
    # Run the AI recommendation logic
    matches = ai_engine.recommend(query)
    return jsonify({'query': query, 'matches': matches})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
