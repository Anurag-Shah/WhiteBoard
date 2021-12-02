node('built-in') {
    checkout scm
    wrap([$class: 'BuildUser']) {
        def user = env.BUILD_USER_ID
    }
    stage('Build') {
        sh './Backend/Build_Script.sh'
    }
}
