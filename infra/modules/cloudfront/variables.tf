variable "asset_bucket_domain_name" {
  description = "S3 bucket regional domain name for static assets."
  type        = string
}

variable "root_domain" {
  description = "Root domain for the CloudFront distribution."
  type        = string
}

variable "acm_certificate_arn" {
  description = "ARN of the ACM certificate for the distribution."
  type        = string
}
