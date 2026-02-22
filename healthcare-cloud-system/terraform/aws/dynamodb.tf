resource "aws_dynamodb_table" "sessions" {
  name           = "${var.project_name}-sessions"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "session_id"

  attribute {
    name = "session_id"
    type = "S"
  }

  ttl {
    attribute_name = "expiry"
    enabled        = true
  }

  tags = {
    Name        = "${var.project_name}-sessions"
    Environment = var.environment
  }
}

resource "aws_dynamodb_table" "notifications" {
  name           = "${var.project_name}-notifications"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "notification_id"

  attribute {
    name = "notification_id"
    type = "S"
  }

  tags = {
    Name        = "${var.project_name}-notifications"
    Environment = var.environment
  }
}
