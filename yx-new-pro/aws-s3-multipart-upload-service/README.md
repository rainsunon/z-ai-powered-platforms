# AWS Secure File Storage

A secure file storage solution built with **Spring Boot**, **AWS S3**, **AWS KMS**, **AWS Secrets Manager**, **PostgreSQL**, and **Docker**. This application allows users to:

- **Register and authenticate** using credentials stored in a PostgreSQL database.
- **Upload files** to AWS S3 with optional encryption via AWS KMS.
- **Download files** (as raw bytes or via file paths).
- **List all files** stored in the S3 bucket.
- **Delete files** from S3.
- **Manage user accounts** (create, retrieve, delete).

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup and Configuration](#setup-and-configuration)
    - [AWS Secrets Manager](#aws-secrets-manager)
    - [Database Configuration](#database-configuration)
    - [Jackson Configuration](#jackson-configuration)
- [Running the Application](#running-the-application)
    - [Without Dockerizing the Application](#without-dockerizing-the-application)
    - [Building a Docker Image (Optional)](#building-a-docker-image-optional)
- [API Endpoints](#api-endpoints)
    - [User Endpoints](#user-endpoints)
    - [File Storage Endpoints](#file-storage-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Security Configuration](#security-configuration)
- [Docker and Database](#docker-and-database)
- [Future Improvements](#future-improvements)
- [License](#license)

## Features

### User Management
- Register new users with encrypted passwords (BCrypt).
- Retrieve user details by login.
- Delete users by ID.

### File Storage
- Upload files to AWS S3 (with KMS encryption if configured).
- Download files (as byte arrays or by writing to a local Path).
- List files in S3.
- Delete files from S3.

### Authentication
- HTTP Basic Authentication with credentials stored in PostgreSQL.
- Custom `UserDetailsService` to load users from the database.

### AWS Integration
- **AWS S3** for file storage.
- **AWS KMS** for server-side encryption keys.
- **AWS Secrets Manager** for database credentials (and optionally AWS credentials).

## Technologies Used

- **Java 21**
- **Spring Boot 3.x**
- **Gradle**
- **AWS SDK (S3, KMS, Secrets Manager)**
- **PostgreSQL**
- **Docker & Docker Compose**
- **Jackson (with `jackson-datatype-jsr310` for Java time types)**
- **Spring Security** for HTTP Basic authentication

## Project Structure

```plaintext
aws-secure-file-storage/
├── build.gradle
├── settings.gradle
├── Dockerfile
├── docker/
│   └── postgres/
│       └── docker-compose.yml
├── README.md
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/
    │   │       └── securefilestorage/
    │   │           ├── SecureFileStorageApplication.java
    │   │           ├── config/
    │   │           │   ├── DataSourceConfig.java
    │   │           │   ├── JacksonConfiguration.java
    │   │           │   └── SecurityConfig.java
    │   │           ├── controller/
    │   │           │   ├── FileStorageController.java
    │   │           │   └── UserController.java
    │   │           ├── dto/
    │   │           │   ├── UserRequestDto.java
    │   │           │   └── UserResponseDto.java
    │   │           ├── exception/
    │   │           │   └── GlobalExceptionHandler.java
    │   │           ├── model/
    │   │           │   └── User.java
    │   │           ├── repository/
    │   │           │   └── UserRepository.java
    │   │           ├── security/
    │   │           │   └── CustomUserDetailsService.java
    │   │           └── service/
    │   │               ├── FileStorageService.java
    │   │               └── UserService.java
    │   └── resources/
    │       ├── application.yml
    │       └── static/
    │           └── favicon.ico
    └── test/
        └── java/
            └── com/
                └── securefilestorage/
                    └── SecureFileStorageApplicationTests.java
```

## Setup and Configuration

### AWS Secrets Manager
- Store database credentials under `/secure-storage-app/db-credentials` with keys `username`, `password`, `host`, `port`, and `dbname`.
- Store AWS credentials (optional) under `/secure-storage/aws-credentials`.

### Database Configuration
- `DataSourceConfig` loads DB credentials from AWS Secrets Manager.
- Ensure Dockerized PostgreSQL is running with correct host/port.

### Jackson Configuration
- `JacksonConfiguration` registers `JavaTimeModule` for handling `ZonedDateTime` serialization.
- Ensure `jackson-datatype-jsr310` dependency is included.

## Running the Application

### Without Dockerizing the Application
1. Start PostgreSQL via Docker Compose:
   ```bash
   cd docker/postgres
   docker-compose up -d
   ```
2. Run Spring Boot:
   ```bash
   ./gradlew bootRun
   ```

### Building a Docker Image (Optional)
1. Build the application:
   ```bash
   ./gradlew clean build
   ```
2. Build Docker image:
   ```bash
   docker build -t aws-secure-file-storage .
   ```
3. Run the container:
   ```bash
   docker run -d -p 8080:8080 --name aws-secure-file-storage-container aws-secure-file-storage
   ```

## API Endpoints

### User Endpoints
- **Register a User**
  ```http
  POST /api/users/register
  ```
  **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "login": "userlogin",
    "name": "John Doe",
    "password": "userpassword"
  }
  ```
- **Get User by Login**
  ```http
  GET /api/users/{login}
  ```
- **Delete User**
  ```http
  DELETE /api/users/{userId}
  ```

### File Storage Endpoints
- **Upload File**
  ```http
  POST /api/files/upload
  ```
    - Use `form-data` with key `file` (type: **File**).
- **Download File (Bytes)**
  ```http
  GET /api/files/download/bytes/{filename}
  ```
- **Download File (Path)**
  ```http
  GET /api/files/download/path/{filename}
  ```
- **List Files**
  ```http
  GET /api/files/list
  ```
- **Delete File**
  ```http
  DELETE /api/files/delete/{filename}
  ```

## Testing with Postman

1. **User Registration**
    - `POST http://localhost:8080/api/users/register`
    - JSON body with `email`, `login`, `name`, `password`.
2. **Authentication**
    - Use **Basic Auth** with user credentials.
3. **File Upload**
    - `POST http://localhost:8080/api/files/upload`
    - **Body**: `form-data`, key: `file`, type: **File**.
4. **List Files**
    - `GET http://localhost:8080/api/files/list`

## Security Configuration

- **CustomUserDetailsService** loads users from `UserRepository`.
- **BCryptPasswordEncoder** encodes passwords.
- **SecurityConfig** enforces HTTP Basic authentication.

## Docker and Database

- **PostgreSQL** runs via `docker-compose.yml` in `docker/postgres`.
- Database credentials are retrieved from AWS Secrets Manager.

## Future Improvements

- **Role-Based Access Control (RBAC)** for finer security control.
- **JWT Authentication** for stateless authentication.
- **Advanced Monitoring** with Prometheus/Grafana.
- **Comprehensive Testing** for file operations and security.

## License

This project is licensed under the [MIT License](LICENSE). You are free to modify and distribute this software as per the license terms.

---

## Contact

**Dzmitry Ivaniuta** — [diafter@gmail.com](mailto:diafter@gmail.com) — [GitHub](https://github.com/xrs)

