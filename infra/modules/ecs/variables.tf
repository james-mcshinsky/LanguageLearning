variable "backend_image" {
  description = "ECR image URI for the backend service."
  type        = string
}

variable "region" {
  description = "AWS region for the deployment."
  type        = string
}

variable "data_table_name" {
  description = "DynamoDB table name for application data."
  type        = string
}

variable "data_table_arn" {
  description = "ARN of the DynamoDB table for application data."
  type        = string
}
