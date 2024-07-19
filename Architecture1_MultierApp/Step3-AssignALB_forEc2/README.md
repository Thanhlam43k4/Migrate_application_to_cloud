# Creating an Application Load Balancer (ALB) in AWS

Follow these steps to create an Application Load Balancer (ALB) in AWS:

## Step 1: Sign in to the AWS Management Console

Navigate to [AWS Management Console](https://console.aws.amazon.com/) and sign in to your AWS account.

## Step 2: Go to the EC2 Dashboard

From the AWS Management Console, go to the EC2 dashboard by clicking on "Services" in the top-left corner, then selecting "EC2" under "Compute".

## Step 3: Navigate to Load Balancers

In the EC2 dashboard, under "Load Balancing", click on "Load Balancers".

## Step 4: Click on "Create Load Balancer"

On the Load Balancers page, click on the "Create Load Balancer" button.

## Step 5: Choose a Load Balancer Type

Select "Application Load Balancer" as the load balancer type and click on the "Create" button.

## Step 6: Configure Load Balancer

- **Name**: Enter a name for your load balancer.
- **Scheme**: Choose whether your load balancer will be internet-facing or internal.
- **Listeners and Routing**: Configure listeners and routing rules according to your requirements.
- **Availability Zones**: Select the availability zones for your load balancer.
- **Security Settings**: Configure security settings as needed.
- **Tags**: Optionally, add tags to your load balancer for better organization.
- Click on the "Next: Configure Security Settings" button when you're done.

## Step 7: Configure Security Settings

Configure security settings for your load balancer. You can choose an existing security group or create a new one. Click on the "Next: Configure Security Settings" button when you're done.

## Step 8: Configure Security Groups

Select existing security groups or create new ones to control traffic to your load balancer. Click on the "Next: Configure Routing" button when you're done.

## Step 9: Configure Routing

Configure target groups and routing for your load balancer. Click on the "Next: Register Targets" button when you're done.

## Step 10: Register Targets

**Target Group**

<img align = "center" alt = "coding" width = "600" src = "https://blogger.googleusercontent.com/img/a/AVvXsEjwoRHYnYVtdFCZ1vX5trR6HlrYp_sIl35mTWbGiZJO81yh6dMhUUUDsPW6fM-JjH0nsxPaGgkXuY9EoVI8AlVMZj6L1dnW8-QxUR8vGMcGQl8HkYEHtTE5VQO6oK1ayq6vOj_82Ha7ireHFuHQfxq-7gFiZAviZUVv7-k5cXXp_BgqTfAhD7x0OtHVxm5e">


**Registered targets**

<img align = "center" alt = "coding" width = "600" src = "https://blogger.googleusercontent.com/img/a/AVvXsEgQRA91y7taIV2BzXUG-Ufjmh51IbS0F7Qe97yMtAQEA-bp9pwn-lhgk1DeK523uL5GJgzNfh2zsNjY02VuJYYkxsjeCrvYMyF_sFKeDQW3jgomsT3-MRFLivKa2ywoOW9T3UmqnVH9ZtY8KYc_6Ug0pEaOtFa9eCxy7y8EkHr9aTlIua8nUm6UCesqet5o">


**Application Load Balancer**

<img align = "center" alt = "coding" width = "600" src = "https://blogger.googleusercontent.com/img/a/AVvXsEjD8tUUNIyQTAt0ubJO5Mzs9jYBRiD_3UL5WzRb9wvhqziX3ZZp_uDffT0HOA-0jZdx8f1lYy2df8qfnbOAIZxp9VfYbqsRhnmYAQhG3X7HRsG-QEwWn0IYlEdJstVokBSTCZKB03cE1fTxm6WMQU3t05lqDj3z-LAp6c_WrbGsJuDUogc8KPCoYQohY80M">


Register instances or IP addresses with your target group. Click on the "Next: Review" button when you're done.

## Step 11: Review and Create

Review your load balancer configuration. If everything looks good, click on the "Create" button to create your ALB.

## Step 12: Wait for Creation

Wait for the ALB to be created. Once it's ready, you can see its status as "Active" in the Load Balancers dashboard.

## Step 13: Access Your ALB

Once the ALB is active, you can start using it to distribute incoming traffic to your registered targets.

That's it! You have successfully created an Application Load Balancer (ALB) in AWS.
