region               = "us-east-1"
backend_state_bucket = "ll-terraform-state"
lock_table           = "ll-terraform-locks"

backend_image  = "123456789012.dkr.ecr.us-east-1.amazonaws.com/ll-backend:latest"
frontend_image = "123456789012.dkr.ecr.us-east-1.amazonaws.com/ll-frontend:latest"

domain_name         = "example.com"
hosted_zone_id      = "Z1234567890"
acm_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/abc-123"

db_name     = "languagedb"
db_username = "admin"
db_password = "CHANGE_ME"

vpc_cidr     = "10.0.0.0/16"
asset_bucket = "ll-assets"
