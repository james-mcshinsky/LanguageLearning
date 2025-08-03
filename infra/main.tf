terraform {
  required_version = ">= 1.5.0"

  backend "s3" {
    bucket         = var.backend_state_bucket
    key            = "terraform.tfstate"
    region         = var.region
    dynamodb_table = var.lock_table
    encrypt        = true
  }
}

provider "aws" {
  region = var.region
}

module "cloudfront" {
  source              = "./modules/cloudfront"
  domain_name         = var.domain_name
  hosted_zone_id      = var.hosted_zone_id
  acm_certificate_arn = var.acm_certificate_arn
  asset_bucket        = var.asset_bucket
}

module "ecs" {
  source        = "./modules/ecs"
  domain_name   = var.domain_name
  backend_image = var.backend_image
}
