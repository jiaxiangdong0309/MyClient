#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Building the project..."
npm run build

echo "Checking if dist directory exists..."
if [ -d "dist" ]; then
  echo "dist directory exists, build successful!"
  ls -la dist
else
  echo "ERROR: dist directory does not exist, build failed!"
  exit 1
fi