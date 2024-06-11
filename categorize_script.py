import sys
import json
import joblib
# need to import the split into lemmas function 

model = joblib.load('model.pkl')

def classify(input_value):
    result = model.predict([input_value])
    return result[0]

if __name__ == '__main__':
    input_value = sys.argv[1]
    result = classify(input_value)
    print(json.dumps({"result": result}))
