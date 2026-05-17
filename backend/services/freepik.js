const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
 * Improve a prompt using Freepik's prompt improvement API
 * @param {string} prompt 
 * @returns {Promise<string>} improved prompt
 */
async function improvePrompt(prompt) {
    try {
        const response = await client.post('/ai/prompt-improvement', { prompt });
        return response.data?.data?.improved_prompt || prompt;
    } catch (error) {
        console.error('[Freepik] Prompt Improve Error:', error.message);
        return prompt; // Fallback to original
    }
}

/**
 * Generate a high-end photorealistic image using Freepik Mystic
 * @param {string} prompt 
 * @param {string} aspect_ratio 
 * @param {boolean} isPro - Whether to use Mystic (true) or Standard (false)
 * @returns {Promise<Object>} task_id or direct results
 */
async function generateMysticImage(prompt, aspect_ratio = 'social_story_9_16', isPro = true) {
    if (!isPro) {
        console.log(`[Freepik] Using Standard Image Model for Economy Mode.`);
        return generateImage(prompt);
    }

    try {
        const ratioMap = {
            '9:16': 'social_story_9_16',
            '16:9': 'widescreen_16_9',
            '1:1': 'square_1_1',
            '4:5': 'social_post_4_5',
            '3:4': 'traditional_3_4'
        };

        const finalRatio = ratioMap[aspect_ratio] || aspect_ratio;

        console.log(`[Freepik Mystic] Generating (${finalRatio}): "${prompt.substring(0, 50)}..."`);
        const response = await client.post('/ai/mystic', {
            prompt: prompt,
            aspect_ratio: finalRatio,
            guidance_scale: 3.5 
        });
        
        return response.data?.data?.task_id || response.data?.data?.[0]?.url;
    } catch (error) {
        console.error('[Freepik Mystic] Error:', error.response?.data || error.message);
        throw new Error('Mystic generation failed');
    }
}

/**
 * Generate an image using Freepik AI Image API (Standard)
 * @param {string} prompt 
 * @returns {Promise<Object>} task_id or directUrl
 */
async function generateImage(prompt) {
    try {
        console.log(`[Freepik] Requesting standard image for: "${prompt.substring(0, 50)}..."`);
        const response = await client.post('/ai/text-to-image', {
            prompt: prompt,
            num_images: 1,
            image_size: '9:16'
        });
        
        const imgObj = response.data?.data?.[0] || response.data;
        let directUrl = imgObj?.url || imgObj?.base64;
        
        if (imgObj?.base64 && !imgObj.base64.startsWith('data:')) {
            directUrl = `data:image/jpeg;base64,${imgObj.base64}`;
        }
        
        if (directUrl) return { directUrl };
        return response.data?.data?.task_id || response.data?.task_id;
    } catch (error) {
        console.error('Freepik Standard Image Error:', error.response?.data || error.message);
        throw new Error('Image generation failed');
    }
}

/**
 * Generate a video using Kling AI
 * @param {Array} scenes 
 * @param {string} mode - 'pro' (Kling V3 Omni Pro) or 'economy' (Kling V3 Omni)
 * @returns {Promise<string>} task_id
 */
async function generateVideo(scenes, mode = 'pro') {
    try {
        const images = scenes.map(s => s.image_url).filter(Boolean);
        
        const model = mode === 'pro' ? 'kling-v3-omni-pro' : 'kling-v3-omni';
        const endpoint = `/ai/video/${model}`;

        console.log(`[Freepik Video] Using Model: ${model} (${mode})`);
        
        let targetImageUrl = images[0];
        
        // Convert local URLs to base64 so Freepik can access them
        if (targetImageUrl && (targetImageUrl.includes('localhost') || targetImageUrl.startsWith('/public'))) {
            try {
                const filename = targetImageUrl.split('/').pop();
                // Assuming script runs from backend root
                const filePath = path.join(__dirname, '../public/campaigns', filename);
                if (fs.existsSync(filePath)) {
                    const base64 = fs.readFileSync(filePath, 'base64');
                    const ext = path.extname(filename).substring(1);
                    targetImageUrl = `data:image/${ext};base64,${base64}`;
                    console.log(`[Freepik Video] Converted local image to base64 (${base64.length} chars)`);
                }
            } catch (err) {
                console.error('[Freepik Video] Failed to convert local image:', err);
            }
        }

        const payload = {
            model: model,
            prompt: scenes.map(s => s.visual_prompt).join('. '), 
            image_url: targetImageUrl,
            aspect_ratio: '9:16',
            duration: '5' // Reduced to 5s for economy, can be 10 for pro
        };

        if (mode === 'pro') {
            payload.duration = '10';
        }

        const response = await client.post(endpoint, payload);
        return response.data?.data?.task_id || response.data?.task_id;
    } catch (error) {
        console.error('Freepik Video Gen Error:', error.response?.data || error.message);
        throw new Error('Video generation failed');
    }
}

