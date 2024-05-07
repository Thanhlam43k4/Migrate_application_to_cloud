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
sudo yum update -y
sudo yum install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx

