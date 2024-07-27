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

#### Target Group

<img align = "center" alt = "coding" width = "600" src = "https://blogger.googleusercontent.com/img/a/AVvXsEgBtcD2PYaIGJm4XSR2LGr_jggeEJjhjzW8xIT8hET_bF3_AlOKW0D7eWqrLnig_75-m_RHYnmBse_1ht9pYwDEl6dCIv4H0C4qboRXnTQwRHo0isEBTAzkLXcyayVS_emETGCKNfwHJF5eD9E2O70BhzQF2XAEHCP3lW8hdo0-RfznRL9HPFH8t2lgDyME">




### 2. Register to LoadBalancer

### Application Load Balancer

<img align = "center" alt = "coding" width = "600" src = "https://blogger.googleusercontent.com/img/a/AVvXsEhOr8La1vAwRSWv3vLhFKpf82ArIUTKbxLnuHEVB5Dc2hQ3USJfqrlldE42eQ3QzFnlo1VWVo-yrURNmX3qCOS-J902ylKHrgWHc1Cht6hugEQFlvu-uEQCWhJO8nuR4p7Isa0Tzcc82UoBAO4K65GgPK4a8UcrlcnXVNEqfDC3iqWl3TEwy_jonCPLbV7f">




