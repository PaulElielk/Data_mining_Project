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
  database: process.env.DB_NAME || 'project_dm',
};

async function addCars() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server');

    // Read cars data
    const carsPath = path.join(__dirname, '../my-app/public/data/cars.json');
    
    if (!fs.existsSync(carsPath)) {
      console.error('❌ Cars JSON file not found at:', carsPath);
      process.exit(1);
    }

    const carsData = JSON.parse(fs.readFileSync(carsPath, 'utf8'));
    console.log(`📦 Found ${carsData.length} cars in JSON file`);

    let added = 0;
    let skipped = 0;

    for (const product of carsData) {
      // Check if product already exists
      const [existing] = await connection.query(
        'SELECT id FROM products WHERE id = ? AND category = ?',
        [product.id, 'cars']
      );

      if (existing.length > 0) {
        console.log(`⏭️  Car with ID ${product.id} (${product.name}) already exists. Skipping...`);
        skipped++;
        continue;
      }

      // Insert the car
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
      console.log(`✅ Added car: ${product.name} (ID: ${product.id})`);
      added++;
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Added: ${added} cars`);
    console.log(`   ⏭️  Skipped: ${skipped} cars (already exist)`);
    console.log(`\n🎉 Done! Total cars in database: ${added + skipped}`);
    
  } catch (error) {
    console.error('❌ Error adding cars:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
addCars();

