#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}GitHub CLI (gh) is not installed. Please install it first:${NC}"
    echo "brew install gh"
    exit 1
fi

# Check if logged in to GitHub
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}Please login to GitHub CLI:${NC}"
    gh auth login
fi

echo -e "${YELLOW}Adding secrets to GitHub repository...${NC}"

# Add AWS_ROLE_ARN
echo -e "${GREEN}Adding AWS_ROLE_ARN...${NC}"
gh secret set AWS_ROLE_ARN --body "arn:aws:iam::176448595866:role/github-actions-hrsite-dev"

# Add AWS_ACCOUNT_ID
echo -e "${GREEN}Adding AWS_ACCOUNT_ID...${NC}"
gh secret set AWS_ACCOUNT_ID --body "176448595866"

# Add CLOUDFRONT_DISTRIBUTION_ID
echo -e "${GREEN}Adding CLOUDFRONT_DISTRIBUTION_ID...${NC}"
gh secret set CLOUDFRONT_DISTRIBUTION_ID --body "E37CWTU5G7JFQ2"

echo -e "${GREEN}✅ All secrets have been added successfully!${NC}"
echo
echo -e "${YELLOW}Verify the secrets at:${NC}"
echo "https://github.com/StevenDMuise/HRSite/settings/secrets/actions"
