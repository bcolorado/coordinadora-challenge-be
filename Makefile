# ==========================================
# Coordinadora Challenge - Makefile
# ==========================================

# Default target
help:
	@echo.
	@echo   Coordinadora Challenge - Available Commands
	@echo   ============================================
	@echo.
	@echo   Development:
	@echo     make install          - Install dependencies
	@echo     make dev              - Run development server
	@echo     make build            - Build TypeScript
	@echo     make clean            - Remove dist and node_modules
	@echo.
	@echo   Docker:
	@echo     make up               - Start all containers
	@echo     make up-build         - Build and start containers
	@echo     make down             - Stop all containers
	@echo     make logs             - View container logs
	@echo     make ps               - List running containers
	@echo.
	@echo   Database:
	@echo     make db-shell         - Open MySQL shell
	@echo     make redis-shell      - Open Redis CLI
	@echo     make migration-run    - Run pending migrations
	@echo     make migration-revert - Revert last migration
	@echo     make migration-generate name=Name - Generate migration
	@echo.

# ==========================================
# Development Commands
# ==========================================

install:
	npm install

dev:
	npm run dev

build:
	npm run build

clean:
	if exist node_modules rmdir /s /q node_modules
	if exist dist rmdir /s /q dist

# ==========================================
# Docker Commands
# ==========================================

up:
	docker-compose up -d

up-build:
	docker-compose up -d --build

down:
	docker-compose down

down-volumes:
	docker-compose down -v

logs:
	docker-compose logs -f

ps:
	docker-compose ps

# ==========================================
# Database Commands
# ==========================================

db-shell:
	docker exec -it coordinadora_db mysql -u root -p

redis-shell:
	docker exec -it coordinadora_redis redis-cli

migration-run:
	npm run migration:run

migration-revert:
	npm run migration:revert

migration-create:
	npm run migration:create --name=$(name)
