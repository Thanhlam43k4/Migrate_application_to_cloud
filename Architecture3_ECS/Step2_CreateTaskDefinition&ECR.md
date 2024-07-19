    # Migrate_application_to_AWS



## Migrate_Microservices_Nodejs Application to Cloud Environment

## Prerequisites

- AWS Account
- IAM User with required permissions to create ECR repositories

## Step 1: Open the Amazon ECR Console

1. Sign in to the AWS Management Console.
2. Navigate to the Amazon ECR console at [https://console.aws.amazon.com/ecr/](https://console.aws.amazon.com/ecr/).

## Step 2: Create a Public Repository

1. In the navigation panel, choose **Repositories**.
2. Click on **Create repository**.
3. Configure the repository settings:
   - **Visibility settings**: Select **Public**.
     
   - **Repository name**: Enter a name for your repository (e.g., `my-public-repo`).
     
   - **Tag immutability**: (Optional) Enable tag immutability to prevent image tags from being overwritten.
     
   - **Scan on push**: (Optional) Enable image scanning on push to automatically scan images for vulnerabilities.
     
   - **KMS encryption**: (Optional) Select a KMS key for encryption.
     
4. Click on **Create repository** to create the public repository.

- I have 4 public Repository for 4 service ( `customer`,`frontend`,`shopping`,`product`)

<img align = "center" alt = "coding" width = "600" src = "https://blogger.googleusercontent.com/img/a/AVvXsEigo-SxBlumpOCOrREytmcHieoKXZd8FYq0XVJ3_J7BcGPD2yuCTi7679HiWh3sNq-sDeK0NCuXUMzxOkQHCG8-mdBQQoosfy_EMnuJO4PczeQ52fR2NF3sbSqQyjNKYt2IEmBe1Fftnf86-qcByM0KSQzlnYuv_lZqbPKuJyVWAvPmBqSxvBxnjDesS3Zz">

## Step 3: Push Images to the Repository

1. **Authenticate Docker to your public registry**:
   - Retrieve an authentication token and authenticate your Docker client to your registry.
   - Use the following command to authenticate:
     ```sh
     aws ecr-public get-login-password --region <region> | docker login --username AWS --password-stdin public.ecr.aws
     ```

2. **Tag your image**:
   - Tag your image with the repository URI.
     ```sh
     docker tag <your-image>:<tag> public.ecr.aws/<your-account-id>/<your-repo-name>:<tag>
     ```

3. **Push the image to your repository**:
   - Push your tagged image to your public repository.
     ```sh
     docker push public.ecr.aws/<your-account-id>/<your-repo-name>:<tag>
     ```
   - My four microservices application images
     
     <img align = "center" alt = "coding" width = "600" src = "https://blogger.googleusercontent.com/img/a/AVvXsEglOgQZkhTl416zFzYE_7u-xr_iUTw-WJ-OoDu2LXQyL3u0Jg0yQDlWWKClBWCMkVqR1-ZbJBDHhRsRFTA5Cvg8N2z0vsyi9N1K4ZeDgrfdq6s0YXhttdIWFNioPNO3OsyDH5qzSP1mqudS9gVosd_9aAWqBGFO5zNDJVUJ2--MpoXvYUU55DcEZ8K2zNIl">
## Step 4: Create a Task Definition

1. In the navigation panel, choose **Task Definitions**.
2. Click on **Create new Task Definition**.
3. Select **EC2** or **Fargate** launch type compatibility, then click **Next step**.

## Step 5: Configure Task Definition

1. **Task Definition Name**:
   - Enter a name for the task definition (e.g., `my-microservices-task`).

2. **Task Role**:
   - Select an existing IAM role or create a new one that grants the necessary permissions for your tasks.

3. **Network Mode**:
   - Select the network mode for your task (e.g., `awsvpc` for Fargate).

4. **Task Execution Role**:
   - Select an IAM role that grants the ECS service permission to pull images from ECR and manage logs.

5. **Container Definitions**:
   - Click **Add container** for each of your services (`customer`, `shopping`, `products`, and `frontend`) and configure as follows:

### Container Configuration

#### Customer Service
- **Container name**: `customer`
- **Image**: `public.ecr.aws/<your-account-id>/customer:latest`
- **Memory Limits**: Set memory limits (e.g., `256` soft limit)
- **Port Mappings**: Add port mappings (e.g., `80:80`)

#### Shopping Service
- **Container name**: `shopping`
- **Image**: `public.ecr.aws/<your-account-id>/shopping:latest`
- **Memory Limits**: Set memory limits (e.g., `256` soft limit)
- **Port Mappings**: Add port mappings (e.g., `81:80`)

#### Products Service
- **Container name**: `products`
- **Image**: `public.ecr.aws/<your-account-id>/products:latest`
- **Memory Limits**: Set memory limits (e.g., `256` soft limit)
- **Port Mappings**: Add port mappings (e.g., `82:80`)

#### Frontend Service
- **Container name**: `frontend`
- **Image**: `public.ecr.aws/<your-account-id>/frontend:latest`
- **Memory Limits**: Set memory limits (e.g., `256` soft limit)
- **Port Mappings**: Add port mappings (e.g., `83:80`)

6. **Additional Configuration**:
   - Configure environment variables, log configuration, health checks, and other container settings as needed.

7. Click **Create** to create the task definition.

## Step 6: Create a Service

1. In the Amazon ECS console, navigate to **Clusters** and select your cluster.
2. Click on **Create** and then **Create Service**.
3. Choose the launch type compatibility (`EC2` or `Fargate`).
4. Configure the service name, number of tasks, and other settings.
5. Select the task definition created in Step 3.
6. Configure networking, load balancer, and other settings as needed.
7. Click **Create Service**.

## Additional Notes

- Ensure your IAM roles have the necessary permissions to pull images from ECR and manage ECS tasks.
- For a production environment, consider configuring auto-scaling and load balancing for your services.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
