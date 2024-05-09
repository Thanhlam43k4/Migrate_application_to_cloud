CREATE DATABASE customer_db;

USE customer_db;

CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    whislist JSON
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    type VARCHAR(255),
    amount INT,
    expiration_date TIMESTAMP
);

INSERT INTO products(name,type,amount)

VALUES
     ('Broccoli','vegetables',3),
     ('Pencil','school suppiles',6),
     ('T-Shirt','clothes',100),
     ('Update','hello',2);
