import os

os.environ["KERAS_BACKEND"] = "tensorflow"

import keras
import tensorflow as tf
import numpy as np
from keras import layers
import pandas as pd
import time
from sklearn.model_selection import train_test_split
import string
import re
import pickle

# Data Cleaning
df = pd.read_csv("data/WELFake_Dataset.csv")
df['text'] = df['title'] + " " + df['text']
df = df.drop(columns=['title', 'Unnamed: 0'])
df = df.dropna()
df.head()

X = df['text'].tolist()
y = df['label'].tolist()

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model Constants
max_features = 20000
embedding_dim = 128
sequence_length = 500

# Data prep
batch_size = 32
train_ds = tf.data.Dataset.from_tensor_slices((X_train, y_train)).batch(batch_size)
val_ds = tf.data.Dataset.from_tensor_slices((X_test, y_test)).batch(batch_size)
vectorize_layer = keras.layers.TextVectorization(
    max_tokens=max_features,
    output_mode="int",
    output_sequence_length=sequence_length,
)
text_ds = train_ds.map(lambda x, y: x)
vectorize_layer.adapt(text_ds)

# Vectorizing text for training
def vectorize_text(text, label):
    text = tf.expand_dims(text, -1)
    return vectorize_layer(text), label

train_ds = train_ds.map(vectorize_text)
val_ds = val_ds.map(vectorize_text)

train_ds = train_ds.cache().prefetch(buffer_size=10)
val_ds = val_ds.cache().prefetch(buffer_size=10)

# The Model
inputs = keras.Input(shape=(None,), dtype="int64")
x = layers.Embedding(max_features, embedding_dim)(inputs)
x = layers.Dropout(0.5)(x)
x = layers.Conv1D(128, 7, padding="valid", activation="relu", strides=3)(x)
x = layers.Conv1D(128, 7, padding="valid", activation="relu", strides=3)(x)
x = layers.GlobalMaxPooling1D()(x)
x = layers.Dense(128, activation="relu")(x)
x = layers.Dropout(0.5)(x)
predictions = layers.Dense(1, activation="sigmoid", name="predictions")(x)
model = keras.Model(inputs, predictions)
model.compile(loss="binary_crossentropy", optimizer="adam", metrics=["accuracy"])

# Fitting the model
epochs = 3
model.fit(train_ds, validation_data=val_ds, epochs=epochs)

# Model can now take in strings
inputs = keras.Input(shape=(1,), dtype="string")
indices = vectorize_layer(inputs)
outputs = model(indices)

end_to_end_model = keras.Model(inputs, outputs)
end_to_end_model.compile(
    loss="binary_crossentropy", optimizer="adam", metrics=["accuracy"]
)

df_test = pd.read_csv("data/FakeNewsNet.csv")
df_test = df_test.drop(columns=['news_url', 'tweet_num', 'source_domain'])
df_test = df_test.dropna()
df_test.head()
test_text = df_test['title'].tolist()
test_label = df_test['real'].tolist()
test_ds = tf.data.Dataset.from_tensor_slices((test_text, test_label)).batch(batch_size)
results = end_to_end_model.evaluate(test_ds)

end_to_end_model.save('models/neural_network.keras', include_optimizer=False, compile=False)
print("Model saved to keras format")