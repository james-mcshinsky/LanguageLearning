output "backend_url" {
  description = "URL for the backend ECS service."
  value       = "https://api.${var.domain_name}"
}
