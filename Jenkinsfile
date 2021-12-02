node('built-in') {
    checkout scm
    stage('Build') {
        wrap([$class: 'BuildUser']) {
            def user = env.BUILD_USER_ID
        }
        sh './Backend/Build_Script.sh'
    }
}
