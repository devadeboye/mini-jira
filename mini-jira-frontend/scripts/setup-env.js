#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envLocalPath = path.join(process.cwd(), '.env.local');

// Generate a random secret for NEXTAUTH_SECRET
function generateSecret() {
    return crypto.randomBytes(32).toString('base64');
}

// Default environment variables
const defaultEnvVars = {
    NEXTAUTH_SECRET: generateSecret(),
    NEXTAUTH_URL: 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: 'http://localhost:4000',
    NODE_ENV: 'development'
};

// Check if .env.local already exists
if (fs.existsSync(envLocalPath)) {
    console.log('✅ .env.local already exists');
    process.exit(0);
}

// Create .env.local file
const envContent = Object.entries(defaultEnvVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

try {
    fs.writeFileSync(envLocalPath, envContent);
    console.log('✅ Created .env.local with default values');
    console.log('📝 Please update the API URL if your backend runs on a different port');
    console.log('🔑 A secure NEXTAUTH_SECRET has been generated for you');
} catch (error) {
    console.error('❌ Failed to create .env.local:', error.message);
    process.exit(1);
} 