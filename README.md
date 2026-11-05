# Deploying a Containerized Application on Amazon EKS | Kubernetes Project

## Project Overview

As part of my journey into Cloud and DevOps engineering, I wanted to get practical experience with Kubernetes and understand how applications are deployed and managed in a cloud environment.

For this project, I worked with a sample backend application for a fictional e-commerce company called **ShopEase**. The objective was to move away from running an application manually and establish a repeatable deployment process using Docker and Amazon Elastic Kubernetes Service (EKS).

I containerized the application, pushed the Docker image to Amazon Elastic Container Registry (ECR), created an EKS cluster with EC2 worker nodes, and deployed the application using Kubernetes manifests.

Along the way, I also worked through some real deployment issues, including image architecture compatibility and Kubernetes image-pull errors. This helped me understand the troubleshooting process rather than just following deployment commands.

## What I wanted to achieve

The main goals of this project were:

- Containerize a backend application using Docker.
- Build and publish a Docker image to Amazon ECR.
- Provision a managed Kubernetes cluster using Amazon EKS.
- Deploy the application using Kubernetes Deployments.
- Run multiple replicas of the application.
- Expose the application using a Kubernetes NodePort Service.
- Understand how Kubernetes manages Pods and distributes application traffic.
- Troubleshoot common deployment and container image issues.

## Architecture

The application follows a straightforward containerized deployment architecture.

**Application traffic flow:**

```text
              Developer
                  |
                  |
            Docker Build
                  |
                  v
          Docker Container Image
                  |
                  v
          Amazon ECR Repository
                  |
                  | Image Pull
                  v
          Amazon EKS Cluster
                  |
          EC2 Worker Nodes
                  |
           Kubernetes Deployment
                  |
            ----------------
            |              |
            v              v
          Pod 1          Pod 2
            |              |
            ----------------
                  |
                  v
          Kubernetes Service
              (NodePort)
                  |
                  v
          Application Access
```

### AWS and Kubernetes components

| Component | Purpose |
|---|---|
| Docker | Packages the application and its dependencies into an image. |
| Amazon ECR | Stores the application container image. |
| Amazon EKS | Provides the managed Kubernetes control plane. |
| Amazon EC2 | Runs the Kubernetes worker nodes. |
| Amazon VPC | Provides networking for the EKS cluster. |
| AWS IAM | Manages AWS permissions and access. |
| Kubernetes Deployment | Maintains the desired number of application replicas. |
| Kubernetes Pods | Run the application containers. |
| Kubernetes Service | Provides a stable way to access the application. |
| kubectl | Used to interact with and manage Kubernetes resources. |

## Technologies Used

- AWS (EKS, ECR, EC2, VPC, IAM)
- Docker
- Kubernetes
- kubectl
- Amazon Linux / Linux-based worker nodes
- Node.js
- YAML
- Git and GitHub

## Project Implementation

### 1. Containerizing the Application

I started by preparing the backend application for containerization.

I used Docker to package the Node.js application and its dependencies into an image.

The Dockerfile defines the base image, working directory, dependency installation and application startup process.

This makes the application easier to move between environments without having to manually configure its dependencies on every machine.

### 2. Publishing the Image to Amazon ECR

After building the Docker image locally, I created an Amazon ECR repository to store it.

The image was tagged with the ECR repository URI and pushed to AWS.

This allowed the EKS worker nodes to retrieve the application image from a centralized container registry.

### 3. Creating the Amazon EKS Cluster

I provisioned an Amazon EKS cluster with EC2 worker nodes.

The cluster provides the Kubernetes environment where the application runs.

I configured `kubectl` to communicate with the EKS cluster and verified that the worker nodes were available.

### 4. Deploying the Application on Kubernetes

I created a Kubernetes Deployment manifest (`deployment.yaml`) to define how the application should run.

The deployment specifies:

- Application name and labels.
- Container image stored in Amazon ECR.
- Container port.
- Desired replica count.

I configured the Deployment to run two replicas.

Kubernetes then created and managed the Pods according to the desired state defined in the manifest.

### 5. Exposing the Application Using NodePort

Once the application Pods were running, I created a Kubernetes Service using `service.yaml`.

I used the NodePort service type to expose the application through the worker nodes.

