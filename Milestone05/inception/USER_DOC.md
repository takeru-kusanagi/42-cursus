# User Documentation - Inception

This document provides instructions for administrators and users to interact with the Inception infrastructure.

## Services Provided
The stack provides a secure, containerized WordPress website with the following components:
- **Nginx**: A web server acting as a secure entry point via HTTPS (TLS).
- **WordPress**: The content management system for creating and managing blog posts.
- **MariaDB**: The database storing all website content and user data.

## Project Control
To manage the lifecycle of the project, use the following commands in the root directory:
- **Start the project**: `make`
- **Stop the project**: `make stop` (stops containers without deleting volumes)
- **Shut down and clean**: `make clean` (stops and removes containers/networks)

## Accessing the Site
- **Website**: Open your browser and go to `https://ktakeru.42.fr`
- **Admin Panel**: Go to `https://ktakeru.42.fr/wp-login.php` to manage posts and users.
  *Note: You must accept the self-signed certificate warning in your browser.*

## Credentials Management
All sensitive information and login details are stored in the `.env` file located in the `srcs/` directory.
- **WordPress Admin**: `ADMIN_USER` / `ADMIN_PASSWORD`
- **WordPress General User**: `USER_LOGIN` / `USER_PASSWORD`
- **Database**: `SQL_USER` / `SQL_PASSWORD`

## Health Check
To verify that the services are running correctly:
1. Run `docker ps` to see if all three containers (`nginx`, `wordpress`, `mariadb`) are "Up".
2. Run `curl -kI https://ktakeru.42.fr` to check if the web server responds with `HTTP/1.1 200 OK`.