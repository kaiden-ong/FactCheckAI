import sys
import json

if __name__ == '__main__':
    print(json.dumps(len(sys.argv[1])))
