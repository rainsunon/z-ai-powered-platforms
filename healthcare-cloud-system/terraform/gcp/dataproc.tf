resource "google_dataproc_cluster" "flink_cluster" {
  name   = "${var.project_name}-flink-cluster"
  region = var.gcp_region

  cluster_config {
    master_config {
      num_instances = 1
      machine_type  = "e2-standard-2"
      disk_config {
        boot_disk_size_gb = 50  # Changed from 20 to 50 (minimum 30, using 50 for safety)
      }
    }

    worker_config {
      num_instances = 2
      machine_type  = "e2-standard-2"
      disk_config {
        boot_disk_size_gb = 50  # Changed from 20 to 50
      }
    }

    software_config {
      image_version = "2.1-debian11"
      optional_components = ["FLINK"]
    }

    gce_cluster_config {
      #zone         = "asia-south1-c"
      subnetwork = google_compute_subnetwork.subnet.name  # Added explicit subnetwork
      
      tags = ["flink-cluster"]
      
      # Add internal IP only configuration
      internal_ip_only = false
    }
  }
}