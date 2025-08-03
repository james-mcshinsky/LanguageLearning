# Infrastructure

Terraform configuration for deploying LanguageLearning services to AWS lives in this directory.

## Remote state backend

Terraform stores its state in an S3 bucket and uses a DynamoDB table for state
locking. Create these resources in your AWS account before running Terraform and
ensure their names match the values you provide in `terraform.tfvars`.

```hcl
terraform {
  backend "s3" {
    bucket         = "<backend_state_bucket>"
    key            = "terraform.tfstate"
    region         = "<region>"
    dynamodb_table = "<lock_table>"
    encrypt        = true
  }
}
```

## Variables

| Name | Purpose | Example |
| --- | --- | --- |
| `region` | AWS region to deploy resources in | `us-east-1` |
| `backend_state_bucket` | S3 bucket used for Terraform remote state | `example-terraform-state` |
| `lock_table` | DynamoDB table for Terraform state locking | `example-terraform-locks` |
| `backend_image` | ECR image URI for the backend | `123456789012.dkr.ecr.us-east-1.amazonaws.com/example-backend:latest` |
| `frontend_image` | ECR image URI for the frontend | `123456789012.dkr.ecr.us-east-1.amazonaws.com/example-frontend:latest` |
| `db_name` | Name of the RDS database | `exampledb` |
| `db_username` | Username for the RDS database | `admin` |
| `db_password` | Password for the RDS database | `CHANGE_ME` |
| `vpc_cidr` | CIDR block for the VPC | `10.0.0.0/16` |
| `asset_bucket` | S3 bucket name for static assets | `example-assets` |

## `terraform.tfvars`

Copy `terraform.tfvars.example` to `terraform.tfvars` and update the values for
your environment before running Terraform.

## AWS permissions

The IAM user or role running Terraform requires permissions to manage the
resources used by this configuration, including:

- S3 (for state and static assets)
- DynamoDB (state locking)
- ECR (container images)
- CloudFront
- Route 53
- ACM
- RDS
- VPC/EC2 networking

## Usage

```bash
cd infra
terraform init
terraform plan
terraform apply
```

Ensure AWS credentials are configured before running Terraform commands. See
[../docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md#aws-prerequisites) for required
prerequisites.
