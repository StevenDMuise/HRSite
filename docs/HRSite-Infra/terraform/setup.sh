#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Starting HRSite infrastructure setup...${NC}"

# Check AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}Terraform is not installed. Please install it first.${NC}"
    exit 1
fi

# Check AWS credentials
echo -e "${YELLOW}Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

# Create S3 bucket for Terraform state
echo -e "${YELLOW}Creating S3 bucket for Terraform state...${NC}"
if ! aws s3 mb s3://hrsite-terraform-state --region us-east-1 2>/dev/null; then
    echo -e "${YELLOW}Bucket already exists, continuing...${NC}"
fi

# Enable versioning on the bucket
echo -e "${YELLOW}Enabling versioning on S3 bucket...${NC}"
aws s3api put-bucket-versioning \
    --bucket hrsite-terraform-state \
    --versioning-configuration Status=Enabled

# Create backend configuration
echo -e "${YELLOW}Creating backend configuration...${NC}"
cat > backend.tf << EOL
terraform {
  backend "s3" {
    bucket = "hrsite-terraform-state"
    key    = "dev/terraform.tfstate"
    region = "us-east-1"
  }
}
EOL

# Initialize Terraform
echo -e "${YELLOW}Initializing Terraform...${NC}"
cd "$(dirname "$0")"
terraform init

# Apply Terraform configuration
echo -e "${YELLOW}Applying Terraform configuration...${NC}"
terraform apply -auto-approve

# Get outputs
ROLE_ARN=$(terraform output -raw github_actions_role_arn)
CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id)
ACCOUNT_ID=$(terraform output -raw account_id)

echo -e "${GREEN}Setup complete!${NC}"
echo
echo -e "${YELLOW}Add the following secrets to your GitHub repository:${NC}"
echo
echo -e "${GREEN}AWS_ROLE_ARN:${NC} $ROLE_ARN"
echo -e "${GREEN}AWS_ACCOUNT_ID:${NC} $ACCOUNT_ID"
echo -e "${GREEN}CLOUDFRONT_DISTRIBUTION_ID:${NC} $CLOUDFRONT_ID"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Add these secrets to your GitHub repository at https://github.com/StevenDMuise/HRSite/settings/secrets/actions"
echo "2. Push your code to the main branch to trigger the deployment"
echo "3. Monitor the GitHub Actions workflow at https://github.com/StevenDMuise/HRSite/actions"
