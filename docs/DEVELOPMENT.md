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

## COCA Vocabulary Fallback

During development, the Python modules default to the five most frequent words
from the Corpus of Contemporary American English—"you", "i", "the", "to", and
"a"—when no vocabulary list is supplied. This keeps demos and tests working
even before your own data is available.

```python
from language_learning.ai_lessons import generate_lesson
from language_learning import get_top_coca_words

lesson = generate_lesson()
assert lesson["vocabulary"] == get_top_coca_words()
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

## Python service integration

Some learning features are implemented in Python and exposed through a
FastAPI microservice located in `src/language_learning/api.py`. Start the
service locally with:

```bash
uvicorn language_learning.api:app --reload --port 8000
```

Node-based services communicate with this process via HTTP (configure the
`PY_SERVICE_URL` environment variable if the service is not on
`http://localhost:8000`). The lesson service then exposes endpoints under
`/lesson` such as `/vocabulary`, `/prompts`, and `/blurb` for the front-end.
