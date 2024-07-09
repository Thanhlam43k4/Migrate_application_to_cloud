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
);


CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL;
  `amount` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `expiration_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
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
);

CREATE TABLE `cus_profile` (
  `user_id` int NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` enum('male', 'female') DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `customers`(`id`)
);
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `totalprice` decimal(10, 2) NOT NULL,
  PRIMARY KEY (`id`)
);


/*Trigger whenever insert a new customers will automatically insert a new profile with this user_id */
use customer_db;
DELIMITER $$

CREATE TRIGGER after_customer_insert
AFTER INSERT ON customers

FOR EACH ROW
BEGIN
  INSERT INTO cus_profile (user_id, email, username, phone, gender, city, country, profile_picture) 
  VALUES (NEW.id, NEW.email, NEW.username, NULL, NULL, NULL, NULL, NULL);
END$$

DELIMITER ;


INSERT INTO products (id, name, type, amount,price) VALUES
(30, 'Uniform Jacket DHQGHN', 'Uniform', 10000,105.66),
(31, 'Physical shirt DHQGHN', 'Uniform', 10000,200.465),
(32, 'Introduction to Programming Books - UET', 'Books', 5000,150.4),
(33, 'Calculus Book Combo 1 + 2 + 3 (DHQGHN)', 'Books', 2004,123.4),
(34, 'Combo Book Linear Algebra + General Physics (1,2,3)', 'Books', 6000,353.5);


