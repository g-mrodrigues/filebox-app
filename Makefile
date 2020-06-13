SHELL:=/bin/bash
ENV_PATH=./src/.env

all: server_up sleep

server_up: requirements
	@export $$(cat ${ENV_PATH} | xargs) && cd .infrastructure/env/$${ENVIRONMENT} && docker-compose up -d --build

server_halt: requirements
	@export $$(cat ${ENV_PATH} | xargs) && cd .infrastructure/env/$${ENVIRONMENT} && docker-compose stop

server_start: requirements
	@export $$(cat ${ENV_PATH} | xargs) && cd .infrastructure/env/$${ENVIRONMENT} && docker-compose start

server_reload: requirements
	@export $$(cat ${ENV_PATH} | xargs) && cd .infrastructure/env/$${ENVIRONMENT} && docker-compose stop && docker-compose start

server_destroy: requirements
	@export $$(cat ${ENV_PATH} | xargs) && cd .infrastructure/env/$${ENVIRONMENT} && docker-compose stop && docker-compose rm

ssh: requirements
	@export $$(cat ${ENV_PATH} | xargs) && docker exec -it $${PROJECT_NAME}_$${CONTAINER} bash

get_variable:
	@export $$(cat ${ENV_PATH} | xargs) && echo "PROJECT_NAME="$$PROJECT_NAME
	@export $$(cat ${ENV_PATH} | xargs) && echo "HOST="$$HOST
	@export $$(cat ${ENV_PATH} | xargs) && echo "APP_MAIN_FOLDER="$$APP_MAIN_FOLDER
	@export $$(cat ${ENV_PATH} | xargs) && echo "HTTP_PORT="$$HTTP_PORT
	@export $$(cat ${ENV_PATH} | xargs) && echo "DB_PORT="$$
	@export $$(cat ${ENV_PATH} | xargs) && echo "MONGO_DB_DSN="$$MONGO_DB_DSN
	@export $$(cat ${ENV_PATH} | xargs) && echo "MONGO_DB_DATABASE="$$MONGO_DB_DATABASE

sleep:
	@sleep 5

requirements:
	@docker -v > /dev/null 2>&1 || { echo >&2 "I require docker but it's not installed. See : https://www.docker.com/"; exit 127;}
	@docker-compose -v > /dev/null 2>&1 || { echo >&2 "I require docker-compose but it's not installed. See : https://docs.docker.com/compose/install/"; exit 127;}
	@cat ${ENV_PATH}