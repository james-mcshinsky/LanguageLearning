output "domain_name" {
  description = "CloudFront distribution domain name."
  value       = aws_cloudfront_distribution.this.domain_name
}

output "oai_iam_arn" {
  description = "IAM ARN of the CloudFront origin access identity."
  value       = aws_cloudfront_origin_access_identity.oai.iam_arn
}
