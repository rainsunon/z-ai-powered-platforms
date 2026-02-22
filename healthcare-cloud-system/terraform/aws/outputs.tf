output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "rds_endpoint" {
  value = aws_db_instance.postgresql.endpoint
}

output "msk_bootstrap_brokers" {
  value = aws_msk_cluster.kafka.bootstrap_brokers_tls
}

output "s3_bucket_name" {
  value = aws_s3_bucket.medical_documents.id
}
