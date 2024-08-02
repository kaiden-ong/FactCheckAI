import sys
import pickle
import json
from textblob import TextBlob
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
import time
import numpy as np
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf
from urllib.parse import quote
import warnings

start_time = time.time()

def split_into_lemmas(content):
    # Convert to lowercase
    content = content.lower()
    # Tokenize and lemmatize
    words = TextBlob(content).words
    return ' '.join([word.lemmatize() for word in words])


# Get params
input_value = [sys.argv[1]]
model_input = sys.argv[2]
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
     modelFile = "models/neural_network.h5"

if model_input in ["nb", "rf"]:
    input_count = count_vectorizer.transform(input_value)
    input_tfidf = tfidf_transformer.transform(input_count)
    input_value = input_tfidf

# Predict using the model
if model_input == "nn":
    model = tf.keras.models.load_model(modelFile, custom_objects={'TextVectorization': tf.keras.layers.TextVectorization})
    X_test = np.load('models/X_test.npy')
    y_test = np.load('models/y_test.npy')
    test_ds = tf.data.Dataset.from_tensor_slices((X_test, y_test)).batch(32)
    model.compile(
        loss="binary_crossentropy", optimizer="adam", metrics=["accuracy"]
    )
    model.evaluate(test_ds)
    string = tf.convert_to_tensor([input_value])
    model_result = model.predict(string)
    result = round(model_result[0].item())
    probability = model_result[0].tolist()
    end_time = time.time()
    latency = end_time - start_time
    output = {
        'model': model_input,
        'prediction': result,
        'probabilities': probability,
        'latency': latency
    }
    print(json.dumps(output))
else:
    with open(modelFile, 'rb') as f:
        model = pickle.load(f)
    result = model.predict(input_value)[0]
    probabilities = model.predict_proba(input_value)[0]

    end_time = time.time()
    latency = end_time - start_time

    # Convert numpy types to native Python types
    result = int(result)
    probabilities = probabilities.tolist()
    probabilities = [round(prob, 5) for prob in probabilities]
    latency = round(latency, 3)

    output = {
        'model' : model_input,
        'prediction': result,
        'probabilities': probabilities[0],
        'latency': latency
    }
    # output = { "model": 'svm', "prediction": 0, "probabilities": 1, "latency": 1.112 }

    # Print the output as JSON
    print(json.dumps(output))