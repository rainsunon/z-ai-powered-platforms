terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  # Optional: Use S3 backend for state management
  # backend "s3" {
  #   bucket = "shortlink-terraform-state"
  #   key    = "terraform.tfstate"
  #   region = "us-west-2"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "shortlink-platform"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  cluster_name    = var.cluster_name
  environment     = var.environment
  vpc_cidr        = var.vpc_cidr
  availability_zones = data.aws_availability_zones.available.names

  tags = local.common_tags
}

# IAM Module
module "iam" {
  source = "./modules/iam"

  cluster_name = var.cluster_name
  environment  = var.environment

  tags = local.common_tags
}

# EKS Module
module "eks" {
  source = "./modules/eks"

  cluster_name    = var.cluster_name
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnet_ids
  public_subnets  = module.vpc.public_subnet_ids

  node_groups = {
    general = {
      desired_size = 2
      min_size     = 1
      max_size     = 4
      instance_types = ["t3.medium"]
    }
  }

  cluster_version = var.eks_cluster_version

  tags = local.common_tags

  depends_on = [module.iam]
}

# RDS Module
module "rds" {
  source = "./modules/rds"

  cluster_name = var.cluster_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
  subnet_ids   = module.vpc.private_subnet_ids
  vpc_cidr     = var.vpc_cidr

  db_name     = var.rds_db_name
  db_username = var.rds_username
  db_password = var.rds_password

  instance_class    = var.rds_instance_class
  allocated_storage = var.rds_allocated_storage

  tags = local.common_tags
}

# Kinesis Module (Alternative to Kafka)
module "kinesis" {
  source = "./modules/kinesis"

  cluster_name = var.cluster_name
  environment  = var.environment

  stream_name         = var.kinesis_stream_name
  shard_count         = var.kinesis_shard_count
  retention_period_hours = var.kinesis_retention_period_hours

  tags = local.common_tags
}

# ElastiCache Redis Module (Optional)
module "redis" {
  source = "./modules/redis"

  cluster_name = var.cluster_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
  subnet_ids   = module.vpc.private_subnet_ids
  vpc_cidr     = var.vpc_cidr

  node_type           = var.redis_node_type
  num_cache_nodes     = var.redis_num_cache_nodes
  parameter_group_name = var.redis_parameter_group_name

  tags = local.common_tags

  count = var.enable_redis ? 1 : 0
}

# Outputs
output "eks_cluster_id" {
  description = "EKS cluster ID"
  value       = module.eks.cluster_id
}

output "eks_cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "kinesis_stream_arn" {
  description = "Kinesis Data Stream ARN"
  value       = module.kinesis.stream_arn
}

output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = var.enable_redis ? module.redis[0].endpoint : null
  sensitive   = true
}

locals {
  common_tags = {
    Project     = "shortlink-platform"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
