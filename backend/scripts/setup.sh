#!/bin/bash

# Card Genius Database Setup Script
# This script creates the database and seeds initial data

echo "🚀 Starting Card Genius Database Setup..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Run database setup
echo "📦 Creating database and tables..."
node scripts/createDatabase.js

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "❌ Database creation failed"
    exit 1
fi

# Seed data
echo "🌱 Seeding database..."
npm run seed

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
    echo "🎉 Setup completed!"
else
    echo "❌ Seeding failed"
    exit 1
fi

