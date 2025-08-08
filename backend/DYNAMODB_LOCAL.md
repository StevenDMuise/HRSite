# DynamoDB Local Setup for Development

This backend uses DynamoDB for persistent storage. For local development, you can use DynamoDB Local.

## Running DynamoDB Local

You can run DynamoDB Local using Docker:

```sh
docker run -d -p 8000:8000 --name dynamodb-local amazon/dynamodb-local
```

## Environment Variables

Add the following to your `.env` file for local development:

```
DYNAMODB_TABLE=JobApplications
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
AWS_SAM_LOCAL=true
```

## Table Creation

You must create the table before running the backend. Use the AWS CLI:

```sh
aws dynamodb create-table \
  --table-name JobApplications \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000
```

## Infrastructure as Code

For cloud deployment, all DynamoDB table definitions and other infrastructure should be stored in the `HRSite-Infra` repository using CloudFormation, SAM, or Terraform. Do not store IaC in this repo.

---

For more details, see the `HRSite-Infra` repository.
