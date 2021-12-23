# WhiteBoard
Project for CS307 - Software Engineering at Purdue University. This application was developed using Agile development methodologies.

## Introduction
Modern Coding usually requires a computer with an IDE (Integrated Development Environment) or a compiler, but there are many situations where someone needs to execute a
code sample present in a non-textual format. For example, an interviewee
preparing a coding interview will have to write their code on a piece of paper or on a
whiteboard, and without a compiler, one can only debug by observing their written code
or typing it out in full, a waste of time for all parties involved.

The purpose of this project is to develop a novel “IDE for ritten Code” that can support
typeform code or scanning hand-written code, compile the code and return the terminal
output or stack trace back to the user. This application will take the form of a
cross-platform mobile application, and will allow users to save their code images and
organize into teams.

## Features
- User can send an image of code to the backend server. The server will convert the code to a textual format, using tesseract-OCR to extract the textual data from the image, identify its language if needed, and
execute the code within an isolated docker container. The output is processed, with any errors indicated on the original image with a red underline, and the backend returns this output to the front-end. User can see the errors and their location, edit the code and resubmit it.
- Users can also create an account and a workspace to invite other users to work together, seeing the compiler output for all the images in their team.
- User can restore their password using an email service. This feature is not available if not deployed on an AWS instance or similar server.

## Demo
![](Demo/Gud_Demo.gif)
![](Demo/Bad_Demo.gif)

## Requirements
### Backend Server
- Docker
- MySQL
- Python libraries listed in /Backend/requirement.txt

### Frontend Application
- Expo React-Native (installed using NPM)

## Setup Instruction
- ### Frontend
  - Install Expo React Native. Instructions can be found at https://docs.expo.dev/get-started/installation/
  - After the installation is complete, navigate to the WhiteBoardApp folder and run
  
    ```
    npm start
    ```
    or
    ```
    expo start
    ```
    This will start an expo server, which allows you to run the app with expo app on any mobile devices or simulators
  - To export the app into a standalone app, follow the instructions [here](https://docs.expo.dev/classic/building-standalone-apps/)
- ### Backend / Server
  - Navigate to the Backend folder
  - Install all the required python libraries with
    ```
    pip3 install -r requirement.txt
    ```
  - Install and initiate docker service. To install docker, follow the instructions [here](https://docs.docker.com/engine/install/ubuntu/)
  
    To activate local docker service manually:
    
    ```
    sudo systemctl start docker
    ```
    The following docker containers are used: [frolvlad/alpine-gcc](https://hub.docker.com/r/frolvlad/alpine-gcc), [frolvlad/alpine-gxx](https://hub.docker.com/r/frolvlad/alpine-gxx/), [mono](https://hub.docker.com/_/mono), [openjdk](https://hub.docker.com/_/openjdk)
  - Install a MySQL server and run a local MySQL server / service. In the MySQL shell, setup a user with full privileges and a database / schema
    according to the database section in setting.py
    
    For simplicity, open setting.py and find the database section. Copy the username, password and database name and execute the following scripts in the MySQL shell:
    ```
    CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
    CREATE DATABASE django_data_base;
    GRANT ALL PRIVILEGES ON django_data_base.* TO 'username'@'localhost';
    ```
    After that, exit the MySQL shell and navigate to the directory of manage.py. Update table metadata with command:
    
    ```
    sudo python3 manage.py makemigrations
    sudo python3 manage.py migrate
    ```
    Enter the MySQL shell and double check if the tables are updated.
    
  - To run a local django server, navigate to Backend/WhiteBoardBackEnd/
  
    Run the localhost server with command:
    
    ```
    sudo python3 manage.py runserver localhost:8080
    ```
    To deploy on a server with port forwarding, run the server with command:
    
    ```
    sudo python3 manage.py runserver 0.0.0.0:8080
    ```
    
    
## Note:
- Before compiling the frontend package, please change the common url to the base_url, and additionally update the port if you are not using 8080. If you are running on localhost, change it to 

  ```
  const base_url =
  "http://localhost:8080/";  
  ```
  
  Otherwise, change it to your server's domain or IP address with the specific port you choose.
  
- For security issues, Secret keys have been hidden. To run your own server, create a .env file under Backend/WhiteBoardBackEnd/WhiteBoardBackEnd

  To generate a Django secret key, run the following commands in a python3 shell:
  
  ```
  from django.core.management.utils import get_random_secret_key
  
  print (get_random_secret_key())
  ```
  Copy the secret key and in your .env file, write:
  
  ```
  SECRET_KEY = 'key_you_just_copied'
  ```
  (Remember to keep the single quotes)
  
  We also have other AWS secret keys. If you do not intent to deploy on a AWS server, remove these lines in Setting.py:
  
  ```
  AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY")  # hidden
  AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY")  # hidden
  ```
  
  However, please note that this will disable the email notification function of this application, relevant for resetting a user's password.

- Allow docker images to run as root. As these images are isolated and their memory and CPU usage restricted, this does not pose a security concern.

## Support CI/CD tools
- A simple Jenkins file and Jenkins build script have been provided for basic CI/CD, along with a basic unit test suite for the Compiler portion. This part may be modified as desired, and more test cases can be easily added to /Backend/WhiteBoardBackEnd/API/tests.py (the test suite can be run using `sudo python3 manage.py test`, while in the /Backend/WhiteBoardBackEnd directory. If you add test cases to your implementation, we would appreciate if you could provide us the source code for the tests through a pull request.

## Further Work
- Tesseract OCR is not pretrained on handwritten data, so taking pictures of handwritten code will usually require manual corrections. However, We have a 95% accuracy while detecting typeform code. Detecting hand-written code would require training Tessearct on a large database of handwritten character data.

- Using a dictionary can alleviate some of the issues with Tesseract without needing to train it on new data.
