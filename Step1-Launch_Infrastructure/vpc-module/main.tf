resource "aws_vpc" "vpc_custom" {
  cidr_block = var.cidr_block
  tags = {
    Name = "vpc-custom"
  }
}
resource "aws_subnet" "public_subnet1" {
  vpc_id                  = aws_vpc.vpc_custom.id
  cidr_block              = var.public_subnet[0]
  availability_zone       = var.availability_zone[0]
  map_public_ip_on_launch = true
  tags = {
    Name = "Public Subnet1"
  }
}
resource "aws_subnet" "public_subnet2"{
  vpc_id = aws_vpc.vpc_custom.id
  cidr_block = var.public_subnet[1]
  availability_zone = var.availability_zone[1]
  map_public_ip_on_launch = true
  tags = {
    Name = "Public Subnet2"
  }
}

resource "aws_subnet" "private_subnet1" {
  vpc_id            = aws_vpc.vpc_custom.id
  cidr_block        = var.private_subnet[0]
  availability_zone = var.availability_zone[0]
  tags = {
    Name = "Private Subnet1"
  }
}
resource "aws_subnet" "private_subnet2" {
  vpc_id            = aws_vpc.vpc_custom.id
  cidr_block        = var.private_subnet[1]
  availability_zone = var.availability_zone[1]
  tags = {
    Name = "Private Subnet2"
  }
}
resource "aws_subnet" "private_subnet3" {
  vpc_id            = aws_vpc.vpc_custom.id
  cidr_block        = var.private_subnet[2]
  availability_zone = var.availability_zone[2]
  tags = {
    Name = "Private Subnet3"
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
    subnet_id = aws_subnet.public_subnet1.id
    route_table_id = aws_route_table.rtb-public.id
}
resource "aws_route_table_association" "rtb-public1"{
    subnet_id = aws_subnet.public_subnet2.id
    route_table_id = aws_route_table.rtb-public.id
}
