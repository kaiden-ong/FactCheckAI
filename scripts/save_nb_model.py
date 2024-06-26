import matplotlib.pyplot as plt
import csv
import sklearn
import numpy as np
import pandas as pd
from textblob import TextBlob
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer, TfidfVectorizer
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.naive_bayes import MultinomialNB
<<<<<<< HEAD
=======
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV
>>>>>>> fd60cec4d589fa988d236931a1a553eb711efa50
from sklearn.metrics import classification_report, f1_score, accuracy_score, confusion_matrix
import pickle

df_fake = pd.read_csv('data/DataSet_Misinfo_FAKE.csv')
df_fake = df_fake.dropna()
df_real = pd.read_csv('data/DataSet_Misinfo_TRUE.csv')
df_real = df_real.dropna()
df_fake['truth'] = 0
df_real['truth'] = 1
df = pd.concat([df_real, df_fake])
df = df.drop('Unnamed: 0', axis=1)
sample_size = int(len(df.index))
# print(sample_size)
df_sample = df.sample(n=sample_size, random_state=42)
X = df['text']
y = df['truth']
print("df created")

def split_into_lemmas(content):
    # Convert to lowercase
    content = content.lower()
    # Tokenize and lemmatize
    words = TextBlob(content).words
    return ' '.join([word.lemmatize() for word in words])

# Assuming X is your DataFrame column with text data
X = X.apply(split_into_lemmas)
print("finished cleaning/prep")

count_vectorizer = CountVectorizer()
X_count = count_vectorizer.fit_transform(X)

# Create a TfidfTransformer
tfidf_transformer = TfidfTransformer()
X_tfidf = tfidf_transformer.fit_transform(X_count)
X_train, X_test, y_train, y_test = train_test_split(X_tfidf, y, test_size=0.2, random_state=42)
naive_bayes = MultinomialNB().fit(X_train, y_train)
print("done training")

with open('models/count_vectorizer.pkl', 'wb') as f:
    pickle.dump(count_vectorizer, f)
with open('models/tfidf_transformer.pkl', 'wb') as f:
    pickle.dump(tfidf_transformer, f)

# with open('models/full_nb.pkl', 'wb') as f:
#     pickle.dump(naive_bayes, f)
# print("saved to pickle")

# train_predictions = naive_bayes.predict(X_train)

# print (train_predictions)
# print ('accuracy', accuracy_score(y_train, train_predictions))
# print ('confusion matrix\n', confusion_matrix(y_train, train_predictions))
# print ('(row=expected, col=predicted)')

# plt.matshow(confusion_matrix(y_train, train_predictions), cmap=plt.cm.binary, interpolation='nearest')
# plt.title('confusion matrix')
# plt.colorbar()
# plt.ylabel('expected label')
# plt.xlabel('predicted label')