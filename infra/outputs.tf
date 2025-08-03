output "cloudfront_domain" {
  description = "CloudFront distribution domain name."
  value       = module.cloudfront.domain_name
}

output "backend_service_url" {
  description = "URL for the backend ECS service (if exposed)."
  value       = module.ecs.backend_url
}
