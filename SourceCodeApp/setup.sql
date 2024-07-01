CREATE DATABASE customer_db;

USE customer_db;


CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
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
CREATE TABLE `cus_profile` (
  `user_id` int NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` enum('male', 'female') DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `customers`(`id`)
);
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

/*Trigger whenever insert a new customers will automatically insert a new profile with this user_id */
DELIMITER $$

CREATE TRIGGER after_customer_insert
AFTER INSERT ON customers

FOR EACH ROW
BEGIN
  INSERT INTO cus_profile (user_id, phone, gender, city, country, profile_picture) 
  VALUES (NEW.id, NEW.email, NEW.username, NULL, NULL, NULL, NULL, NULL);
END$$

DELIMITER ;
