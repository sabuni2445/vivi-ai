require('dotenv').config();
const { generateVideo, pollTaskStatus } = require('./services/freepik');

async function runTest() {
    console.log('--- Freepik Video Connection Test ---');
    
    try {
        const testScenes = [
            {
                visual_prompt: "a futuristic running shoe",
                voiceover: "Step into the future.",
                image_url: "https://ai-statics.freepik.com/content/mg-upscaler/s2dqhgupcje6be63goe6iv5xhu/ffc11780-1375-4249-82e3-ded7faa9c983_a8214a43-a76c-4897-bc73-14514f617a39.png?token=exp=1778391481~hmac=5b535896fc55fb7418aa98795477e93c"
            },
            {
                visual_prompt: "the shoe running fast",
                voiceover: "With incredible speed.",
                image_url: "https://ai-statics.freepik.com/content/mg-upscaler/s2dqhgupcje6be63goe6iv5xhu/ffc11780-1375-4249-82e3-ded7faa9c983_a8214a43-a76c-4897-bc73-14514f617a39.png?token=exp=1778391481~hmac=5b535896fc55fb7418aa98795477e93c"
            }
        ];

        console.log('\n1. Testing Video Generation (Start)...');
        const taskId = await generateVideo(testScenes);
        
        if (typeof taskId === 'string') {
            console.log('Task Created! ID:', taskId);
            
            const pollInterval = setInterval(async () => {
                const status = await pollTaskStatus(taskId, 'video');
                console.log('\n2. Polling Result:', status);
                if (status.status === 'succeed') {
                    console.log('SUCCESS! Video URL:', status.resultUrl);
                    clearInterval(pollInterval);
                } else if (status.status === 'failed') {
                    console.log('Task Failed.');
                    clearInterval(pollInterval);
                } else {
                    console.log('Status is still:', status.status);
                }
            }, 5000);
        }

    } catch (error) {
        console.error('\n❌ Test Failed:', error.message);
    }
}

runTest();
