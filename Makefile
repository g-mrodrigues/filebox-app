SHELL:=/bin/bash
HTTP_PORT?=3000
DB_PORT?=27017
APP_MAIN_FOLDER?=../../..
HOST?=uploader.test
PROJECT_NAME?=uploader
ENVIRONMENT?=development
CONTAINER?=app

all: server_up sleep

server_up: requirements
	@export $$(cat .env | xargs) && cd .infrastructure/env/${ENVIRONMENT} && docker-compose -f docker-compose.yml up --build

server_halt: requirements
	@export $$(cat .env | xargs) && cd .infrastructure/env/${ENVIRONMENT} && docker-compose -f docker-compose.yml stop

server_start: requirements
	@export $$(cat .env | xargs) && cd .infrastructure/env/${ENVIRONMENT} && docker-compose -f docker-compose.yml start

server_reload: requirements
	@export $$(cat .env | xargs) && cd .infrastructure/env/${ENVIRONMENT} && docker-compose -f docker-compose.yml stop && docker-compose -f docker-compose.yml start

server_destroy: requirements
	@export $$(cat .env | xargs) && cd .infrastructure/env/${ENVIRONMENT} && docker-compose -f docker-compose.yml stop && docker-compose -f docker-compose.yml rm

ssh: requirements
	@export $$(cat .env | xargs) && docker exec -it $${PROJECT_NAME}_${CONTAINER} bash

set_variable:
	@echo "PROJECT_NAME=${PROJECT_NAME}" > .env
	@echo "HOST=${HOST}" >> .env
	@echo "APP_MAIN_FOLDER=${APP_MAIN_FOLDER}" >> .env
	@echo "HTTP_PORT=${HTTP_PORT}" >> .env
	@echo "DB_PORT=${DB_PORT}" >> .env

get_variable:
	@export $$(cat .env | xargs) && echo "PROJECT_NAME="$$PROJECT_NAME
	@export $$(cat .env | xargs) && echo "HOST="$$HOST
	@export $$(cat .env | xargs) && echo "APP_MAIN_FOLDER="$$APP_MAIN_FOLDER
	@export $$(cat .env | xargs) && echo "HTTP_PORT="$$HTTP_PORT
	@export $$(cat .env | xargs) && echo "DB_PORT="$$DB_PORT

sleep:
	@sleep 5

requirements:
	@docker -v > /dev/null 2>&1 || { echo >&2 "I require docker but it's not installed. See : https://www.docker.com/"; exit 127;}
	@docker-compose -v > /dev/null 2>&1 || { echo >&2 "I require docker-compose but it's not installed. See : https://docs.docker.com/compose/install/"; exit 127;}
	@cat .env || make set_variable