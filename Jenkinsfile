@Library('Shared') _
pipeline {
    agent any
    
    environment{
        SONAR_HOME = tool "Sonar"
        DOCKER_HOST = "unix:///var/run/docker.sock"
    }
    
    parameters {
        string(name: 'FRONTEND_DOCKER_TAG', defaultValue: '', description: 'Setting docker image for latest push')
        string(name: 'BACKEND_DOCKER_TAG', defaultValue: '', description: 'Setting docker image for latest push')
    }
    
    stages {
        stage("Validate Parameters") {
            steps {
                script {
                    env.FRONTEND_DOCKER_TAG = params.FRONTEND_DOCKER_TAG ?: sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.BACKEND_DOCKER_TAG = params.BACKEND_DOCKER_TAG ?: sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    echo "Frontend tag: ${env.FRONTEND_DOCKER_TAG}"
                    echo "Backend tag: ${env.BACKEND_DOCKER_TAG}"
                }
            }
        }
        stage("Workspace cleanup"){
            steps{
                script{
                    cleanWs()
                }
            }
        }
        
        stage('Git: Code Checkout') {
            steps {
                script{
                    code_checkout("https://github.com/cojocloud/DevSecOps-Mega-Project.git","main")
                }
            }
        }
        
        stage("Trivy: Filesystem scan"){
            steps{
                script{
                    trivy_scan()
                }
            }
        }

        stage("OWASP: Dependency check"){
            steps{
                script{
                    withCredentials([string(credentialsId: 'NVD-API-KEY', variable: 'NVD_API_KEY')]) {
                        dependencyCheck additionalArguments: "--nvdApiKey ${NVD_API_KEY} --nvdDatafeedUrl https://nvd.nist.gov/feeds/json/cve/1.1/", odcInstallation: 'OWASP'
                        dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                    }
                }
            }
        }
        
        stage("SonarQube: Code Analysis"){
            steps{
                script{
                    sonarqube_analysis("Sonar","wanderlust","wanderlust")
                }
            }
        }
        
        stage("SonarQube: Code Quality Gates"){
            steps{
                script{
                    sonarqube_code_quality()
                }
            }
        }
        
        stage('Exporting environment variables') {
            parallel{
                stage("Backend env setup"){
                    steps {
                        script{
                            dir("Automations"){
                                sh "bash updatebackendnew.sh"
                            }
                        }
                    }
                }
                
                stage("Frontend env setup"){
                    steps {
                        script{
                            dir("Automations"){
                                sh "bash updatefrontendnew.sh"
                            }
                        }
                    }
                }
            }
        }
        
        stage("Docker: Build Images"){
            steps{
                script{
                        dir('backend'){
                            docker_build("wanderlust-backend-beta","${env.BACKEND_DOCKER_TAG}","thiexco")
                        }

                        dir('frontend'){
                            docker_build("wanderlust-frontend","${env.FRONTEND_DOCKER_TAG}","thiexco")
                        }
                }
            }
        }
        
        stage("Docker: Push to DockerHub"){
            steps{
                script{
                    docker_push("wanderlust-backend-beta","${env.BACKEND_DOCKER_TAG}","thiexco")
                    docker_push("wanderlust-frontend","${env.FRONTEND_DOCKER_TAG}","thiexco")
                }
            }
        }
    }
    post{
        success{
            archiveArtifacts artifacts: '*.xml', allowEmptyArchive: true, followSymlinks: false
            script {
                try {
                    build job: "Wanderlust-CD", wait: false, propagate: false, parameters: [
                        string(name: 'FRONTEND_DOCKER_TAG', value: "${env.FRONTEND_DOCKER_TAG}"),
                        string(name: 'BACKEND_DOCKER_TAG', value: "${env.BACKEND_DOCKER_TAG}")
                    ]
                } catch (Exception e) {
                    echo "Wanderlust-CD job not found or failed to trigger: ${e.message}"
                }
            }
        }
    }
}
