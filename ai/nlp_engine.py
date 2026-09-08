import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

class NLPEngine:
    def __init__(self, data_path='data/standard.csv'):
        # Check if the dataset exists based on the exact VS Code structure
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Cannot find {data_path}. Ensure you run this from the main sih2026 folder.")
            
        # Load the dataset
        self.df = pd.read_csv(data_path)
        
        # Combine title and description for a richer search context
        self.df['search_text'] = self.df['title'].fillna('') + " " + self.df['description'].fillna('')
        
        # Initialize the math model, ignoring common filler words like 'the' or 'and'
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df['search_text'])

    def recommend(self, user_text):
        # Convert user input into a numerical vector
        user_vec = self.vectorizer.transform([user_text])
        
        # Calculate the geometric angle (similarity) between user input and all standards
        scores = cosine_similarity(user_vec, self.tfidf_matrix).flatten()
        
        # Grab the top 3 highest scoring matches
        top_indices = scores.argsort()[-3:][::-1]
        
        results = []
        for idx in top_indices:
            score = scores[idx]
            # Only return results with a match score higher than 10% to reject garbage inputs
            if score > 0.1:  
                results.append({
                    'id': int(self.df.iloc[idx]['standard_id']),
                    'score': round(float(score) * 100, 2)
                })
        return results

# Quick test to prove it works before handing off to Arnob
if __name__ == '__main__':
    engine = NLPEngine()
    print("Test 1 (Valid Query): 'PVC insulated electrical cable'")
    print(engine.recommend('PVC insulated electrical cable for 1100 V'))
    
    print("\nTest 2 (Garbage Query): 'I want to order a pizza'")
    print(engine.recommend('I want to order a pizza'))
