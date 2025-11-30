# Quick Setup Guide

## Step 1: Install Dependencies
```bash
cd backend
npm install
```

## Step 2: Create .env File
Create a `.env` file in the backend folder with the following content:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=project_dm
PORT=5000
NODE_ENV=development
```

**Note:** If your XAMPP MySQL has a password, update `DB_PASSWORD` accordingly.

## Step 3: Start XAMPP MySQL
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Wait until it shows "Running"

## Step 4: Initialize Database
> Prefer importing the curated dump:
> ```bash
> mysql -u root -p < ../python/project_dm.sql
> ```
> The `init-db` script is only needed for the legacy sample data. If you still want to run it:
> ```bash
> npm run init-db
> ```

## Step 5: Start the Server
```bash
npm start
```

The API will be available at: `http://localhost:5000`

## Step 6: Update Frontend
Update your frontend files to use the API:

**In `ListingPage.jsx`:**
```javascript
// Change this line:
const response = await axios.get(`/data/${category}.json`);

// To:
const response = await axios.get(`http://localhost:5000/api/products/${category}`);
```

**In `productPage.jsx`:**
```javascript
// Change this line:
const productsRes = await axios.get(`/data/${category}.json`);

// To:
const productsRes = await axios.get(`http://localhost:5000/api/products/${category}`);
```

## API Endpoints
- `GET /api/products/smartphones` - Get all smartphones
- `GET /api/products/cars` - Get all cars
- `GET /api/products/smartphones/:id` - Get specific smartphone
- `GET /api/products/cars/:id` - Get specific car
- `GET /api/health` - Check server status

