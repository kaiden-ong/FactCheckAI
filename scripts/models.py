# Ignore this file, I think was for testing purposes
import matplotlib.pyplot as plt
import csv
import sklearn
import numpy as np
import pandas as pd
from textblob import TextBlob
import nltk
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer, TfidfVectorizer
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import classification_report, f1_score, accuracy_score, confusion_matrix
import pickle
import sys
import json


def predict(input):
    df_fake = pd.read_csv('data/DataSet_Misinfo_FAKE.csv')
    df_fake = df_fake.dropna()
    df_real = pd.read_csv('data/DataSet_Misinfo_TRUE.csv')
    df_real = df_real.dropna()
    df_fake['truth'] = 0
    df_real['truth'] = 1
    df = pd.concat([df_real, df_fake])
    df = df.drop('Unnamed: 0', axis=1)
    df_sample = df.sample(n=1000, random_state=42)
    X = df_sample['text']
    y = df_sample['truth']

    def split_into_lemmas(content):
        # Convert to lowercase
        content = content.lower()
        # Tokenize and lemmatize
        words = TextBlob(content).words
        return ' '.join([word.lemmatize() for word in words])

    # Assuming X is your DataFrame column with text data
    X.apply(split_into_lemmas)

    count_vectorizer = CountVectorizer()
    X_count = count_vectorizer.fit_transform(X)

    # Create a TfidfTransformer
    tfidf_transformer = TfidfTransformer()
    X_tfidf = tfidf_transformer.fit_transform(X_count)
    tfidf_transformer = TfidfTransformer()
    content_tfidf = tfidf_transformer.fit_transform(X_tfidf)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    pipeline_svm = Pipeline([
        ('bow', CountVectorizer(analyzer=split_into_lemmas)),
        ('tfidf', TfidfTransformer()),
        ('classifier', SVC(probability=True)),  # <== change here
    ])

    # pipeline parameters to automatically explore and tune
    param_svm = [
    {'classifier__C': [1, 10, 100, 1000], 'classifier__kernel': ['linear']},
    {'classifier__C': [1, 10, 100, 1000], 'classifier__gamma': [0.001, 0.0001], 'classifier__kernel': ['rbf']},
    ]

    grid_svm = GridSearchCV(
        pipeline_svm,  # pipeline from above
        param_grid=param_svm,  # parameters to tune via cross validation
        refit=True,  # fit using all data, on the best detected classifier
        n_jobs=-1,  # number of cores to use for parallelization; -1 for "all cores"
        scoring='accuracy',  # what score are we optimizing?
        cv=StratifiedKFold(n_splits=5),  # what type of cross validation to use
    )

    svm_detector = grid_svm.fit(X_train, y_train)
    return svm_detector.predict([input])[0]

if __name__ == '__main__':
    output = predict(sys.argv[1])
    # print(json.dumps(output))
    print(output)

# with open('model.pkl', 'wb') as f:
#     pickle.dump(svm_detector, f)