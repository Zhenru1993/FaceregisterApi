# FaceregisterApi

An API that can register and recognize face online

How to use:
1. Create a server and allow tcp & ssh access on port 3000
2. Install and config Python3, Cmake, OpenCV on server
3. Install Python Packages python-opencv, dlib, face-recognition, imutils by pip3 on server
4. Install and config Nodejs on server
5. Clone the whole repo to the server
6. Install all Nodejs packages by running $npm install$ on server
7. Run $ node server.js on server to start the website (you can use npm package pm2 to run your server in background forever)

Managing dataset:
*. To clean *ALL* data in database, run clean_faces.py with python3 in folder face-recognition-opencv/. 
*. To clean *specific* user data, run clean_faces.py -u <username> with python3 in folder face-recognition-opencv/

URL:
For register: <serverIP>:3000/register
For recognize: <serverIP>:3000/recognize

Password:
default is "midea", you can add password by editing the server.js file

Helpful Link:
How to config opencv and python enviroment: https://www.pyimagesearch.com/2018/06/18/face-recognition-with-opencv-python-and-deep-learning/



