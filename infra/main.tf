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

module "network" {
  source = "./modules/network"

  vpc_cidr = var.vpc_cidr
}

module "ecr" {
  source = "./modules/ecr"

  backend_image  = var.backend_image
  frontend_image = var.frontend_image
}

module "ecs" {
  source = "./modules/ecs"

  cluster_name    = "language-learning-cluster"
  backend_image   = var.backend_image
  frontend_image  = var.frontend_image
  desired_count   = 2
  vpc_id          = module.network.vpc_id
  private_subnets = module.network.private_subnets
}

module "rds" {
  source = "./modules/rds"

  db_name     = var.db_name
  username    = var.db_username
  password    = var.db_password
  subnet_ids  = module.network.private_subnets
  vpc_id      = module.network.vpc_id
}

module "s3" {
  source = "./modules/s3"

  bucket_name = var.asset_bucket
}

module "cloudfront" {
  source = "./modules/cloudfront"

  origin_bucket = module.s3.bucket_id
  domain_name   = var.domain_name
  acm_cert_arn  = var.acm_certificate_arn
}

module "route53" {
  source = "./modules/route53"

  zone_id        = var.hosted_zone_id
  domain_name    = var.domain_name
  cloudfront_dns = module.cloudfront.domain_name
}

module "acm" {
  source = "./modules/acm"

  domain_name = var.domain_name
}

module "secrets_manager" {
  source = "./modules/secrets"

  db_password = var.db_password
}

module "ssm_parameters" {
  source = "./modules/ssm"

  parameters = {
    DB_USERNAME = var.db_username
    DB_PASSWORD = var.db_password
  }
}

module "dynamodb" {
  source = "./modules/dynamodb"

  table_name = var.lock_table
}
