 CREATE SCHEMA IF NOT EXISTS ams;

-- Switch to the schema
USE ams;

CREATE TABLE department (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE role (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                      name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       full_name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       department_id BIGINT,
                       role_id BIGINT NOT NULL,
                       phone VARCHAR(255) UNIQUE,
                       hire_date DATE,
                       is_active BOOLEAN,
                       created_at DATE,
                       updated_at DATE,
                       CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES department(id),
                       CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE asset_category (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE asset_type (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            category_id BIGINT NOT NULL,
                            name VARCHAR(255) NOT NULL,
                            CONSTRAINT fk_assettype_category FOREIGN KEY (category_id) REFERENCES asset_category(id)
);

CREATE TABLE asset (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       category_id BIGINT NOT NULL,
                       type_id BIGINT NOT NULL,
                       brand VARCHAR(255) NOT NULL,
                       description TEXT,
                       name VARCHAR(255) NOT NULL,
                       location VARCHAR(255),
                       serial_number VARCHAR(255) UNIQUE,
                       purchase_date DATETIME NOT NULL,
                       warranty_end_date DATETIME NOT NULL,
                       status ENUM('AVAILABLE', 'ASSIGNED', 'UNDER_MAINTENANCE', 'RETIRED') NOT NULL,
                       image_path VARCHAR(255),
                       CONSTRAINT fk_asset_category FOREIGN KEY (category_id) REFERENCES asset_category(id),
                       CONSTRAINT fk_asset_type FOREIGN KEY (type_id) REFERENCES asset_type(id)
);

CREATE TABLE asset_assignment (
                                  id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                  asset_id BIGINT NOT NULL,
                                  assigned_to_user_id BIGINT NOT NULL,
                                  assignment_date DATETIME NOT NULL,
                                  status ENUM('ACTIVE', 'CLOSED') NOT NULL,
                                  return_date DATETIME,
                                  note TEXT,
                                  CONSTRAINT fk_asset_assignment_asset FOREIGN KEY (asset_id) REFERENCES asset(id),
                                  CONSTRAINT fk_asset_assignment_user FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
);


CREATE TABLE asset_history (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               asset_id BIGINT NOT NULL,
                               user_id BIGINT NOT NULL,
                               note TEXT,
                               timestamp DATETIME,
                               status ENUM('AVAILABLE', 'ASSIGNED', 'UNDER_MAINTENANCE', 'RETIRED'),
                               CONSTRAINT fk_history_asset FOREIGN KEY (asset_id) REFERENCES asset(id),
                               CONSTRAINT fk_history_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE asset_request (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               asset_id BIGINT,
                               type_id BIGINT NOT NULL,
                               requester_id BIGINT NOT NULL,
                               request_date DATETIME,
                               status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL,
                               request_type ENUM('NEW', 'MAINTENANCE') NOT NULL,
                               approved_by_id BIGINT,
                               approved_date DATETIME,
                               CONSTRAINT fk_asset_request_asset FOREIGN KEY (asset_id) REFERENCES asset(id),
                               CONSTRAINT fk_asset_request_type FOREIGN KEY (type_id) REFERENCES asset_type(id),
                               CONSTRAINT fk_asset_request_requester FOREIGN KEY (requester_id) REFERENCES users(id),
                               CONSTRAINT fk_asset_request_approved_by FOREIGN KEY (approved_by_id) REFERENCES users(id)
);