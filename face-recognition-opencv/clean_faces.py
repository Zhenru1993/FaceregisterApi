# import the necessary packages
import pickle
import os

data = pickle.loads(open("encodings.pickle", "rb").read())
print("[INFO] cleaning encodings...")
data = {"encodings": [], "names": []}
f = open("encodings.pickle", "wb")
f.write(pickle.dumps(data))
f.close()
print("[INFO] cleaning done! Hooray!")
