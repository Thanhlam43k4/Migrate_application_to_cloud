provider "aws" {
  region = "ap-northeast-1"
}
module "vpc" {
  source            = "./vpc-module"
  cidr_block        = "12.0.0.0/16"
  public_subnet     = ["12.0.1.0/24","12.0.3.0/24"]
  private_subnet    = ["12.0.2.0/24","12.0.4.0/24","12.0.5.0/24"]
  availability_zone = ["ap-northeast-1a","ap-northeast-1c","ap-northeast-1d"]
  
}

module "ec2" {
  source            = "./ec2-module"
  vpc_id            = module.vpc.vpc_id
  ami_id            = "ami-0ab3794db9457b60a"
  instance_type     = "t2.micro"
  key_id            = "to-do-key"
  public_subnet1_id  = module.vpc.public_subnet1_id
  public_subnet2_id =  module.vpc.public_subnet2_id
  availability_zone = ["ap-northeast-1a","ap-northeast-1c"]
  user-data = "user-data.sh"
}
output "public_ip1" {
  value = module.ec2.public_ip1
}

output "public_ip2"{
  value = module.ec2.public_ip2
}