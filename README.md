# LanguageLearning

**This project is private and proprietary.**

## Project Description

LanguageLearning provides resources and example code for building tools that make learning new languages more engaging. The repository now includes modular components for vocabulary extraction, spaced-repetition scheduling, AI-driven lesson generation, and basic media integration.

## Repository Structure

- `backend/` – TypeScript Express API server
- `frontend/` – React web client built with Vite
- `infra/` – Terraform configuration for AWS deployment
- `docs/` – Additional project documentation

## Setup Requirements

To get started, you will need:

- Python 3.10+
- `pip` for managing packages

Create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
```

### Dependencies

This project manages packages with `requirements.txt`. Key libraries include:

- `openai` for AI-driven lesson generation
- `nltk` for basic natural language processing
- `spacy` for advanced language processing
- `requests` for media and API integration
- `pytest` for running the test suite

## Usage Examples

Each module includes a small example when executed directly:

```bash
PYTHONPATH=src python -m language_learning.vocabulary
PYTHONPATH=src python -m language_learning.spaced_repetition
PYTHONPATH=src python -m language_learning.ai_lessons
PYTHONPATH=src python -m language_learning.media_integration
```

You can also import the modules in your own scripts:

```python
from language_learning import (
    extract_vocabulary,
    SpacedRepetitionScheduler,
    generate_lesson,
    suggest_media,
)
```

## Running Tests

This project uses [`pytest`](https://docs.pytest.org/) for its unit tests. The
tests reside in the `tests/` directory. After installing the dependencies, run
the entire test suite with:

```bash
pytest
```

## Development Guide

Instructions for local development, Docker usage, CI/CD, and deployment are documented in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Deployment & Hosting

This project can be deployed automatically from GitHub. The repository includes
Terraform configuration for provisioning AWS resources, but you can also use
simpler managed services depending on your needs.

### Deploying to AWS with Terraform

1. **Prerequisites**
   - [Docker](https://www.docker.com/) for building container images.
   - [Terraform](https://developer.hashicorp.com/terraform/downloads) installed locally.
   - An AWS account with credentials configured in your environment
     (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`).

2. **Build and push Docker images**
   ```bash
   docker build -t language-learning-backend ./backend
   docker build -t language-learning-frontend --build-arg VITE_API_URL="https://backend.example.com" ./frontend
   ```
   Replace `https://backend.example.com` with your backend's public endpoint.
   Push the images to a registry such as Amazon ECR or Docker Hub. For ECR, log
   in with `aws ecr get-login-password | docker login` and push the tagged
   images. Update image tags in `infra/terraform.tfvars` (copy from the example file) if necessary.

3. **Provision infrastructure**
   ```bash
   cd infra
   terraform init       # download providers/modules
   terraform plan       # review changes
   terraform apply      # create or update AWS resources
   ```
   Adjust values in `infra/terraform.tfvars` (see `terraform.tfvars.example` for template)
   to match your environment. The Terraform code sets up an ECS Fargate cluster
   for containers, an RDS PostgreSQL instance, networking components, and an
   S3/CloudFront distribution for the front end.

4. **Configure application**
   - Store sensitive values (API keys, database URLs, etc.) in AWS Secrets
     Manager or SSM Parameter Store and reference them in the Terraform
     configuration.
   - Set environment variables for the backend and any worker services in the
     ECS task definitions.

5. **Automate with GitHub Actions**
   - This repository includes `.github/workflows/deploy.yml`, which builds the
     backend and frontend, pushes the backend image to Amazon ECR, forces a new
     ECS deployment, and uploads the compiled frontend to S3 whenever changes
     are pushed to `main`.
   - Define the following repository secrets so the workflow can authenticate
     with AWS:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
     - Optionally `AWS_REGION`, `ECR_REPOSITORY`, `ECS_CLUSTER`, `ECS_SERVICE`,
       and `S3_BUCKET` to override the default values (`us-west-2`,
       `language-learning-backend`, `backend-cluster`, `backend-service`, and
       `languagelearning-static-assets-jm-2025`) in the workflow.

6. **Set up DNS and SSL**
   - Use Route 53 to manage your domain and create an alias record to the
     CloudFront distribution or load balancer.
   - Provision certificates with AWS Certificate Manager and reference them in
     Terraform for HTTPS support.

### Continuous Deployment to AWS

Pushing to the `main` branch triggers the GitHub Actions workflow at
`.github/workflows/deploy.yml`. The workflow:

1. Checks out the repository and configures AWS credentials.
2. Builds the backend Docker image, pushes it to ECR, and forces ECS to deploy
   the new image.
3. Builds the frontend bundle and uploads it to the specified S3 bucket.

Customize environment variables in the workflow file or override them with
repository secrets to match your AWS resources. When secrets and variables are
set correctly, each commit to `main` results in a fresh deployment to AWS.

### Full AWS Deployment Walkthrough

1. **Prerequisites**
   - Create an AWS account and set up an IAM user or role with appropriate permissions.
   - Configure the AWS CLI with `aws configure` and ensure credentials are available as environment variables.
   - Install Docker and Terraform on your local machine.

2. **Containerization**
   - Build and tag Docker images for the backend and frontend services.
   - Create Amazon ECR repositories and push the images. For example:
     ```bash
     aws ecr create-repository --repository-name language-learning-backend
     aws ecr create-repository --repository-name language-learning-frontend
     docker build -t language-learning-backend ./backend
     docker tag language-learning-backend:latest <account>.dkr.ecr.<region>.amazonaws.com/language-learning-backend:latest
     docker push <account>.dkr.ecr.<region>.amazonaws.com/language-learning-backend:latest
     ```

3. **Infrastructure Provisioning with Terraform**
   - Copy `infra/terraform.tfvars.example` to `infra/terraform.tfvars` and edit to define region, VPC CIDR blocks, database settings, and other options.
   - Run the following commands:
     ```bash
     cd infra
     terraform init
     terraform plan
     terraform apply
     ```

4. **ECS & RDS Configuration**
   - ECS services pull the container images from ECR and use environment variables defined in the task definitions.
   - Connect services to the RDS database and store secrets in AWS Secrets Manager or SSM Parameter Store.

5. **DNS & SSL Setup**
   - Create a Route 53 hosted zone and point your domain to the load balancer or CloudFront distribution.
   - Provision certificates with AWS Certificate Manager and reference them in Terraform for HTTPS.

6. **Verification & Troubleshooting**
   - Check ECS task logs and service health:
     ```bash
     aws logs tail /aws/ecs/language-learning-backend --follow
     ```
   - Run database migrations or other startup tasks as needed.

7. **Automation**
   - Set up a GitHub Actions workflow that runs tests, builds and pushes images, and triggers `terraform apply` when changes are merged into `main`.

Following this walkthrough, you can deploy the application to AWS using Terraform, ECS/Fargate, RDS, Route 53, and CloudFront with optional CI/CD via GitHub Actions.

## Contribution Guidelines

This project is private and does not accept external contributions.
