output "backend_url" {
  description = "URL for the backend ECS service."
  value       = aws_lb.this.dns_name
}
