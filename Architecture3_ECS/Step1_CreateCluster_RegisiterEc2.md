    # Migrate_application_to_AWS



## Migrate_Microservices_Nodejs Application to Cloud Environment


### Step1: Create ECS Cluster 

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

### Step2: Register Ec2 Instance

1. **Launch EC2 Instances**:
   - Navigate to the EC2 console.
   - Click on **Launch Instances**.
   - Choose an Amazon Machine Image (AMI) that supports ECS-optimized AMIs.

2. **Configure Instance Details**:
   - **IAM Role**: Select the IAM role with the `AmazonEC2ContainerServiceforEC2Role` policy attached.
   - **User data**: Add the following script to automatically register the instance to the ECS cluster:
     ```bash
     #!/bin/bash
     echo ECS_CLUSTER=my-ecs-cluster >> /etc/ecs/ecs.config
     ```

3. **Configure Storage**: Configure the storage for your instances as needed.

4. **Add Tags**: Add any tags you require for your instances.

5. **Configure Security Group**:
   - Ensure the security group allows the necessary ports for ECS, such as port 22 for SSH access and port 80 or 443 for web traffic.

6. **Review and Launch**:
   - Review your settings and launch the instance.
   - Select your key pair for SSH access and launch the instance.

## Step 3: Verify the Cluster

1. **Navigate to the ECS Console**:
   - Go back to the Amazon ECS console.

2. **Check Cluster Instances**:
   - In the navigation pane, choose **Clusters**.
   - Select your cluster (`ecsdemo`).
   - Go to the **ECS Instances** tab to verify that your EC2 instances are registered to the cluster.

## Additional Notes

- Ensure that your ECS container instances have sufficient IAM permissions to register to the cluster.
- You can also use the AWS CLI or SDKs to automate these steps if required.
- For a production environment, consider using Auto Scaling groups to manage the lifecycle of your EC2 instances dynamically.
