const axios = require('axios');

const FREEPIK_API_URL = 'https://api.freepik.com/v1';
const API_KEY = process.env.FREEPIK_API_KEY;

const client = axios.create({
    baseURL: FREEPIK_API_URL,
    headers: {
        'x-freepik-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

/**
 * Generate an image using Freepik AI Image API
 * @param {string} prompt 
 * @returns {Promise<string>} task_id
 */
async function generateImage(prompt) {
    try {
        console.log(`[Freepik] Requesting image for: "${prompt.substring(0, 50)}..."`);
        const response = await client.post('/ai/text-to-image', {
            prompt: prompt,
            num_images: 1,
            image_size: '9:16'
        });
        
        console.log(`[Freepik] Status: ${response.status}`);
        console.log(`[Freepik] Response Data:`, JSON.stringify(response.data));

        // Handle different possible response structures
        // Check for direct image data first (Synchronous result)
        const imgObj = response.data?.data?.[0] || response.data;
        let directUrl = imgObj?.url || imgObj?.base64;
        
        // If it's raw base64, wrap it in a data URI
        if (imgObj?.base64 && !imgObj.base64.startsWith('data:')) {
            directUrl = `data:image/jpeg;base64,${imgObj.base64}`;
        }
        
        if (directUrl) {
            console.log('[Freepik] Success: Image returned immediately.');
            return { directUrl };
        }

        const taskId = response.data?.data?.task_id || response.data?.task_id || response.data?.data?.id;
        
        if (!taskId) {
            console.error('[Freepik] CRITICAL: No Task ID or URL found in response! Full data:', JSON.stringify(response.data));
        }

        return taskId;
    } catch (error) {
        console.error('Freepik Image Gen Error:', error.response?.data || error.message);
        // Log the full error for deep debugging
        if (error.response) {
            console.error('[Freepik Error Detail]:', JSON.stringify(error.response.data));
        }
        throw new Error('Failed to initiate image generation');
    }
}

/**
 * Generate a video using Freepik Kling Video API (Multi-Prompt)
 * @param {Array} scenes - Array of { prompt, image_url, duration }
 * @returns {Promise<string>} task_id
 */
async function generateVideo(scenes) {
    try {
        const multiPrompt = scenes.map(s => ({
            prompt: s.visual_prompt || s.prompt || s.text,
            image: s.image_url,
            duration: (Math.max(3, parseInt(s.duration) || 5)).toString()
        }));

        const response = await client.post('/ai/video/kling-v3-pro', {
            model: 'kling-v3-pro',
            multi_shot: true,
            shot_type: 'customize',
            multi_prompt: multiPrompt,
            mode: 'standard',
            aspect_ratio: '9:16'
        });
        return response.data.data.task_id;
    } catch (error) {
        console.error('Freepik Video Gen Error:', error.response?.data || error.message);
        throw new Error('Failed to initiate video generation');
    }
}

/**
 * Check the status of an AI task
 * @param {string} taskId 
 * @param {string} type - 'image' or 'video'
 * @returns {Promise<Object>} status and result_url
 */
async function pollTaskStatus(taskId, type = 'image') {
    try {
        const endpoint = type === 'video' ? `/ai/video/kling-v3/${taskId}` : `/ai/tasks/${taskId}`;
        const response = await client.get(endpoint);
        const data = response.data.data || response.data;
        
        console.log(`[Freepik Polling] Type: ${type}, ID: ${taskId}, Status: ${data.status}`);

        if (data.status === 'COMPLETED' || data.status === 'succeed') {
            const resultUrl = type === 'video' 
                ? (data.generated?.[0]?.url || data.result_url)
                : (data.result_url || data.data?.[0]?.url);
                
            return {
                status: 'succeed',
                resultUrl: resultUrl
            };
        } else if (data.status === 'FAILED' || data.status === 'failed') {
            return { status: 'failed' };
        } else {
            return { status: 'processing' };
        }
    } catch (error) {
        if (error.response) {
            console.error('Freepik Polling Error:', error.response.data);
        }
        throw new Error('Failed to poll task status');
    }
}

module.exports = { generateImage, generateVideo, pollTaskStatus };