/**
 * Check the status of an AI task
 */
async function pollTaskStatus(taskId, type = 'image') {
    try {
        // Determine the correct endpoint based on the model/type
        // Mystic and Omni models have their own dedicated status endpoints
        let endpoint = `/ai/tasks/${taskId}`;
        
        if (type === 'video') {
            endpoint = `/ai/video/kling-v3-omni/${taskId}`;
        } else if (taskId.includes('-') || type === 'mystic') { 
            // Mystic IDs often contain hyphens while standard ones are shorter hex
            // We'll try the mystic endpoint if it looks like one
            endpoint = `/ai/mystic/${taskId}`;
        }

        let response;
        try {
            response = await client.get(endpoint);
        } catch (err) {
            // Fallback to standard tasks endpoint if specific one fails with 404
            if (err.response?.status === 404 && endpoint !== `/ai/tasks/${taskId}`) {
                response = await client.get(`/ai/tasks/${taskId}`);
            } else {
                throw err;
            }
        }

        const data = response.data.data || response.data;
        
        console.log(`[Freepik Polling] ID: ${taskId}, Status: ${data.status}`);
        if (data.status?.toUpperCase() === 'COMPLETED') {
            console.log(`[Freepik Debug] Full Data:`, JSON.stringify(data, null, 2));
        }

        if (['COMPLETED', 'succeed', 'SUCCEEDED'].includes(data.status?.toUpperCase())) {
            // Comprehensive search for the result URL
            const resultUrl = 
                data.video_url || 
                data.image_url || 
                data.url || 
                data.result?.url || 
                data.result?.[0]?.url ||
                data.image?.url ||
                data.video?.url ||
                (Array.isArray(data.generated) && typeof data.generated[0] === 'string' ? data.generated[0] : null);
                
            console.log(`[Freepik Polling] Success! URL found: ${resultUrl?.substring(0, 50)}...`);
            return { status: 'succeed', resultUrl };
        } else if (['FAILED', 'failed', 'ERROR'].includes(data.status?.toUpperCase())) {
            return { status: 'failed' };
        } else {
            return { status: 'processing' };
        }
    } catch (error) {
        console.error('Freepik Polling Error:', error.message);
        throw new Error('Status poll failed');
    }
}

/**
 * Remove background from an image
 */
async function removeBackground(imageUrl) {
    try {
        console.log(`[Freepik] Removing background for image...`);
        let source = imageUrl;
        
        // Convert local path to base64
        if (source.includes('localhost') || source.startsWith('/public')) {
            const filename = source.split('/').pop();
            const filePath = path.join(__dirname, '../public/campaigns', filename);
            if (fs.existsSync(filePath)) {
                const base64 = fs.readFileSync(filePath, 'base64');
                const ext = path.extname(filename).toLowerCase();
                const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
                source = `data:${mimeType};base64,${base64}`;
            }
        }

        const response = await client.post('/ai/background-removal', {
            image: source
        });
        
        return response.data?.data?.url || response.data?.data?.base64;
    } catch (error) {
        console.error('[Freepik] Background Removal Error:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Image-to-Image enhancement
 */
async function imageToImage(imageUrl, prompt, strength = 0.5) {
    try {
        console.log(`[Freepik] Enhancing image with I2I: "${prompt.substring(0, 30)}..."`);
        let source = imageUrl;

        if (source.includes('localhost') || source.startsWith('/public')) {
            const filename = source.split('/').pop();
            const filePath = path.join(__dirname, '../public/campaigns', filename);
            if (fs.existsSync(filePath)) {
                const base64 = fs.readFileSync(filePath, 'base64');
                const ext = path.extname(filename).toLowerCase();
                const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
                source = `data:${mimeType};base64,${base64}`;
            }
        }

        const response = await client.post('/ai/image-to-image', {
            image: source,
            prompt: prompt,
            strength: strength,
            num_images: 1,
            image_size: '9:16'
        });

        return response.data?.data?.task_id || response.data?.data?.[0]?.url;
    } catch (error) {
        console.error('[Freepik] I2I Error:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = { 
    improvePrompt,
    generateMysticImage, 
    generateImage, 
    generateVideo, 
    pollTaskStatus,
    removeBackground,
    imageToImage
};

