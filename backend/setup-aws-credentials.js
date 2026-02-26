#!/usr/bin/env node

/**
 * AWS Credentials Setup Helper
 * 
 * This script helps you set up AWS credentials for Polly Text-to-Speech
 * Run with: node setup-aws-credentials.js
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

async function setupAwsCredentials() {
  console.log('\n🔧 AWS Credentials Setup for Polly Text-to-Speech\n');
  console.log('This script will help you configure AWS credentials for the AI Interview system.\n');

  try {
    // Get AWS credentials from user
    const accessKeyId = await question('Enter your AWS Access Key ID: ');
    const secretAccessKey = await question('Enter your AWS Secret Access Key: ');
    const region = await question('Enter AWS Region (default: us-east-1): ') || 'us-east-1';

    if (!accessKeyId || !secretAccessKey) {
      console.error('\n❌ Error: AWS Access Key ID and Secret Access Key are required!');
      process.exit(1);
    }

    // Path to .env file
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';

    // Read existing .env file if it exists
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log('\n📝 Found existing .env file. Updating AWS credentials...');
    } else {
      console.log('\n📝 Creating new .env file...');
    }

    // Update or add AWS credentials
    const lines = envContent.split('\n');
    const updatedLines = [];
    let hasAwsAccessKey = false;
    let hasAwsSecretKey = false;
    let hasAwsRegion = false;

    for (const line of lines) {
      if (line.startsWith('AWS_ACCESS_KEY_ID=')) {
        updatedLines.push(`AWS_ACCESS_KEY_ID=${accessKeyId}`);
        hasAwsAccessKey = true;
      } else if (line.startsWith('AWS_SECRET_ACCESS_KEY=')) {
        updatedLines.push(`AWS_SECRET_ACCESS_KEY=${secretAccessKey}`);
        hasAwsSecretKey = true;
      } else if (line.startsWith('AWS_REGION=')) {
        updatedLines.push(`AWS_REGION=${region}`);
        hasAwsRegion = true;
      } else {
        updatedLines.push(line);
      }
    }

    // Add missing AWS credentials
    if (!hasAwsAccessKey) {
      updatedLines.push(`AWS_ACCESS_KEY_ID=${accessKeyId}`);
    }
    if (!hasAwsSecretKey) {
      updatedLines.push(`AWS_SECRET_ACCESS_KEY=${secretAccessKey}`);
    }
    if (!hasAwsRegion) {
      updatedLines.push(`AWS_REGION=${region}`);
    }

    // Write updated .env file
    fs.writeFileSync(envPath, updatedLines.join('\n'));

    console.log('\n✅ AWS credentials configured successfully!');
    console.log('\n📍 Configuration saved to:', envPath);
    console.log('\n🚀 Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Test the text-to-speech functionality');
    console.log('3. If you still get errors, verify your AWS credentials have Polly permissions');

    // Verify credentials format
    console.log('\n📋 Credentials Summary:');
    console.log('- Access Key ID:', accessKeyId.substring(0, 8) + '...');
    console.log('- Secret Access Key:', secretAccessKey.substring(0, 8) + '...');
    console.log('- Region:', region);

  } catch (error) {
    console.error('\n❌ Error setting up credentials:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Check if this is being run directly
if (process.argv[1] === filename) {
  setupAwsCredentials();
}

export { setupAwsCredentials };
