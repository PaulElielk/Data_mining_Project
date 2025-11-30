# Data_mining_Project
Data mining Final Project

Project Setup Guide (Frontend + Backend + XAMPP + MySQL)

REQUIREMENTS
Install the following before running the project:

XAMPP (for MySQL + Apache)
Node.js and npm
Nodemon (install with: npm install -g nodemon)
React, Express.js, mysql2, Axios (installed through npm)

DATABASE SETUP (XAMPP)

Open XAMPP Control Panel.
Start MySQL and Apache .
Open phpMyAdmin: http://localhost/phpmyadmin
Create a database named: Project_DM
Import the file: Project_DM.sql or run it through sql panel ( file located in web scraping project\backend\database setup)

PROJECT INSTALLATION

Download or clone the project.
Extract all contents into a single main folder.

BACKEND SETUP

Open a terminal inside the backend folder: cd backend

Install dependencies: npm install

Start the backend using Nodemon: nodemon server.js

You should see: "Server running..." "MySQL connected..."

FRONTEND SETUP (REACT)

Open a second terminal inside the MyApp or frontend folder: cd my-app

Install dependencies: npm install

Start the frontend: npm start

The React app will run at: http://localhost:3000

CONNECTING FRONTEND & BACKEND

Ensure Axios requests use your backend URL: http://localhost:5000

RUNNING THE FULL STACK

Start XAMPP → Start MySQL.
Backend terminal → nodemon server.js
Frontend terminal → npm start
Open your browser → http://localhost:3000

FEATURES INCLUDED

Dynamic product listing
Search, sorting, filtering
Product detail pages
Recently viewed items
Favorites / wishlist
Apriori-based recommendation engine
Full MySQL backend + Node.js API
