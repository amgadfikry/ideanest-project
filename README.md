# Ideanest Project

## Overview

**Ideanest** is a Backend server API build with NestJS, Redis, and MongoDB. The API provides endpoints for dealing of users, organizations,
and authentication features. The API is secured with JWT and provides a Swagger documentation for the available endpoints.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Running Development Environment with Docker Compose](#running-development-environment-with-docker-compose)
   - [API Documentation](#api-documentation)
5. [Usage](#usage)
6. [Testing](#testing)

## Features

- User creation (sign up)
- Authentication management (login, logout, refresh token)
- Organizations management (create, update, delete, get, get all, invite user)
- Swagger API Documentation

## Technologies Used

- **Backend**: NestJS
- **Database**: MongoDB
- **Cache**: Redis
- **Containerization**: Docker, Docker Compose
- **Authentication**: JWT
- **Other Tools**: swagger

## Getting Started

### Prerequisites

- Ensure you have Docker and Docker Compose installed on your machine.
- You need to have Node.js and npm installed on your machine.

### Running Development Environment with Docker Compose

1. **Clone the Repository**

   ```bash
   git clone https://github.com/amgadfikry/ideanest-project.git
   cd ideanest-project
   ```
   
2. **Install node dependencies**

   ```bash
   npm i
   ```

3. **Create a `.env` file in the root directory**

   ```bash
    touch .env
    ```

4. **Add the following environment variables to the `.env` file**

   ```bash
      DATABASE_HOST=mongodb-primary:27017,mongodb-secondary1:27017,mongodb-secondary2:27017
      DATABASE_NAME=ideanest
      REPLACE_DATABASE_NAME=ideanest-rs
      REDIS_HOST=redis
      REDIS_PORT=6379
      JWT_SECRET=66fafa7278f00e4bd784d57e
      CORS_ORIGIN=[your frontend url]
    ```

5. **Run the following command to start the development environment**

   ```bash
    docker compose up
    # or
    docker compose up server
   ```

6. **Access the API Documentation**

   - Open your browser and navigate to `http://localhost:8080/api`

### API Documentation

- The API documentation is generated using Swagger. You can access the documentation by navigating to `http://localhost:8080/api` after starting the development environment.
- The API documentation provides information about the available endpoints, request and response schemas, and authentication requirements.
- You can test the endpoints directly from the documentation by clicking on the `Try it out` button.
- The documentation also provides information about the required headers and parameters for each endpoint.
- You can also test the endpoints using tools like Postman or Insomnia.
- The API documentation is automatically updated based on the code changes.
- The API documentation is accessible to both developers and non-developers.
- The API documentation provides examples of request and response payloads.
