pipeline {
  agent any
  environment {
    FRONT_IMAGE = "myapp-frontend"
    BACK_IMAGE  = "myapp-backend"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Frontend Image') {
      steps {
        dir('./client/Dockerfile') {
          sh 'docker build -t ${FRONT_IMAGE}:latest .'
        }
      }
    }

    stage('Build Backend Image') {
      steps {
        dir('./server/Dockerfile') {
          sh 'docker build -t ${BACK_IMAGE}:latest .'
        }
      }
    }

    stage('Run Containers') {
      steps {
        sh 'docker compose up -d'
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
