require('dotenv').config();
const { improvePrompt, generateMysticImage, generateImage, pollTaskStatus } = require('./services/freepik');

async function runTest() {
    console.log('--- Freepik API Connection Test ---');
    
    try {
        // 1. Test Prompt Improvement
        console.log('\n1. Testing Prompt Improvement...');
        const rawPrompt = 'a futuristic running shoe on a volcanic rock';
        const improved = await improvePrompt(rawPrompt);
        console.log('Original:', rawPrompt);
        console.log('Improved:', improved);

        // 2. Test Standard Image Generation
        console.log('\n2. Testing Standard Image Generation...');
        const stdResult = await generateImage(rawPrompt);
        console.log('Standard Result:', stdResult);

        // 3. Test Mystic Image Generation (Start)
        console.log('\n3. Testing Mystic Image Generation (Start)...');
        const taskId = await generateMysticImage(improved, 'widescreen_16_9');
        
        if (typeof taskId === 'string') {
            console.log('Task Created! ID:', taskId);
            
            // 3. Test Polling continuously
            const pollInterval = setInterval(async () => {
                const status = await pollTaskStatus(taskId, 'image');
                console.log('\n3. Polling Result:', status);
                if (status.status === 'succeed') {
                    console.log('SUCCESS! Image URL:', status.resultUrl);
                    clearInterval(pollInterval);
                } else if (status.status === 'failed') {
                    console.log('Task Failed.');
                    clearInterval(pollInterval);
                } else {
                    console.log('Status is still:', status.status);
                }
            }, 5000);
        } else if (taskId.directUrl) {
            console.log('SUCCESS! Direct Image URL:', taskId.directUrl);
        }

    } catch (error) {
        console.error('\n❌ Test Failed:', error.message);
    }
}

runTest();
