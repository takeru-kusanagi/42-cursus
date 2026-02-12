# Developer Documentation - Inception

This guide explains how to set up, build, and maintain the Inception project from a development perspective.

## Environment Setup
### Prerequisites
- Operating System: Debian or a similar Linux distribution.
- Tools: Docker, Docker Compose, and `make`.
- Host Configuration: Add `127.0.0.1 USER.42.fr` to your `/etc/hosts` file.

### Configuration
1. Create a `.env` file in the `srcs/` directory.
2. **Efficient Transfer**: To copy your `.env` from your host machine (Mac/Windows) to the VM via SSH (Port 2222):
   ```bash
   scp -P 2222 /path/to/your/.env USER@localhost:~/inception/srcs/.env
   ```
3. Define the following variables: `DOMAIN_NAME`, `SQL_DATABASE`, `SQL_USER`, `SQL_PASSWORD`, `SQL_ROOT_PASSWORD`, `ADMIN_USER`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`, etc.

## Build and Launch
The project uses a `Makefile` for automation:
- `make`: Builds the images and starts the stack in detached mode.
- `make re`: Forces a rebuild of the entire infrastructure.
- `make build`: Standard build command to create directories and start containers.

## Management & Verification
### Common Commands
- **Check Logs**: `docker logs <container_name>`
- **Access Container Shell**: `docker exec -it <container_name> /bin/sh`
- **List Networks**: `docker network ls` (verify the `inception` network is created)
- **List Volumes**: `docker volume ls`

### SSL/TLS Verification
To confirm the site is using your generated certificate and check its details:
```bash
openssl s_client -connect USER.42.fr:443
```
## Maintenance & Troubleshooting
### Full System Reset ("Nuke" Command)
If you need to completely wipe everything (Containers, Images, Volumes, Networks) to start from a clean slate:
```bash
docker stop $(docker ps -qa) 2>/dev/null; \
docker rm $(docker ps -qa) 2>/dev/null; \
docker rmi -f $(docker images -qa) 2>/dev/null; \
docker volume rm $(docker volume ls -q) 2>/dev/null; \
docker network rm $(docker network ls -q) 2>/dev/null
```
## Data Persistence
Project data is stored in dedicated Docker Volumes, ensuring it survives container deletion:
- **WordPress files**: `/home/USER/data/wordpress` (mapped to the `wordpress` volume)
- **Database files**: `/home/USER/data/mariadb` (mapped to the `mariadb` volume)

The `docker-compose.yml` file defines these volumes, and the `Makefile` ensures the host directories exist before launching the containers.