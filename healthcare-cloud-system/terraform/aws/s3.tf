resource "aws_s3_bucket" "medical_documents" {
  bucket = "${var.project_name}-medical-docs-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = "${var.project_name}-medical-documents"
    Environment = var.environment
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket_versioning" "medical_documents" {
  bucket = aws_s3_bucket.medical_documents.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_notification" "lambda_trigger" {
  bucket = aws_s3_bucket.medical_documents.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.document_processor.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".pdf"
  }

  depends_on = [aws_lambda_permission.allow_s3]
}
