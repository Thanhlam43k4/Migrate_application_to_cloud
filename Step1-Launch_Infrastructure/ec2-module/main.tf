resource "aws_security_group" "sg_aws" {
  name        = "security-group-public"
  description = "allow http ssh https traffic to ec2"
  vpc_id      = var.vpc_id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"  ]
  }
  egress{
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_instance" "ec2_public1" {
    ami = var.ami_id
    instance_type = var.instance_type
    subnet_id = var.public_subnet1_id
    availability_zone = var.availability_zone[0]
    vpc_security_group_ids = [aws_security_group.sg_aws.id]
    key_name = var.key_id

    user_data = file(var.user-data)
    tags = {
        Name = "Ec2-instance"
    }
}
resource "aws_instance" "ec2_public2" {
    ami = var.ami_id
    instance_type = var.instance_type
    subnet_id = var.public_subnet2_id
    availability_zone = var.availability_zone[1]
    vpc_security_group_ids = [aws_security_group.sg_aws.id]
    key_name = var.key_id
    
    user_data = file(var.user-data)
    tags = {
        Name = "Ec2-instance"
    }
}
