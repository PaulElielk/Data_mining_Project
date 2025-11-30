import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const dbName = process.env.DB_NAME || 'project_dm';

async function initDatabase() {
  let connection;
  
  try {
    // Connect to MySQL without selecting a database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' created or already exists`);

    // Select the database
    await connection.query(`USE \`${dbName}\``);

    // Create products table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        imageUrl VARCHAR(500),
        category ENUM('smartphones', 'cars') NOT NULL,
        brand VARCHAR(100),
        storage VARCHAR(50),
        color VARCHAR(50),
        screenSize VARCHAR(50),
        battery VARCHAR(100),
        engine VARCHAR(100),
        \`range\` VARCHAR(50),
        acceleration VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_brand (brand)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createTableQuery);
    console.log('✅ Products table created or already exists');

    // Check if data already exists
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
    const count = rows[0].count;

    if (count === 0) {
      console.log('📦 Seeding database with initial data...');
      
      // Read and insert smartphones data
      const smartphonesPath = path.join(__dirname, '../my-app/public/data/smartphones.json');
      const carsPath = path.join(__dirname, '../my-app/public/data/cars.json');

      if (fs.existsSync(smartphonesPath)) {
        const smartphonesData = JSON.parse(fs.readFileSync(smartphonesPath, 'utf8'));
        for (const product of smartphonesData) {
          await connection.query(
            `INSERT INTO products (id, name, description, price, imageUrl, category, brand, storage, color, screenSize, battery)
             VALUES (?, ?, ?, ?, ?, 'smartphones', ?, ?, ?, ?, ?)`,
            [
              product.id,
              product.name,
              product.description,
              product.price,
              product.imageUrl,
              product.brand,
              product.storage,
              product.color,
              product.screenSize,
              product.battery
            ]
          );
        }
        console.log(`✅ Inserted ${smartphonesData.length} smartphones`);
      }

      if (fs.existsSync(carsPath)) {
        const carsData = JSON.parse(fs.readFileSync(carsPath, 'utf8'));
        for (const product of carsData) {
          await connection.query(
            `INSERT INTO products (id, name, description, price, imageUrl, category, brand, engine, color, \`range\`, acceleration)
             VALUES (?, ?, ?, ?, ?, 'cars', ?, ?, ?, ?, ?)`,
            [
              product.id,
              product.name,
              product.description,
              product.price,
              product.imageUrl,
              product.brand,
              product.engine,
              product.color,
              product.range,
              product.acceleration
            ]
          );
        }
        console.log(`✅ Inserted ${carsData.length} cars`);
      }

      console.log('✅ Database seeded successfully!');
    } else {
      console.log(`ℹ️  Database already contains ${count} products. Skipping seed.`);
    }

    console.log('\n🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run initialization
initDatabase();

