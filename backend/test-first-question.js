import axios from 'axios';

async function testFirstQuestion() {
    try {
        console.log('🧪 Testing First Question Fix with System Prompt...\n');
        
        // Test with a new user ID to simulate first interaction
        const response = await axios.post('http://localhost:3000/api/ask', {
            userId: 'new-test-user-' + Date.now(),
            message: 'Start interview'
        });
        
        if (response.data.success) {
            console.log('✅ First Question Test:');
            console.log('📝 AI Response:', response.data.reply);
            
            if (response.data.reply.includes('Tell me about yourself')) {
                console.log('🎉 SUCCESS! First question is "Tell me about yourself"');
            } else {
                console.log('❌ First question is not "Tell me about yourself"');
            }
        } else {
            console.log('❌ Request failed');
        }
        
    } catch (error) {
        if (error.response) {
            console.log('❌ Test failed with status:', error.response.status);
            console.log('Error details:', error.response.data);
        } else {
            console.log('❌ Test failed:', error.message);
        }
    }
}

testFirstQuestion();
