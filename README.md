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
   docker build -t language-learning-frontend ./frontend
   ```
   Push the images to a registry such as Amazon ECR or Docker Hub. For ECR, log
   in with `aws ecr get-login-password | docker login` and push the tagged
   images. Update image tags in `infra/terraform.tfvars` if necessary.

3. **Provision infrastructure**
   ```bash
   cd infra
   terraform init       # download providers/modules
   terraform plan       # review changes
   terraform apply      # create or update AWS resources
   ```
   Adjust values in `infra/terraform.tfvars` (region, domain, scaling options)
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
   - Create a workflow triggered on pushes to `main` that:
     1. Runs `pytest`.
     2. Builds and pushes Docker images.
     3. Executes `terraform apply` in the `infra/` directory to redeploy using
        the new images.
   - Store AWS credentials and registry logins as encrypted secrets in the
     repository settings.

6. **Set up DNS and SSL**
   - Use Route 53 to manage your domain and create an alias record to the
     CloudFront distribution or load balancer.
   - Provision certificates with AWS Certificate Manager and reference them in
     Terraform for HTTPS support.

## Contribution Guidelines

This project is private and does not accept external contributions.
