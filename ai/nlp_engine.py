import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

class NLPEngine:
    def __init__(self, data_path='data/standard.csv'):
        if not os.path.exists(data_path):
            data_path = '../data/standard.csv'

        self.df = pd.read_csv(data_path)
        self.df['combined_text'] = self.df.astype(str).agg(' '.join, axis=1)

        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df['combined_text'])

    def recommend(self, query, top_n=3):
        query_vec = self.vectorizer.transform([query])
        similarity_scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        top_indices = similarity_scores.argsort()[::-1][:top_n]

        results = []
        for idx in top_indices:
            results.append({
                "id": int(idx),
                "score": round(float(similarity_scores[idx]), 4),
                "details": self.df.iloc[idx].to_dict()
            })
        return results