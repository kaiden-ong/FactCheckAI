import sys
import json
import pickle
from models import split_into_lemmas
# need to import the split into lemmas function 

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

def classify(input_value):
    result = model.predict([input_value])[0]
    return result[0]

if __name__ == '__main__':
    input_value = sys.argv[1]
    result = classify(input_value)
    print(json.dumps({"result": result}))
