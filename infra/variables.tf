variable "region" {
  description = "AWS region to deploy resources in."
  type        = string
}

variable "backend_state_bucket" {
  description = "S3 bucket used for Terraform remote state."
  type        = string
}

variable "lock_table" {
  description = "DynamoDB table for Terraform state locking."
  type        = string
}

variable "backend_image" {
  description = "ECR image URI for the backend."
  type        = string
}

variable "frontend_image" {
  description = "ECR image URI for the frontend."
  type        = string
}

variable "domain_name" {
  description = "Root domain for the application."
  type        = string
}

variable "hosted_zone_id" {
  description = "Route 53 hosted zone ID."
  type        = string
}

variable "acm_certificate_arn" {
  description = "ARN of the ACM certificate for CloudFront."
  type        = string
}

variable "db_name" {
  description = "Name of the RDS database."
  type        = string
}

variable "db_username" {
  description = "Username for the RDS database."
  type        = string
}

variable "db_password" {
  description = "Password for the RDS database."
  type        = string
  sensitive   = true
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
}

variable "asset_bucket" {
  description = "S3 bucket name for static assets."
  type        = string
}
