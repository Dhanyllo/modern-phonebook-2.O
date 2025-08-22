pipeline {
    agent any
    
    triggers {
        githubPush()
    }

   options {
    buildDiscarder(logRotator(numToKeepStr: '1', artifactNumToKeepStr: '1'))
    }

    stages {
        stage('Inject Secrets & Deploy') {
            steps {
                withCredentials([
                    string(credentialsId: 'mysql_host', variable: 'mysql_host'),
                    string(credentialsId: 'mysql_user', variable: 'mysql_user'),
                    string(credentialsId: 'mysql_database', variable: 'mysql_database'),
                    string(credentialsId: 'mysql_password', variable: 'mysql_password'),
                    string(credentialsId: 'PORT', variable: 'PORT'),
                    string(credentialsId: 'VITE_API_URL', variable: 'VITE_API_URL')
                ]) {
                    echo "Creating .env file for backend..."
                    dir('server') {
                        sh """
                        cat <<EOF > .env
                        mysql_host=${mysql_host}
                        mysql_user=${mysql_user}
                        mysql_database=${mysql_database}
                        mysql_password=${mysql_password}
                        PORT=${PORT}
                        EOF
                        """
                    }

                    echo "Creating .env file for frontend..."
                    dir('client') {
                        sh """
                        cat <<EOF > .env
                        VITE_API_URL=${VITE_API_URL}
                        EOF
                        """
                    }

                    echo "Stopping old containers..."
                    sh 'docker-compose -f docker-compose.yml down --remove-orphans'

                    echo "Starting new containers..."
                    sh 'docker-compose -f docker-compose.yml --env-file server/.env up -d --build'
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning workspace..."
            cleanWs()
        }
    }
}
