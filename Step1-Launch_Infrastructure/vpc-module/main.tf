resource "aws_vpc" "vpc_custom" {
  cidr_block = var.cidr_block
  tags = {
    Name = "vpc-custom"
  }
}
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.vpc_custom.id
  cidr_block              = var.public_subnet
  availability_zone       = var.availability_zone[0]
  map_public_ip_on_launch = true
  tags = {
    Name = "Public Subnet"
  }
}

resource "aws_subnet" "private_subnet" {
  vpc_id            = aws_vpc.vpc_custom.id
  cidr_block        = var.private_subnet
  availability_zone = var.availability_zone[1]
  tags = {
    Name = "Private Subnet"
  }
}
resource "aws_internet_gateway" "igw-custom" {
  vpc_id = aws_vpc.vpc_custom.id
  tags = {
    Name = "IGW"
  }
}
resource "aws_route_table" "rtb-public" {
  vpc_id = aws_vpc.vpc_custom.id
  route{
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw-custom.id
  }
}
resource "aws_route_table_association" "rtb-public"{
    subnet_id = aws_subnet.public_subnet.id
    route_table_id = aws_route_table.rtb-public.id
}
