#!/bin/bash

# Clean up node_modules to start fresh
rm -rf frontend/node_modules
rm -rf backend/node_modules

# Install and build frontend
cd frontend
npm install --no-optional
npm run build
cd ..

# Install backend dependencies
cd backend
npm install --no-optional
cd ..
