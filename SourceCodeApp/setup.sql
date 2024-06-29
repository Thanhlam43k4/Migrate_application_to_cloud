CREATE DATABASE customer_db;

USE customer_db;

CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `whislist` json DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) 


CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `expiration_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) 

CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
)

INSERT INTO products(name,type,amount)
VALUES
     ('Broccoli','vegetables',3),
     ('Pencil','school suppiles',6),
     ('T-Shirt','clothes',100),
     ('Update','hello',2);
