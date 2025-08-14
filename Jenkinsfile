// pipeline {
//   agent any
//   environment {
//     FRONT_IMAGE = "modern-phonebook-frontend"
//     BACK_IMAGE  = "modern-phonebook-backend"
//   }

//   stages {
//     stage('Checkout') {
//       steps {
//         checkout scm
//       }
//     }

//     stage('Build Frontend Image') {
//       steps {
//         dir('client') {
//           sh 'docker build -t ${FRONT_IMAGE}:latest .'
//         }
//       }
//     }

//     stage('Build Backend Image') {
//       steps {
//         dir('server') {
//           sh 'docker build -t ${BACK_IMAGE}:latest .'
//         }
//       }
//     }

//     stage('Run Containers') {
//       steps {
//         sh 'docker compose up -d'
//       }
//     }
//   }

//   post {
//     always {
//       echo "Cleaning workspace"
//       cleanWs()
//     }
//   }
// }


pipeline {
    agent any

    environment {
        FRONT_IMAGE = "modern-phonebook-frontend"
        BACK_IMAGE  = "modern-phonebook-backend"
    }

    stages {
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/Dhanyllo/modern-phonebook-2.O.git',
                    branch: 'master',
                    credentialsId: 'github-token'
                )
            }
        }

        stage('Inject Secrets & Build') {
            steps {
                // Inject secrets from Jenkins
                withCredentials([
                    string(credentialsId: 'mysql_host', variable: 'mysql_host'),
                    string(credentialsId: 'mysql_user', variable: 'mysql_user'),
                    string(credentialsId: 'mysql_database', variable: 'mysql_database'),
                    string(credentialsId: 'mysql_password', variable: 'mysql_password'),
                    string(credentialsId: 'PORT', variable: 'PORT')
                ]) {
                    // Build frontend
                    dir('client') {
                        sh 'docker build -t ${FRONT_IMAGE}:latest .'
                    }

                    // Build backend with build args
                    dir('server') {
                        sh '''
                        docker build \
                            --build-arg MYSQL_HOST=${mysql_host} \
                            --build-arg MYSQL_USER=${mysql_user} \
                            --build-arg MYSQL_DATABASE=${mysql_database} \
                            --build-arg MYSQL_PASSWORD=${mysql_password} \
                            --build-arg PORT=${PORT} \
                            -t ${BACK_IMAGE}:latest .
                        '''
                    }

                    // Create .env file in server/ directory
                    dir('server') {
                        sh '''
                        cat <<EOF > .env
MYSQL_HOST=${mysql_host}
MYSQL_USER=${mysql_user}
MYSQL_DATABASE=${mysql_database}
MYSQL_PASSWORD=${mysql_password}
PORT=${PORT}
EOF
                        '''
                    }

                    // Run docker-compose from root pointing to server/.env
                    sh 'docker-compose --env-file server/.env up -d'
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning workspace"
            cleanWs()
        }
    }
}
