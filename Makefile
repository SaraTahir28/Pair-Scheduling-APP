dev:
	docker compose up

dev-build:
	docker compose up --build

prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up

prod-build:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build

down:
	docker compose down

down-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml down

logs:
	docker compose logs -f

.PHONY: dev dev-build prod prod-build down down-prod logs
