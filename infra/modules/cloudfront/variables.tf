variable "domain_name" {
  description = "Domain name for the CloudFront distribution."
  type        = string
}

variable "asset_bucket" {
  description = "S3 bucket containing static assets."
  type        = string
}

variable "acm_certificate_arn" {
  description = "ARN of the ACM certificate for HTTPS."
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for DNS records."
  type        = string
}
