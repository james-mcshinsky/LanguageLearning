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

module "cloudfront" {
  source       = "./modules/cloudfront"
  asset_bucket = aws_s3_bucket.assets.bucket
}

module "ecs" {
  source        = "./modules/ecs"
  backend_image = var.backend_image
}
