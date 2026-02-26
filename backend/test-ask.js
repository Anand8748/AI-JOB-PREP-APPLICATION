import fetch from 'node-fetch';

const testAskEndpoint = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'test-user-123',
        interviewId: 'bb90fb99-1095-47e7-9455-98c6b1486873',
        message: 'Hello, can you tell me about yourself?'
      })
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('✅ /api/ask endpoint working!');
    } else {
      console.log('❌ /api/ask endpoint failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testAskEndpoint();
