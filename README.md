# Automated Self-Healing DevOps Platform

##  The Problem It Solves
When a production application crashes, it usually triggers a flood of customer support tickets ("Site is down!"). A human engineer then has to manually SSH into a server, read logs, and restart the pod while users wait. 

This project completely eliminates that manual workflow. It is a full-stack, automated infrastructure built to detect a fatal application crash, instantly heal the environment without human intervention, and push a detailed incident report directly to the support team's Slack channel. The goal is to close the gap between when an error occurs and when it is fixed, ensuring maximum uptime and zero support queue buildup.

##  Architecture & Tech Stack
* **Infrastructure as Code:** Terraform (AWS VPC, Subnets, EKS Cluster, ECR Repository)
* **Container Orchestration:** Amazon EKS (Kubernetes)
* **CI/CD Pipeline:** GitHub Actions (Automated Docker build, ECR push, and K8s deployment)
* **Observability & ChatOps:** Prometheus, Grafana, and Alertmanager deployed via Helm
* **Target Application:** Custom Node.js Express API with a dedicated `/crash` endpoint to simulate fatal memory leaks.

##  Deployment Workflow

### 1. Provision Infrastructure
The foundational AWS infrastructure is managed securely via Terraform. 
```bash
cd terraform
terraform init
terraform apply


2. Automated GitOps Pipeline
The GitHub Actions pipeline listens for commits to the main branch. Upon push, it authenticates with AWS, builds the Node.js container, pushes it to the Amazon ECR registry, and dynamically updates the Kubernetes deployment manifests.

3. Deploy Observability Stack
The monitoring and alerting layer is deployed into a dedicated Kubernetes namespace using Helm.

helm repo add prometheus-community [https://prometheus-community.github.io/helm-charts](https://prometheus-community.github.io/helm-charts)
helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace

4. Configure Slack Alerting
Alertmanager is configured to monitor the specific application namespace and push formatted incident reports to a Slack webhook upon detecting a pod restart loop.

helm upgrade prometheus prometheus-community/kube-prometheus-stack -f alertmanager-values.yaml --namespace monitoring

Proof of Concept: The Chaos Test
To prove the automated recovery capability, the application features a crash endpoint that forcefully terminates the Node.js process.

The Crash: A GET request to the crash endpoint simulates a fatal error.

The Recovery: Kubernetes instantly detects the dead container and provisions a replacement replica, restoring service in milliseconds.

The Alert: Prometheus catches the metric anomaly, Grafana visualizes the drop in resources, and Alertmanager pushes a critical incident summary to the Slack channel within 60 seconds.