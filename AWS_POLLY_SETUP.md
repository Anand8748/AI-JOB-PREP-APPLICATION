# AWS Polly Text-to-Speech Setup

## 🚨 Quick Fix for "UnrecognizedClientException" Error

If you're getting this error:
```
UnrecognizedClientException: The security token included in the request is invalid.
```

### **Solution 1: Run the Setup Script**
```bash
cd backend
node setup-aws-credentials.js
```

### **Solution 2: Manual Setup**
Create or update your `.env` file in the backend directory:
```env
AWS_ACCESS_KEY_ID=your_actual_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_actual_aws_secret_key_here
AWS_REGION=us-east-1
```

### **Solution 3: Verify AWS Credentials**
1. Check your AWS IAM credentials
2. Ensure the user has `AmazonPollyFullAccess` permission
3. Verify the keys are correct and not expired

---

## Overview
This implementation uses AWS Polly for high-quality text-to-speech conversion instead of browser's native speech synthesis.

## Prerequisites

### 1. AWS Account Setup
1. Create an AWS account at https://aws.amazon.com/
2. Go to IAM (Identity and Access Management)
3. Create a new user with programmatic access
4. Attach `AmazonPollyFullAccess` policy
5. Save Access Key ID and Secret Access Key

### 2. Install Dependencies
```bash
# Frontend
cd frontend
npm install aws-sdk

# Backend (optional, if using backend route)
cd backend
npm install aws-sdk
```

## Configuration

### Backend Environment Variables
Create `.env` file in backend directory:
```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1

# Other required variables
MONGODB_URI=mongodb://localhost:27017/ai-interview
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
```

### Frontend Environment Variables
Create `.env.local` file in frontend directory:
```env
# AWS Configuration (if using frontend directly)
REACT_APP_AWS_ACCESS_KEY_ID=your_aws_access_key_here
REACT_APP_AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
REACT_APP_AWS_REGION=us-east-1

# Backend Configuration
VITE_BACKEND_URL=http://localhost:3000
```

## Available Voices

### Neural Voices (Recommended)
- **Joanna** - US English Female (Default)
- **Matthew** - US English Male
- **Amy** - British English Female
- **Emma** - British English Female
- **Brian** - British English Male
- **Ivy** - US English Female
- **Justin** - US English Male
- **Kendra** - US English Female
- **Kimberly** - US English Female
- **Salli** - US English Female

## Features

### 1. Voice Selection
- Dropdown menu to choose different voices
- Real-time voice switching
- Voice preferences saved during session

### 2. Audio Caching
- Intelligent caching to reduce API calls
- Automatic cache cleanup after 5 minutes
- Improved performance and cost savings

### 3. Fallback Support
- Automatic fallback to browser TTS if Polly fails
- Graceful error handling
- No interruption in user experience

### 4. High-Quality Audio
- Neural engine for natural-sounding voices
- 22.05 kHz sample rate
- MP3 format for wide compatibility

## Troubleshooting

### Common Issues

#### 1. "UnrecognizedClientException" Error
**Cause**: Invalid AWS credentials
**Solution**: 
- Run `node setup-aws-credentials.js` in backend directory
- Or manually update `.env` file with correct credentials
- Verify IAM user has Polly permissions

#### 2. "Access Denied" Error
**Cause**: Insufficient IAM permissions
**Solution**: 
- Attach `AmazonPollyFullAccess` policy to your IAM user
- Check AWS region permissions
- Verify account is in good standing

#### 3. Voice Not Available
**Cause**: Voice doesn't support neural engine
**Solution**: 
- Check if voice supports neural engine
- Verify language code
- Try different voice (Joanna always works)

#### 4. Audio Not Playing
**Cause**: Browser or network issues
**Solution**: 
- Check browser audio support
- Verify audio format
- Check network connectivity

#### 5. High Latency
**Cause**: AWS region distance
**Solution**: 
- Use nearest AWS region
- Implement better caching
- Check network speed

## Debug Mode

Enable debug logging by checking console output:
```javascript
// The system now automatically logs:
console.log('AWS Configuration:');
console.log('- Access Key ID:', accessKeyId ? 'Set' : 'NOT SET');
console.log('- Secret Access Key:', secretAccessKey ? 'Set' : 'NOT SET');
console.log('- Region:', region);
```

## Security Best Practices

### 1. Environment Variables
- Never commit AWS credentials to git
- Use different keys for development/production
- Rotate keys regularly

### 2. IAM Policies
- Use least privilege principle
- Create specific policy for Polly only
- Monitor access logs

### 3. CORS Configuration
- Configure CORS for your domain
- Use HTTPS in production
- Validate requests

## Performance Optimization

### 1. Caching Strategy
- Cache frequently used phrases
- Implement LRU cache
- Set appropriate expiration

### 2. Text Preprocessing
- Remove unnecessary punctuation
- Optimize text length
- Use SSML for better pronunciation

### 3. Network Optimization
- Use HTTP/2 if available
- Implement request batching
- Add retry logic

## Cost Considerations

### AWS Polly Pricing (as of 2024)
- **Neural Voices**: $4.00 per 1M characters
- **Standard Voices**: $4.00 per 1M characters
- **Free Tier**: 5M characters per month for 12 months

### Cost Optimization
- Audio caching reduces repeated API calls
- Intelligent text preprocessing
- Efficient voice selection

## Support

For issues with AWS Polly:
1. Check AWS Service Health Dashboard
2. Review IAM permissions
3. Verify network connectivity
4. Check AWS billing and limits

## Quick Start Commands

```bash
# 1. Setup AWS credentials
cd backend
node setup-aws-credentials.js

# 2. Install dependencies
npm install aws-sdk

# 3. Start backend
npm run dev

# 4. Test text-to-speech
# The system will now work with proper AWS credentials
```
