# Launch Cloud Infrastructure with Terraform


**VPC Description**


- CIDR_BLOCK: 12.0.0.0/16

* Availability_Zone: 
  
  - "ap-northeast-1a"

    + Public_Subnet: 12.0.1.0/24

    + Private_Subnet: 12.0.2.0/24

  - "ap-northeast-1c"

    + Public_Subnet: 12.0.3.0/24

    + Private_Subnet: 12.0.4.0/24

- Route_Table for 2 Public_subnet in 2 Availability_Zone

- Internet_GateWay: For 2 router

**EC2 Description**

- Security_Group: 8080, 3000 ,80 tcp 22 ssh from outside 


**Role in IAM**

- Attach **AmazonRDSFullAccess** to 2 ec2 instances for it can access to RDS database 

instance