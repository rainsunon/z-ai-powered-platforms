variable "aws_region" {
    description = "AWS region for resources"
    type = string 
    default = "us-west-2"
}

variable "environment" {
    description = "Environment name (prod, staging, dev)"
    type = string
    default = "prod"
}

variable "cluster_name" {
    description = "EKS cluster name"
    type = string 
    default = "shortlink-eks"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "eks_cluster_version" {
  description = "Kubernetes version for EKS"
  type        = string
  default     = "1.28"
}

# RDS Variables
variable "rds_db_name" {
  description = "RDS database name"
  type        = string
  default     = "shortlink"
}

variable "rds_username" {
  description = "RDS master username"
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "rds_password" {
  description = "RDS master password"
  type        = string
  sensitive   = true
}

variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "rds_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 100
}

# Kinesis Variables
variable "kinesis_stream_name" {
  description = "Kinesis Data Stream name"
  type        = string
  default     = "shortlink-stats-events"
}

variable "kinesis_shard_count" {
  description = "Number of shards for Kinesis stream"
  type        = number
  default     = 1
}

variable "kinesis_retention_period_hours" {
  description = "Data retention period in hours"
  type        = number
  default     = 24
}

# Redis Variables
variable "enable_redis" {
  description = "Enable ElastiCache Redis"
  type        = bool
  default     = true
}

variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

variable "redis_parameter_group_name" {
  description = "ElastiCache parameter group name"
  type        = string
  default     = "default.redis7"
}