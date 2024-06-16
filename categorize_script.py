import sys
import pickle
from textblob import TextBlob
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline

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
input_lemmas = split_into_lemmas(input_value)

# Predict using the model
result = model.predict([input_lemmas])[0]
print(result)
