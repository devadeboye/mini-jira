#!/usr/bin/env node

/**
 * Environment Configuration Checker
 * This script validates that all required environment variables are set
 */

const fs = require("fs");
const path = require("path");

const requiredEnvVars = ["NEXT_PUBLIC_API_URL"];

const optionalEnvVars = ["NODE_ENV"];

function parseEnvFile(filePath) {
	if (!fs.existsSync(filePath)) {
		return {};
	}

	const content = fs.readFileSync(filePath, "utf8");
	const env = {};

	content.split("\n").forEach((line) => {
		line = line.trim();
		if (line && !line.startsWith("#")) {
			const [key, ...valueParts] = line.split("=");
			if (key && valueParts.length > 0) {
				env[key.trim()] = valueParts.join("=").trim();
			}
		}
	});

	return env;
}

function checkEnvironment() {
	console.log("🔍 Checking environment configuration...\n");

	// Check if .env.local exists
	const envLocalPath = path.join(process.cwd(), ".env.local");
	if (!fs.existsSync(envLocalPath)) {
		console.log("⚠️  .env.local file not found");
		console.log("💡 Run: cp .env.example .env.local\n");
		return false;
	}

	// Parse environment file
	const envVars = parseEnvFile(envLocalPath);

	let allValid = true;

	// Check required variables
	console.log("📋 Required Environment Variables:");
	requiredEnvVars.forEach((varName) => {
		const value = envVars[varName] || process.env[varName];
		if (value) {
			console.log(`✅ ${varName}: ${value}`);
		} else {
			console.log(`❌ ${varName}: NOT SET`);
			allValid = false;
		}
	});

	console.log("\n📋 Optional Environment Variables:");
	optionalEnvVars.forEach((varName) => {
		const value = envVars[varName] || process.env[varName];
		if (value) {
			console.log(`✅ ${varName}: ${value}`);
		} else {
			console.log(`⚪ ${varName}: not set (optional)`);
		}
	});

	console.log("\n" + "=".repeat(50));

	if (allValid) {
		console.log("🎉 Environment configuration is valid!");
		return true;
	} else {
		console.log("❌ Environment configuration has issues");
		console.log("💡 Please check your .env.local file");
		return false;
	}
}

if (require.main === module) {
	const isValid = checkEnvironment();
	process.exit(isValid ? 0 : 1);
}

module.exports = { checkEnvironment };
