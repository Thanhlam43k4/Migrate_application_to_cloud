#!/bin/bash

###Install Mysql
sudo wget https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm 

sudo dnf install mysql80-community-release-el9-1.noarch.rpm -y

sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2023

sudo dnf install mysql-community-client -y

sudo dnf install mysql-community-server -y

sudo systemctl enable mysqld

sudo systemctl start mysqld

###Install Nginx

#sudo yum install nginx -y
#sudo systemctl enable nginx
#sudo systemctl start nginx


###Install docker 

sudo dnf install docker -y

sudo systemctl start docker

sudo systemctl enable docker

sudo systemctl status docker

sudo usermod -aG docker $USER

newgrp docker

###Install docker-compose
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose version

###Install git in Amazon EC2 instance
sudo yum install git -y

###Clone source code

git clone https://github.com/Thanhlam43k4/Migrate_application_to_cloud.git