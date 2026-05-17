const { dbGet, dbRun } = require('./db');

/**
 * Helper to get or create a user and check their credit type
 */
async function checkSpecificCredits(userId, creditType) {
    let user = await dbGet(`SELECT * FROM users WHERE id = ?`, [userId]);
    
    if (!user) {
        // Auto-create user for testing if doesn't exist (starter tier)
        await dbRun(`
            INSERT INTO users (id, credits, video_credits, image_credits, enhancement_credits, bg_removal_credits, subscription_tier) 
            VALUES (?, 0, 3, 15, 5, 10, 'starter')
        `, [userId]);
        user = await dbGet(`SELECT * FROM users WHERE id = ?`, [userId]);
    }

    return user[creditType] > 0 || user[creditType] === -1;
}

/**
 * Middleware to check if a user has enough video credits
 */
async function checkVideoCredits(req, res, next) {
    const userId = req.headers['x-user-id'] || 'anonymous';
    try {
        const hasCredits = await checkSpecificCredits(userId, 'video_credits');
        if (!hasCredits) {
            return res.status(403).json({ error: 'Insufficient video credits', code: 'CREDITS_EXHAUSTED' });
        }
        next();
    } catch (error) {
        console.error('Credit Check Error:', error);
        res.status(500).json({ error: 'Failed to verify credits' });
    }
}

/**
 * Middleware to check if a user has enough image credits
 */
async function checkImageCredits(req, res, next) {
    const userId = req.headers['x-user-id'] || 'anonymous';
    try {
        const hasCredits = await checkSpecificCredits(userId, 'image_credits');
        if (!hasCredits) {
            return res.status(403).json({ error: 'Insufficient image credits', code: 'CREDITS_EXHAUSTED' });
        }
        next();
    } catch (error) {
        console.error('Credit Check Error:', error);
        res.status(500).json({ error: 'Failed to verify credits' });
    }
}

/**
 * Deduct 1 specific credit from user
 */
async function deductSpecificCredit(userId, creditType) {
    try {
        // Only deduct if not unlimited (-1)
        await dbRun(`
            UPDATE users 
            SET ${creditType} = ${creditType} - 1 
            WHERE id = ? AND ${creditType} > 0
        `, [userId]);
    } catch (error) {
        console.error(`Credit Deduction Error (${creditType}):`, error);
        throw error;
    }
}

async function deductVideoCredit(userId) {
    return deductSpecificCredit(userId, 'video_credits');
}

async function deductImageCredit(userId) {
    return deductSpecificCredit(userId, 'image_credits');
}

/**
 * Refund 1 specific credit to user (on failure)
 */
async function refundSpecificCredit(userId, creditType) {
    try {
        await dbRun(`
            UPDATE users 
            SET ${creditType} = ${creditType} + 1 
            WHERE id = ? AND ${creditType} >= 0
        `, [userId]);
    } catch (error) {
        console.error(`Credit Refund Error (${creditType}):`, error);
        throw error;
    }
}

async function refundVideoCredit(userId) {
    return refundSpecificCredit(userId, 'video_credits');
}

async function refundImageCredit(userId) {
    return refundSpecificCredit(userId, 'image_credits');
}

// Keep the old ones for backward compatibility just in case, mapping to video_credits
async function checkCredits(req, res, next) {
    return checkVideoCredits(req, res, next);
}

async function deductCredit(userId) {
    return deductVideoCredit(userId);
}

async function refundCredit(userId) {
    return refundVideoCredit(userId);
}

/**
 * Log API usage and cost
 */
async function logUsage(userId, type, credits, cost = 0) {
    try {
        await dbRun(
            'INSERT INTO api_usage (user_id, type, credits_used, cost_estimate) VALUES (?, ?, ?, ?)',
            [userId, type, credits, cost]
        );
    } catch (error) {
        console.error('Usage Logging Error:', error);
    }
}

module.exports = { 
    checkCredits, deductCredit, refundCredit, logUsage,
    checkVideoCredits, deductVideoCredit, refundVideoCredit,
    checkImageCredits, deductImageCredit, refundImageCredit
};
