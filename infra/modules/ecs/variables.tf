variable "domain_name" {
  description = "Root domain for the application."
  type        = string
}

variable "backend_image" {
  description = "ECR image URI for the backend service."
  type        = string
}
