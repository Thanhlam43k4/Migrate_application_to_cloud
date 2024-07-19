    # Migrate_application_to_AWS



## Migrate_Microservices_Nodejs Application to Cloud Environment


### Step1: Create ECS Cluster and Register Ec2 Instance to Cluster**

1. **Open the Amazon ECS Console**:
   - Sign in to the AWS Management Console.
   - Navigate to the Amazon ECS console at [https://console.aws.amazon.com/ecs/](https://console.aws.amazon.com/ecs/).

2. **Create a Cluster**:
   - In the navigation pane, choose **Clusters**.
   - Choose **Create Cluster**.
   - Select the **EC2 Linux + Networking** template and click **Next step**.

3. **Configure the Cluster**:
   - Choose the Cluster Infrastructure(eg `AWS Fargate (serverless)` or `Amazon EC2 instances`).
   - If you choose EC2 Instances you need to config your infrastructure:
     
           + Cluster name: Enter a name for your cluster (e.g., `ecsdemo`).
     
           + Provisioning Model: Choose **On-Demand Instance** or **Spot Instances**.
     
           + EC2 instance type: Select the instance type (e.g., `t3.micro`).
     
           + Number of instances: Enter the number of instances to launch.
     
           + VPC: Select your VPC.
     
           + Subnets: Select the subnets where you want to launch your instances.
     
           + Security group: Choose an existing security group or create a new one.
  
           + Key pair: Select an existing key pair or create a new one.

4. **Advanced Options (Optional)**:
   - Configure any additional options such as container instance IAM role, CloudWatch Container Insights, etc.

5. **Create**:
   - Click **Create** to create the cluster.
