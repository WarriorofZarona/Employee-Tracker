DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department(
id INT AUTO_INCREMENT NOT NULL,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);
TRUNCATE department;
INSERT INTO department(name) VALUES ("General Management");
INSERT INTO department(name) VALUES ("Sales");
INSERT INTO department(name) VALUES ("Human Resources");
INSERT INTO department(name) VALUES ("Engineering");
INSERT INTO department(name) VALUES ("Legal");

CREATE TABLE role(
id INT AUTO_INCREMENT NOT NULL,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INT NOT NULL,
PRIMARY KEY (id)
);

TRUNCATE role;
INSERT INTO role(title, salary, department_id) VALUES ("General Manager", 100000, 1);
INSERT INTO role(title, salary, department_id) VALUES ("Assistant Manager", 80000, 1);
INSERT INTO role(title, salary, department_id) VALUES ("Sales Lead", 50000, 2);
INSERT INTO role(title, salary, department_id) VALUES ("Salesperson", 40000, 2);
INSERT INTO role(title, salary, department_id) VALUES ("HR Specialist", 60000, 3);
INSERT INTO role(title, salary, department_id) VALUES ("Recruiter", 50000, 3);
INSERT INTO role(title, salary, department_id) VALUES ("Software Engineer", 100000, 4);
INSERT INTO role(title, salary, department_id) VALUES ("Lawyer", 125000, 5);

CREATE TABLE employee(
id INT AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
PRIMARY KEY (id)
);

TRUNCATE employee;
INSERT INTO employee(first_name, last_name, role_id) VALUES ("Andrew", "Bautista", 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Michelle", "Rojas", 2, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Amy", "Martins", 5, 1);
INSERT INTO employee(first_name, last_name, role_id) VALUES ("Alyssa", "Pepe", 8);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Scarlett", "Rosalie", 3, 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Barbara", "Soto", 7, 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Charles", "Casseus", 4, 5);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Thomas", "Pepe", 6, 3);

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;

SELECT CONCAT(first_name, ' ', last_name) as employees FROM employee where manager_id=1