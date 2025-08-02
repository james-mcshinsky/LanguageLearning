# Infrastructure

Terraform configuration for deploying LanguageLearning services to AWS lives in this directory.

## Usage
```bash
cd infra
terraform init
terraform plan
terraform apply
```

Ensure AWS credentials are configured before running Terraform commands. See [../docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md#aws-prerequisites) for required prerequisites.
