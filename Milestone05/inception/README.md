*This project has been created as part of the 42 curriculum by ktakeru.*

## Description
This project, **Inception**, aims to broaden my knowledge of system administration by using **Docker** to set up a small infrastructure of different services. The goal is to build a complete WordPress site hosted on an Nginx server using TLS v1.2/v1.3, with a MariaDB database, all running in separate, interconnected containers.

Key features:
- **Infrastructure as Code**: Entire setup managed via Docker Compose.
- **Security**: Mandatory use of TLS for all web traffic and private networking for the database.
- **Data Persistence**: Use of Docker volumes to ensure data survives container restarts.

## Instructions

### Prerequisites
- Docker and Docker Compose installed.
- A Linux environment (preferably a 42-compliant VM).

### Execution
1. **Setup Domain**:
   Add `127.0.0.1 ktakeru.42.fr` to your `/etc/hosts` file.
2. **Environment Variables**:
   Create a `.env` file in the `srcs/` directory based on the provided requirements.
   
   Required Variables in .env:

    - **Domain setup**: DOMAIN_NAME (e.g., ktakeru.42.fr)
    - **DB credentials**: SQL_DATABASE, SQL_USER, SQL_PASSWORD, SQL_ROOT_PASSWORD
    - **WordPress Admin**: ADMIN_USER (no "admin" allowed), ADMIN_PASSWORD, ADMIN_EMAIL
    - **WordPress User**: USER_LOGIN, USER_PASSWORD, USER_EMAIL
3. **Build and Run**:
   ```bash
   make
   ```
   This command creates the necessary directories, builds the images, and starts the containers in detached mode.

## Project Description

### Use of Docker
Docker is used here to containerize each service (Nginx, WordPress, MariaDB). This ensures that each component has its own isolated environment, dependencies, and configuration, making the infrastructure portable and reproducible.

### Design Choices & Comparisons

| Concept | Comparison & Choice in Inception |
| :--- | :--- |
| **VM vs Docker** | VMs virtualize hardware (heavy, slow boot), while Docker virtualizes the OS kernel (lightweight, fast). Inception uses Docker for efficiency. |
| **Secrets vs Env Vars** | Secrets are encrypted and safer, but Environment Variables are used here for simplicity as per the subject. |
| **Docker vs Host Network** | Host Network shares the host IP. Docker Network (Bridge) creates an isolated network for container-to-container talk. |
| **Volumes vs Bind Mounts** | Bind Mounts depend on host paths. Docker Volumes are managed by Docker for better performance and isolation. |

## Resources

### Official Documentation
- [Docker Documentation](https://docs.docker.com/)
- [Nginx TLS/SSL Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)
- [WP-CLI Command Reference](https://developer.wordpress.org/cli/commands/)

### Use of AI
AI (Gemini) was utilized throughout this project for the following tasks:
- **Troubleshooting**: Debugging Git SSH authentication and Docker daemon permission errors.
- **Scripting**: Refining the `wp_start.sh` script, including MariaDB dependency checks.
- **Documentation**: Structuring this README and technical comparisons for 42 requirements.
- **Concepts**: Clarifying Docker volumes, networking, and SSL certificate behaviors.
