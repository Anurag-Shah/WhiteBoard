node('built-in') {
    checkout scm
    wrap([$class: 'BuildUser']) {
        def user = env.BUILD_USER_ID
    }
    stage('Build') {
        dir('Backend') {
            sh "chmod +x -R ${env.WORKSPACE}"
            sh './Backend/Build_Script.sh'   
        }
    }
}
