node('built-in') {
    checkout scm
    stage('Build') {
        cd './Backend/WhiteBoardBackEnd/'
        source './Backend/bin/activate'
        sudo 'python3 manage.py test'
    }
}
