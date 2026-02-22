resource "google_sql_database_instance" "analytics" {
  name             = "${var.project_name}-analytics-db"
  database_version = "POSTGRES_15"
  region           = var.gcp_region

  settings {
    tier = "db-f1-micro"

    ip_configuration {
      ipv4_enabled    = true
      authorized_networks {
        name  = "all"
        value = "0.0.0.0/0"
      }
    }

    backup_configuration {
      enabled = true
    }
  }

  deletion_protection = false
}

resource "google_sql_database" "analytics_db" {
  name     = "analytics"
  instance = google_sql_database_instance.analytics.name
}

resource "google_sql_user" "analytics_user" {
  name     = "analytics"
  instance = google_sql_database_instance.analytics.name
  password = random_password.gcp_db_password.result
}

resource "random_password" "gcp_db_password" {
  length  = 16
  special = false
}
