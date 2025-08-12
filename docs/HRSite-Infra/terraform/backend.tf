terraform {
  backend "s3" {
    bucket = "hrsite-terraform-state"
    key    = "dev/terraform.tfstate"
    region = "us-east-1"
  }
}
