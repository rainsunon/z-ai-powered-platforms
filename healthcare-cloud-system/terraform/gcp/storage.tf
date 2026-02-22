resource "google_storage_bucket" "backup" {
  name          = "${var.project_name}-backup-${random_id.gcs_suffix.hex}"
  location      = var.gcp_region
  force_destroy = true

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }
}

resource "random_id" "gcs_suffix" {
  byte_length = 4
}
