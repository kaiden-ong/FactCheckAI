import sys
import pickle
import json
from textblob import TextBlob
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
import time

start_time = time.time()

def split_into_lemmas(content):
    # Convert to lowercase
    content = content.lower()
    # Tokenize and lemmatize
    words = TextBlob(content).words
    return ' '.join([word.lemmatize() for word in words])

# Get params
input_value = sys.argv[1]
model_input = sys.argv[2]
input_value = split_into_lemmas(input_value)
# Set model
if model_input == "svm":
    modelFile = "models/full_svm.pkl"
    input_value = [input_value]
elif model_input == "nb":
    modelFile = "models/full_nb.pkl"
    with open("models/count_vectorizer.pkl", 'rb') as f:
        count_vectorizer = pickle.load(f)
    with open("models/tfidf_transformer.pkl", 'rb') as f:
        tfidf_transformer = pickle.load(f)
    input_count = count_vectorizer.transform([input_value])
    input_tfidf = tfidf_transformer.transform(input_count)
    input_value = input_tfidf
elif model_input == "dt":
    modelFile = "models/full_dt.pkl"

# Load the model
with open(modelFile, 'rb') as f:
    model = pickle.load(f)

# Predict using the model
result = model.predict(input_value)[0]
probabilities = model.predict_proba(input_value)[0]

end_time = time.time()
latency = end_time - start_time

# Convert numpy types to native Python types
result = int(result)
probabilities = probabilities.tolist()
probabilities = [float(f"{prob:.5f}") for prob in probabilities]
latency = float(f"{latency:.3f}")

output = {
    'prediction': result,
    'probabilities': probabilities[0],
    'latency': latency
}

# Print the output as JSON
print(json.dumps(output))