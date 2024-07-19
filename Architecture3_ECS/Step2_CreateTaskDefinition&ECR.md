    # Migrate_application_to_AWS



## Migrate_Microservices_Nodejs Application to Cloud Environment

## Prerequisites

- AWS Account
- IAM User with required permissions to create ECR repositories

## Step 1: Open the Amazon ECR Console

1. Sign in to the AWS Management Console.
2. Navigate to the Amazon ECR console at [https://console.aws.amazon.com/ecr/](https://console.aws.amazon.com/ecr/).

## Step 2: Create a Public Repository

1. In the navigation pane, choose **Repositories**.
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
     
     <img align = "center" alt = "coding" width = "600" src = " https://blogger.googleusercontent.com/img/a/AVvXsEglOgQZkhTl416zFzYE_7u-xr_iUTw-WJ-OoDu2LXQyL3u0Jg0yQDlWWKClBWCMkVqR1-ZbJBDHhRsRFTA5Cvg8N2z0vsyi9N1K4ZeDgrfdq6s0YXhttdIWFNioPNO3OsyDH5qzSP1mqudS9gVosd_9aAWqBGFO5zNDJVUJ2--MpoXvYUU55DcEZ8K2zNIl">
       
## Additional Notes

- Ensure your IAM user has the necessary permissions to create and manage ECR repositories.
- For more information on managing ECR repositories and pushing images, refer to the [Amazon ECR documentation](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
