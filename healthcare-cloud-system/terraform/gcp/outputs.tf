output "dataproc_cluster_name" {
  value = google_dataproc_cluster.flink_cluster.name
}

output "cloudsql_connection" {
  value = google_sql_database_instance.analytics.connection_name
}

output "gcs_bucket_name" {
  value = google_storage_bucket.backup.name
}
