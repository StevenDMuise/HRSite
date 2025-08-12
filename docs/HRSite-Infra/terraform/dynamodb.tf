variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table for job applications"
  type        = string
  default     = "JobApplications"
}

resource "aws_dynamodb_table" "job_applications" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Environment = "production"
    Project     = "HRSite"
  }
}
