# VPC Configuration for Production
resource "aws_vpc" "prod_vpc" {
  cidr_block           = "172.16.0.0/16"  # Different CIDR from dev VPC
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "hrsite-prod-vpc"
    Environment = "production"
  }
}

# Public Subnets
resource "aws_subnet" "prod_public_subnets" {
  count             = 3  # Three AZs for high availability in production
  vpc_id            = aws_vpc.prod_vpc.id
  cidr_block        = "172.16.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  map_public_ip_on_launch = true

  tags = {
    Name                                           = "hrsite-prod-public-${count.index + 1}"
    Environment                                    = "production"
    "kubernetes.io/cluster/hrsite-cluster-prod"    = "shared"
    "kubernetes.io/role/elb"                       = "1"
  }
}

# Private Subnets
resource "aws_subnet" "prod_private_subnets" {
  count             = 3  # Three AZs for high availability in production
  vpc_id            = aws_vpc.prod_vpc.id
  cidr_block        = "172.16.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name                                           = "hrsite-prod-private-${count.index + 1}"
    Environment                                    = "production"
    "kubernetes.io/cluster/hrsite-cluster-prod"    = "shared"
    "kubernetes.io/role/internal-elb"              = "1"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "prod_igw" {
  vpc_id = aws_vpc.prod_vpc.id

  tags = {
    Name        = "hrsite-prod-igw"
    Environment = "production"
  }
}

# NAT Gateway
resource "aws_eip" "prod_nat" {
  count  = 3  # One NAT Gateway per AZ for high availability
  domain = "vpc"

  tags = {
    Name        = "hrsite-prod-nat-eip-${count.index + 1}"
    Environment = "production"
  }
}

resource "aws_nat_gateway" "prod_nat" {
  count         = 3  # One NAT Gateway per AZ for high availability
  allocation_id = aws_eip.prod_nat[count.index].id
  subnet_id     = aws_subnet.prod_public_subnets[count.index].id

  tags = {
    Name        = "hrsite-prod-nat-${count.index + 1}"
    Environment = "production"
  }
}

# Route Tables
resource "aws_route_table" "prod_public" {
  vpc_id = aws_vpc.prod_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.prod_igw.id
  }

  tags = {
    Name        = "hrsite-prod-public-rt"
    Environment = "production"
  }
}

resource "aws_route_table" "prod_private" {
  count  = 3  # One route table per AZ
  vpc_id = aws_vpc.prod_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.prod_nat[count.index].id
  }

  tags = {
    Name        = "hrsite-prod-private-rt-${count.index + 1}"
    Environment = "production"
  }
}

# Route Table Associations
resource "aws_route_table_association" "prod_public" {
  count          = 3
  subnet_id      = aws_subnet.prod_public_subnets[count.index].id
  route_table_id = aws_route_table.prod_public.id
}

resource "aws_route_table_association" "prod_private" {
  count          = 3
  subnet_id      = aws_subnet.prod_private_subnets[count.index].id
  route_table_id = aws_route_table.prod_private[count.index].id
}

# Security Groups
resource "aws_security_group" "prod_frontend" {
  name_prefix = "hrsite-prod-frontend-"
  vpc_id      = aws_vpc.prod_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "hrsite-prod-frontend-sg"
    Environment = "production"
  }
}

resource "aws_security_group" "prod_backend" {
  name_prefix = "hrsite-prod-backend-"
  vpc_id      = aws_vpc.prod_vpc.id

  ingress {
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.prod_frontend.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "hrsite-prod-backend-sg"
    Environment = "production"
  }
}

# Outputs
output "prod_vpc_id" {
  value = aws_vpc.prod_vpc.id
}

output "prod_public_subnet_ids" {
  value = aws_subnet.prod_public_subnets[*].id
}

output "prod_private_subnet_ids" {
  value = aws_subnet.prod_private_subnets[*].id
}

output "prod_frontend_security_group_id" {
  value = aws_security_group.prod_frontend.id
}

output "prod_backend_security_group_id" {
  value = aws_security_group.prod_backend.id
}
