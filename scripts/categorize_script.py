import sys
import pickle
import json
from textblob import TextBlob
import time
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import keras
import nltk
import tensorflow as tf

start_time = time.time()

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

def vectorize_text(text):
    text = tf.expand_dims(text, -1)
    return vectorize_layer(text)

def split_into_lemmas(content):
    # Convert to lowercase
    content = content.lower()
    # Tokenize and lemmatize
    words = TextBlob(content).words
    return ' '.join([word.lemmatize() for word in words])


# Get params
input_value = [sys.argv[1]]
model_input = sys.argv[2]
if (model_input != "nn"):
    input_value = [split_into_lemmas(content) for content in input_value]
    with open("models/count_vectorizer.pkl", 'rb') as f:
        count_vectorizer = pickle.load(f)
    with open("models/tfidf_transformer.pkl", 'rb') as f:
        tfidf_transformer = pickle.load(f)
    
# Set model
if model_input == "svm":
    modelFile = "models/full_svm.pkl"
elif model_input == "nb":
    modelFile = "models/full_nb.pkl"
elif model_input == "rf":
    modelFile = "models/full_random_forest.pkl"
elif model_input == "nn":
    modelFile = "models/nn.keras"  
    with open('models/vocab.txt', 'r', encoding='utf-8') as f:
        vocab = [line.strip() for line in f]
    vectorize_layer = keras.layers.TextVectorization(max_tokens=20000, output_mode="int", output_sequence_length=500, vocabulary=vocab)

if model_input in ["nb", "rf"]:
    input_count = count_vectorizer.transform(input_value)
    input_tfidf = tfidf_transformer.transform(input_count)
    input_value = input_tfidf

# Predict using the model
if model_input == "nn":
    model = keras.models.load_model(modelFile)
    vectorized_article = vectorize_text(input_value)
    prediction = model.predict(vectorized_article, verbose=0)
    result = round(prediction[0][0])
    probability = (1 - prediction[0][0])
else:
    with open(modelFile, 'rb') as f:
        model = pickle.load(f)
    result = model.predict(input_value)[0]
    probabilities = model.predict_proba(input_value)[0]

    result = int(result)
    probabilities = probabilities.tolist()
    probability = [round(prob, 5) for prob in probabilities][0]

end_time = time.time()
latency = end_time - start_time
output = {
    'model': model_input,
    'prediction': result,
    'probabilities': probability,
    'latency': latency
}
print(json.dumps(output))