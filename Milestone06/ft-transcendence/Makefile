# ft_transcendence - Docker development
# Usage: make setup && make dev

.PHONY: setup dev down logs migrate clean shell-backend shell-frontend build build-frontend build-backend ssl-gen

# Initial setup: create .env and SSL cert if missing
setup:
	@if [ ! -f .env ]; then cp .env.example .env && echo "Created .env"; else echo ".env already exists"; fi
	@if [ ! -f nginx/ssl/localhost.pem ]; then $(MAKE) ssl-gen; else echo "SSL cert already exists"; fi

# Start all services (foreground, Ctrl+C to stop)
dev: setup
	docker compose up --build

# Run in background
up: setup
	docker compose up -d --build

# Rebuild images when dependencies change (e.g. after editing package.json)
# Run: make build-frontend or make build-backend
# This removes the node_modules volume so fresh deps are installed from the new image
build: build-frontend build-backend

build-frontend:
	docker compose stop frontend 2>/dev/null || true
	docker compose rm -f frontend 2>/dev/null || true
	docker volume rm ft-transcendence_frontend_node_modules 2>/dev/null || true
	docker compose build --no-cache frontend

build-backend:
	docker compose stop backend 2>/dev/null || true
	docker compose rm -f backend 2>/dev/null || true
	docker volume rm ft-transcendence_backend_node_modules 2>/dev/null || true
	docker compose build --no-cache backend

# Stop and remove containers
down:
	docker compose down

# View logs
logs:
	docker compose logs -f

# Run after first setup or schema changes: create and apply DB migrations
migrate: setup
	docker compose up -d db && sleep 5 && docker compose run --rm backend npx prisma migrate dev --name init

# Clean volumes (removes database data)
clean: down
	docker compose down -v

# Enter backend container
shell-backend:
	docker compose exec backend sh

# Enter frontend container
shell-frontend:
	docker compose exec frontend sh

# Create SSL certification
ssl-gen:
	mkdir -p nginx/ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout nginx/ssl/localhost-key.pem \
		-out nginx/ssl/localhost.pem \
		-subj "/CN=localhost"
