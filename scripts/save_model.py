# Use this to save to pickle file
import matplotlib.pyplot as plt
import csv
import sklearn
import numpy as np
import pandas as pd
from textblob import TextBlob
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer, TfidfVectorizer
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV
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
sample_size = int(len(df.index)/2)
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

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print ("pretrain")
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

print("about to train")
grid_svm = GridSearchCV(
    pipeline_svm,  # pipeline from above
    param_grid=param_svm,  # parameters to tune via cross validation
    refit=True,  # fit using all data, on the best detected classifier
    n_jobs=3,  # number of cores to use for parallelization; -1 for "all cores"
    scoring='accuracy',  # what score are we optimizing?
    cv=StratifiedKFold(n_splits=5),  # what type of cross validation to use
)

svm_detector = grid_svm.fit(X_train, y_train)
# print (svm_detector.predict(["Trump supporters and the so-called president s favorite network are lashing out at special counsel Robert Mueller and the FBI. The White House is in panic-mode after Mueller obtained tens of thousands of transition team emails as part of the Russian probe. Ironically, it will quite possibly be emails that brings Trump down.A lawyer for the Trump transition team is claiming that the emails had been illegally turned over by the General Services Administration because the account owners never received notification of the request and he s claiming that they were  privileged communications. In a letter, Trump s attorney requested that Congress  act immediately to protect future presidential transitions from having their private records misappropriated by government agencies, particularly in the context of sensitive investigations intersecting with political motives. Mueller spokesman Peter Carr defended the special counsel s work in a statement issued just past midnight on Sunday, several hours after claims of   unlawful conduct  by Trump s attorney were made, according to Politico. When we have obtained emails in the course of our ongoing criminal investigation, we have secured either the account owner s consent or appropriate criminal process,  he said.The words that pop out in the statement are  criminal investigation,  the  account owner s consent  and  criminal process. While on the campaign trail, Donald Trump asked Russians to hack Hillary Clinton s emails. After the election, Trump s team is claiming that Mueller obtained the transition teams  emails illegally, even though that s not the truth. We see a pattern here.Team Trump thought Mueller was on a fishing expedition. Turns out, he was actually reeling in the fish. The White House was not aware at the time that he had the emails. Mueller got them through GSA so that team Trump could not selectively leave any out if they were requested.Merry Christmas, Mr. Trump.Photo by Ann Heisenfelt/Getty Images."])[0])
print("done training")
# keep each dump, just comment out when done:

# with open('models/eight_svm.pkl', 'wb') as f:
#     pickle.dump(svm_detector, f)

# with open('models/half_svm.pkl', 'wb') as f:
#     pickle.dump(svm_detector, f)

with open('models/full_svm.pkl', 'wb') as f:
    pickle.dump(svm_detector, f)

