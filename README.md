# Coordinadora Challenge - Backend

Shipping quote and tracking API built with Express, TypeScript, and Clean Architecture.

## Quick Start (Docker)

````bash
# Configure environment
cp .env.example .env

### Environment Variables

```env
### Server
PORT=4000

### Database (MySQL)
DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=root
DB_PASSWORD=root_password
DB_DATABASE=challenge_coordinadora

### Redis
REDIS_HOST=localhost
REDIS_PORT=6379

### Auth vars
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=86400
````

# Start all containers (app, MySQL, Redis)

docker-compose up -d --build

# Run migrations and seed

docker exec coordinadora_app npm run migration:run
docker exec coordinadora_app npm run db:seed

````

## Make Commands for local development

```bash
# Development
make install          # Install dependencies
make dev              # Run dev server
make build            # Build TypeScript

# Docker
make up               # Start containers
make up-build         # Build and start containers
make down             # Stop containers
make logs             # View logs

# Database
make db-shell         # MySQL CLI
make redis-shell      # Redis CLI
make migration-run    # Run migrations
````

## Architecture

```
src/
├── domain/          # Entities, business rules
├── application/     # Use cases, repository interfaces, DTOs
├── infrastructure/  # Database, Redis, external services
├── adapters/        # Controllers, validators, DI container
└── framework/       # Express routes, middlewares
```

**Layers:**

- **Domain** → Pure business logic, no dependencies
- **Application** → Orchestrates use cases, defines interfaces
- **Infrastructure** → Implements interfaces (MySQL, Redis, JWT)
- **Adapters** → HTTP controllers, input validation
- **Framework** → Express setup, routes, middlewares

## API Endpoints

| Method | Endpoint                              | Description              |
| ------ | ------------------------------------- | ------------------------ |
| POST   | /api/auth/register                    | Register user            |
| POST   | /api/auth/login                       | Login                    |
| GET    | /api/locations                        | List locations           |
| POST   | /api/quote                            | Calculate shipping quote |
| POST   | /api/shipments                        | Create shipment          |
| GET    | /api/shipments                        | List user shipments      |
| GET    | /api/shipments/:trackingNumber/status | Get shipment status      |

**Swagger Docs:** http://localhost:4000/api/docs

## WebSocket (Real-time Tracking)

Connect with Socket.IO using JWT auth:

```javascript
const socket = io("http://localhost:4000", { auth: { token: "JWT" } });
socket.emit("join_shipment", { shipmentId: 123 });
socket.on("status_updated", (data) => {
  /* update UI */
});
```

## Scripts

```bash
npm run dev              # Development server
npm run build            # Build for production
npm run test             # Run tests
npm run migration:run    # Run database migrations
npm run migration:revert # Revert last migration
npm run db:seed          # Seed database with initial data
```
