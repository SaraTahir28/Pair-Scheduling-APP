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

clean:
	docker compose down -v

RUFF := $(shell command -v ruff 2>/dev/null || echo Backend/venv/bin/ruff)

format:
	npx prettier --write .
	$(RUFF) format Backend

format-check:
	npx prettier --check .
	$(RUFF) format --check Backend
	$(RUFF) check Backend

.PHONY: dev dev-build prod prod-build down down-prod logs clean format format-check
