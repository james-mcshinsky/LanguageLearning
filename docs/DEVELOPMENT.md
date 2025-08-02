# Development Guide

## Repository Structure
- `backend/` – TypeScript Express API server
- `frontend/` – React web client built with Vite
- `infra/` – Terraform configuration for AWS deployment
- `docs/` – Project documentation and developer guides

## Local Development

### 1. Clone the repository
```bash
git clone <repo-url>
cd LanguageLearning
```

### 2. Install dependencies

**Python modules**
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
```

**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd frontend
npm install
```

### 3. Start Docker services
```bash
docker-compose up -d
```

### 4. Run development servers

**Backend**
```bash
cd backend
npm run dev
```

**Frontend**
```bash
cd frontend
npm run dev
```

## Testing and Linting

### Backend
```bash
npm test
npm run lint
```

### Frontend
```bash
npm test
npm run lint
```

### Python modules
```bash
pytest
```

## CI/CD Pipeline

GitHub Actions (or a similar CI service) can be configured to:
1. Install dependencies for each component.
2. Run linting and tests for backend, frontend, and Python modules.
3. Build and publish Docker images.
4. Execute Terraform in the `infra/` directory to provision infrastructure.

## Terraform Deployment
```bash
cd infra
terraform init
terraform plan
terraform apply
```

## AWS Prerequisites
- AWS account and IAM credentials with necessary permissions.
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured (`aws configure`).
- [Terraform](https://developer.hashicorp.com/terraform/downloads) installed locally.
- Optional: S3 bucket and DynamoDB table for Terraform remote state locking.
