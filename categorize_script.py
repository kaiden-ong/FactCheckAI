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

# Load the model
with open('eight_svm.pkl', 'rb') as f:
    model = pickle.load(f)

# Assuming the input is passed as the first argument
input_value = sys.argv[1]
# input_value = "Based on the number of supporters Trump is drawing at his Florida rallies, it might be a good time for Rubio to jump on the Trump Train Marco Rubio won the Republican nomination for a second Senate term Tuesday night, a reversal of fortune after Florida GOP voters dealt a fatal blow to his presidential ambitions in a primary earlier this year.With the Senate on the line, Republicans convinced the Florida lawmaker to seek re-election rather than retiring after only a single term. Rubio had planned to either be in the White House or the private sector next year. Winning his primary is the first step in extending his stay on Capitol Hill instead.The primary field mostly cleared for Rubio when he decided to give it another go. The sole holdout among name candidates was builder Carlos Beruff. Rubio mostly ignored his primary opponent, refusing to debate him. Via: Washington ExaminerMeanwhile, Rubio says he ll  consider  campaigning with Trump:Sen. Marco Rubio says he's open to campaigning alongside Donald Trump, @mkraju reports https://t.co/JKoUjl9QdP https://t.co/eU5xyYHN39  CNN Politics (@CNNPolitics) August 30, 2016"
input_lemmas = split_into_lemmas(input_value)

# Predict using the model
# result = model.predict([input_lemmas])[0]
# print(result)

# for testing:


# Predict using the model
result = model.predict([input_lemmas])[0]
probabilities = model.predict_proba([input_lemmas])[0]

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