This provided a way to access the application from outside the Kubernetes cluster.

I also used port forwarding during testing to access the application locally.

### 6. Testing and Verification

I used `kubectl` to verify the deployment and check the health of the Kubernetes resources.

Some of the commands used during verification were:

```bash
kubectl get nodes

kubectl get pods

kubectl get deployments

kubectl get services

kubectl describe pods -l app=k8s-demo-service
```

To access the application locally, I used:

```bash
kubectl port-forward deployment/k8s-demo-service 8080:3000
```

The application could then be accessed through:

```text
http://localhost:8080
```

## Troubleshooting and Learnings

One of the useful parts of this project was troubleshooting deployment failures.

During the initial deployment, Kubernetes reported `InvalidImageName` and `ImagePullBackOff` errors.

I investigated the Pod descriptions and Kubernetes events to understand what was happening.

I identified two separate issues:

**1. InvalidImageName**

Some of the earlier Kubernetes Pods were referencing an incorrect image URI containing a placeholder AWS account ID.

I corrected the image reference in the Deployment manifest.

**2. ImagePullBackOff**

The image was successfully pushed to ECR, but the EKS worker nodes initially could not pull it because the image manifest did not contain a compatible platform for the nodes.

I rebuilt the image explicitly for the Linux AMD64 platform:

```bash
docker build --platform linux/amd64 -t k8s-demo-service:latest .
```

I then tagged and pushed the updated image to ECR.

After updating the Deployment, I restarted the rollout and verified that both application Pods reached the Running state.

This helped me understand the importance of checking container image architecture compatibility when building images on a different machine from the Kubernetes worker nodes.

## Repository Structure

```text
aws-eks-kubernetes-deployment/
│
├── app/
│   ├── public/
│   │   ├── app.js
│   │   ├── index.html
│   │   └── styles.css
│   ├── src/
│   │   ├── routes/
│   │   └── utils/
│   ├── config.js
│   ├── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
│
├── screenshots/
│
├── .gitignore
└── README.md
```

*Note: The structure above reflects the main project components. Adjust filenames if your local application differs.*

## Key Learnings

Working through this project gave me a better understanding of how Docker and Kubernetes fit together in a cloud environment.

Some of my main takeaways were:

- Understanding the complete journey from application code to a running container in Kubernetes.
- Working with Amazon ECR as a private container registry.
- Understanding the relationship between the EKS control plane and EC2 worker nodes.
- Learning how Kubernetes Deployments maintain the desired number of replicas.
- Understanding how Services provide stable access to application Pods.
- Troubleshooting image-pull failures and architecture compatibility issues.
- Using `kubectl` to inspect resources, monitor deployments and investigate errors.

## Future Improvements

This project focuses on the fundamentals of containerization and Kubernetes deployment. There are several improvements I would like to explore in future iterations:

- Implement CI/CD using GitHub Actions.
- Configure an Ingress Controller for external application access.
- Introduce Horizontal Pod Autoscaling.
- Add application monitoring using Prometheus and Grafana.
- Implement HTTPS using AWS-managed certificates.
- Explore Kubernetes resource requests, limits and health probes.

## Cleanup

Cloud resources can continue generating charges even when an application is no longer being used.

After completing the project, I cleaned up the Kubernetes deployment and initiated deletion of the EKS cluster.

For future deployments, the cluster can be removed using:

```bash
eksctl delete cluster \
  --name k8s-demo-cluster \
  --region ap-southeast-2
```

ECR repositories and any other separately created resources should also be checked and deleted if they are no longer required.

---

## Final Thoughts

This project helped me move beyond simply learning Kubernetes concepts and actually work with the deployment process on AWS.

From building the Docker image to getting the application running on EKS, I got to experience how different cloud services and Kubernetes components work together.

More importantly, troubleshooting the deployment issues taught me how to investigate problems using Kubernetes events, Pod descriptions and Docker image metadata.

This is one of the projects through which I'm building my practical Cloud and DevOps engineering skills.

**Project:** ShopEase – Kubernetes Application Deployment on AWS EKS

**Repository:** [aws-eks-kubernetes-deployment](https://github.com/KHYATI-150/aws-eks-kubernetes-deployment)
