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
        ('classifier', SVC()),  # <== change here
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
    output = predict("It almost seems like Donald Trump is trolling America at this point. In the beginning, when he tried to gaslight the country by insisting that the crowd at his inauguration was the biggest ever   or that it was even close to the last couple of inaugurations   we all kind of scratched our heads and wondered what kind of bullshit he was playing at. Then when he started appointing people to positions they had no business being in, we started to worry that this was going to go much worse than we had expected.After 11 months of Donald Trump pulling the rhetorical equivalent of whipping his dick out and slapping it on every table he gets near, I think it s time we address what s happening: Dude is a straight-up troll. He gets pleasure out of making other people uncomfortable or even seeing them in distress. He actively thinks up ways to piss off people he doesn t like.Let s set aside just for a moment the fact that that s the least presidential  behavior anyone s ever heard of   it s dangerous.His latest stunt is one of the grossest yet.Everyone is, by now, used to Trump not talking about things he doesn t want to talk about, and making a huge deal out of things that not many people care about. So it wasn t a huge surprise when the president didn t discuss the Sandy Hook shooting of 2012 on the fifth anniversary of that tragic event. What was a huge surprise was that he not only consciously decided not to invite the victims  families to the White House Christmas party this year   as they have been invited every year since the massacre took place, along with others who share those concerns.In each of the past 4 years, President Obama invited gun violence prevention activists, gun violence survivors (including the Sandy Hook families) and supportive lawmakers to his Christmas party. Zero gun lobbyists were in attendance. pic.twitter.com/QePW9FtbSh  Shannon Watts (@shannonrwatts) December 15, 2017The last sentence of that tweet is important, because that s exactly who Donald Trump did invite to the White House Christmas party. Instead of victims. On the anniversary day.Yesterday was the 5 year mark of the mass shooting at Sandy Hook School, which went unacknowledged by the President. On the same day, he hosted a White House Christmas party to which he invited @NRA CEO Wayne LaPierre. Here he is at the party with @DanPatrick. pic.twitter.com/mUbKCIWGxB  Shannon Watts (@shannonrwatts) December 15, 2017Wayne LaPierre is the man who, in response to the Sandy Hook massacre, finally issued a statement that blamed gun violence on music, movies, and video games, and culminated with perhaps the greatest bit of irony any man has ever unintentionally conceived of: Isn t fantasizing about killing people as a way to get your kicks really the filthiest form of pornography? Yes. Yes, it is, Wayne.Anyway, Happy Holidays Merry Christmas from Donald Trump, everyone!Featured image via Alex Wong/Getty Images")
    # print(json.dumps(output))
    print(output)

# with open('model.pkl', 'wb') as f:
#     pickle.dump(svm_detector, f)