# Backend API - Product Store

Node.js backend with Express and MySQL for the Product Store application.

## Prerequisites

- Node.js (v14 or higher)
- XAMPP with MySQL running
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update it with your MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env` file with your XAMPP MySQL settings:
- `DB_HOST`: Usually `localhost`
- `DB_PORT`: Usually `3306`
- `DB_USER`: Usually `root`
- `DB_PASSWORD`: Leave empty if no password is set (default XAMPP)
- `DB_NAME`: Database name (default: `project_dm`)

### 3. Start XAMPP MySQL

1. Open XAMPP Control Panel
2. Start the MySQL service
3. Make sure it's running on port 3306

### 4. Initialize Database

This will create the database, tables, and seed initial data:

```bash
npm run init-db
```

This script targets the legacy JSON-driven schema. In most cases you can skip it and instead load the curated MySQL dump described below.

### 4b. Import the `project_dm` database (Preferred)

The production data—Jumia smartphones and CoinAfrique cars—is bundled as `python/project_dm.sql`.

1. Import the dump (from the workspace root):
   ```bash
   mysql -u root -p < python/project_dm.sql
   ```
2. Update `.env` and set `DB_NAME=project_dm` (already the default)
3. Restart the backend server

With this configuration:
- `GET /api/products/cars` reads from `coin_afrique_cars`
- `GET /api/products/smartphones` reads from `jumia_products`

You no longer need to run `npm run init-db` unless you want to seed the legacy `products` table for testing.

### 5. Start the Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check server and database status

### Products
- `GET /api/products/:category` - Get all products by category (smartphones or cars)
- `GET /api/products/:category/:id` - Get a single product by category and ID
- `GET /api/products?category=smartphones` - Get all products (optional category filter)

### Examples

```bash
# Get all smartphones
GET http://localhost:5000/api/products/smartphones

# Get all cars
GET http://localhost:5000/api/products/cars

# Get specific smartphone
GET http://localhost:5000/api/products/smartphones/1

# Get specific car
GET http://localhost:5000/api/products/cars/1
```

## Database Schema

### Products Table

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(50) | Primary key |
| name | VARCHAR(255) | Product name |
| description | TEXT | Product description |
| price | DECIMAL(10,2) | Product price |
| imageUrl | VARCHAR(500) | Product image URL |
| category | ENUM | 'smartphones' or 'cars' |
| brand | VARCHAR(100) | Product brand |
| storage | VARCHAR(50) | Storage (smartphones) |
| color | VARCHAR(50) | Product color |
| screenSize | VARCHAR(50) | Screen size (smartphones) |
| battery | VARCHAR(100) | Battery info (smartphones) |
| engine | VARCHAR(100) | Engine type (cars) |
| range | VARCHAR(50) | Range (cars) |
| acceleration | VARCHAR(100) | Acceleration (cars) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### project_dm Tables (CSV import)

| Table | Description | API Category |
|-------|-------------|--------------|
| `coin_afrique_cars` | CoinAfrique vehicle listings scraped from CSV | `cars` |
| `jumia_products` | Jumia technology product listings scraped from CSV | `smartphones` |

Both tables are transformed on the fly so the frontend continues to receive the same `id`, `name`, `description`, `price`, and `imageUrl` fields it expects.

## Troubleshooting

### Database Connection Issues

1. **Check XAMPP MySQL is running**
   - Open XAMPP Control Panel
   - Ensure MySQL service is started

2. **Verify credentials in `.env`**
   - Default XAMPP MySQL user is `root` with no password
   - Port should be `3306`

3. **Check if database exists**
   ```sql
   SHOW DATABASES;
   ```

4. **Test connection manually**
   ```bash
   mysql -u root -h localhost -P 3306
   ```

### Port Already in Use

If port 5000 is already in use, change it in `.env`:
```
PORT=5001
```

## Frontend Integration

Update your frontend to use the API instead of JSON files:

```javascript
// In ListingPage.jsx and productPage.jsx
// Change from:
const response = await axios.get(`/data/${category}.json`);

// To:
const response = await axios.get(`http://localhost:5000/api/products/${category}`);
```

Make sure to add CORS configuration if needed (already included in this backend).

## Development

- The server uses Express.js for routing
- MySQL2 with connection pooling for database operations
- CORS enabled for frontend communication
- Environment-based configuration


