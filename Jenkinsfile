Jenkinsfile (Declarative Pipeline)
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                cd  ./Backend/WhiteBoardBackEnd/
                source ./Backend/bin/activate
                sudo python3 manage.py runserver 0.0.0.0:8080
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}