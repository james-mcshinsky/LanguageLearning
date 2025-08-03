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

resource "aws_s3_bucket" "assets" {
  bucket = var.asset_bucket
}

resource "aws_dynamodb_table" "data" {
  name         = var.data_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"

  attribute {
    name = "pk"
    type = "S"
  }
}

module "cloudfront" {
  source              = "./modules/cloudfront"
  asset_bucket        = aws_s3_bucket.assets.bucket
  root_domain         = var.root_domain
  acm_certificate_arn = var.acm_certificate_arn
}

module "ecs" {
  source          = "./modules/ecs"
  backend_image   = var.backend_image
  region          = var.region
  data_table_name = aws_dynamodb_table.data.name
  data_table_arn  = aws_dynamodb_table.data.arn

  # inject the VPC CIDR and root domain into the module
  vpc_cidr    = var.vpc_cidr
  root_domain = var.root_domain
}
