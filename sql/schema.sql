DROP DATABASE IF EXISTS companyDB;

CREATE DATABASE companyDB;

USE companyDB;

CREATE TABLE departments
(
    id INT,
    dept_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE roles
(
    id INT,
    title VARCHAR(30),
    salary DECIMAL NOT NULL,
    dept_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (dept_id) REFERENCES departments (id)
);

CREATE TABLE managers
(
    id INT,
    mgr_first_name VARCHAR(30) NOT NULL,
    mgr_last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    mgr_full_name VARCHAR(50),
    PRIMARY KEY(id)
);

CREATE TABLE employees
(
    id INT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    full_name VARCHAR(50),
    PRIMARY KEY(id),
    FOREIGN KEY (role_id) REFERENCES roles (id),
    FOREIGN KEY (manager_id) REFERENCES managers (id)
);

