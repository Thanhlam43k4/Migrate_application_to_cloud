# Load Balancer Setup

This README file provides instructions for setting up two Application Load Balancers (ALBs) on AWS: one for frontend services (`frontendBalancer`) and another for backend services (`backendBalancer`). 

## Architecture

### Frontend Load Balancer (`frontendBalancer`)

- **Listener**: Port 80
- **Target**: Port 3000 (Frontend Service)

### Backend Load Balancer (`backendBalancer`)

- **Listener**: Ports 8003, 8001, 8002
- **Targets**:
  - **Customer Service**: Port 8003
  - **Product Service**: Port 8001
  - **Shopping Service**: Port 8002

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. Terraform installed (if using Infrastructure as Code)

## Steps to Set Up ALBs

### 1. Create Target Groups

Create target groups for each service to define the destination for the load balancer.

#### Frontend Target Group

```sh
aws elbv2 create-target-group \
    --name frontend-target-group \
    --protocol HTTP \
    --port 3000 \
    --vpc-id <your-vpc-id> \
    --target-type instance

