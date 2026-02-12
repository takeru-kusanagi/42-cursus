
NAME                = inception
USER                = $(shell whoami)

DOCKER_COMPOSE      = docker compose
DOCKER_COMPOSE_FILE = ./srcs/docker-compose.yml
DATA_PATH           = /home/$(USER)/data

all: build

build:
	mkdir -p $(DATA_PATH)/mysql
	mkdir -p $(DATA_PATH)/wordpress
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up --build -d

kill:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) kill

down:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down

clean:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down -v

fclean: clean
	sudo rm -rf $(DATA_PATH)/mysql
	sudo rm -rf $(DATA_PATH)/wordpress
	docker system prune -a -f

re: fclean build

.PHONY: build kill down clean fclean restart
