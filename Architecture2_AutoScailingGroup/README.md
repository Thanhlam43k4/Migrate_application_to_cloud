# AWS Auto Scaling Group Setup

This guide provides step-by-step instructions to set up an Auto Scaling Group for EC2 instances in private subnets, an Application Load Balancer (ALB) in public subnets, and Amazon RDS with Multi-AZ deployment.

## Architecture Overview

- **Public Subnets:** 10.0.1.0/24, 10.0.2.0/24 (for ALB)
- **Private Subnets:** 10.0.3.0/24, 10.0.4.0/24 (for EC2 instances)
- **DB Subnets:** 10.0.5.0/24, 10.0.6.0/24 (for Amazon RDS)

## Prerequisites

- AWS account with necessary permissions.
- AWS CLI installed and configured.

## Steps

### Step 1: Create VPC and Subnets

1. **Create VPC:**
   - Go to the VPC Dashboard in the AWS Management Console.
   - Click on `Create VPC`.
   - Enter a name for your VPC.
   - Set the IPv4 CIDR block (e.g., `10.0.0.0/16`).
   - Click `Create`.

2. **Create Subnets:**
   - Create public subnets:
     - Go to `Subnets` in the VPC Dashboard.
     - Click `Create subnet`.
     - Select your VPC and add two public subnets (10.0.1.0/24, 10.0.2.0/24).
     - Enable `Auto-assign public IPv4 address` for these subnets.
   - Create private subnets:
     - Add two private subnets (10.0.3.0/24, 10.0.4.0/24) without auto-assigning public IPs.
   - Create DB subnets:
     - Add two DB subnets (10.0.5.0/24, 10.0.6.0/24).

### Step 2: Create Internet Gateway and Route Tables

1. **Create and Attach Internet Gateway:**
   - Go to `Internet Gateways` in the VPC Dashboard.
   - Click `Create internet gateway`.
   - Enter a name and click `Create`.
   - Attach the internet gateway to your VPC.

2. **Create Route Tables:**
   - Public route table:
     - Go to `Route Tables` in the VPC Dashboard.
     - Click `Create route table`.
     - Enter a name and select your VPC.
     - Edit the routes and add a route to the internet gateway (0.0.0.0/0).
     - Associate the public subnets with this route table.
   - Private route table:
     - Create a route table for the private subnets, if necessary, for internal routing.

### Step 3: Create Security Groups

1. **ALB Security Group:**
   - Go to `Security Groups` in the VPC Dashboard.
   - Click `Create security group`.
   - Allow inbound traffic on port 80 (HTTP) and/or port 443 (HTTPS).

2. **EC2 Instances Security Group:**
   - Create a security group for the EC2 instances.
   - Allow inbound traffic on the necessary ports (e.g., port 22 for SSH, port 80 for HTTP).
   - Allow traffic from the ALB security group.

3. **RDS Security Group:**
   - Create a security group for RDS.
   - Allow inbound traffic on port 3306 (or your database port) from the EC2 instances security group.

### Step 4: Create Application Load Balancer (ALB)

1. **Create ALB:**
   - Go to the EC2 Dashboard, then `Load Balancers`.
   - Click `Create Load Balancer`.
   - Select `Application Load Balancer`.
   - Configure the ALB with the public subnets.
   - Create listeners and target groups for your instances.

### Step 5: Create Auto Scaling Group for EC2 Instances

1. **Create Launch Template or Configuration:**
   - Go to `Launch Templates` in the EC2 Dashboard.
   - Click `Create launch template`.
   - Configure the instance details, AMI, instance type, key pair, and security group.

2. **Create Auto Scaling Group:**
   - Go to `Auto Scaling Groups` in the EC2 Dashboard.
   - Click `Create Auto Scaling group`.
   - Select the launch template or configuration.
   - Configure the group with the private subnets.
   - Set the desired capacity, minimum, and maximum number of instances.
   - Attach the Auto Scaling Group to the target group created for the ALB.

### Step 6: Create Amazon RDS with Multi-AZ Deployment

1. **Create RDS Subnet Group:**
   - Go to the RDS Dashboard.
   - Click `Subnet groups`.
   - Create a new subnet group with the DB subnets.

2. **Create RDS Instance:**
   - Click `Create database`.
   - Select your database engine.
   - Enable Multi-AZ deployment.
   - Configure the instance with the RDS subnet group, security group, and other settings.

## Conclusion

By following these steps, you will have a scalable and highly available application infrastructure on AWS, leveraging Auto Scaling Groups for EC2 instances, an ALB for load balancing, and Amazon RDS for database management.
