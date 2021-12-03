node('built-in') {
    checkout scm
    wrap([$class: 'BuildUser']) {
        def user = env.BUILD_USER_ID
    }
    try {
        stage('Build') {
            dir('Backend/WhiteBoardBackEnd') {
                sh "chmod +x -R ${env.WORKSPACE}"
                sh './Build_Script.sh'   
            }
        }   
    } catch (e) {
        echo 'Build Failed!'
        git reset --hard HEAD@{1}
    }
}
