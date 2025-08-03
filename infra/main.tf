terraform {
  required_version = ">= 1.5.0"

  backend "s3" {
    bucket         = var.backend_state_bucket
    key            = "terraform.tfstate"
    region         = var.region
    dynamodb_table = var.lock_table
    encrypt        = true
  }
}

provider "aws" {
  region = var.region
}











