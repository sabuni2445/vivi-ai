const { dbGet, dbRun } = require('./db');

/**
 * Middleware to check if a user has enough credits
 */
async function checkCredits(req, res, next) {
    const userId = req.headers['x-user-id'] || 'anonymous';
    
    try {
        const user = await dbGet('SELECT credits FROM users WHERE id = ?', [userId]);
        
        if (!user) {
            // Auto-create user for testing if doesn't exist
            await dbRun('INSERT INTO users (id, credits) VALUES (?, ?)', [userId, 5]);
            return next();
        }

        if (user.credits < 1) {
            return res.status(403).json({ 
                error: 'Insufficient credits', 
                code: 'CREDITS_EXHAUSTED' 
            });
        }

        next();
    } catch (error) {
        console.error('Credit Check Error:', error);
        res.status(500).json({ error: 'Failed to verify credits' });
    }
}

/**
 * Deduct 1 credit from user
 */
async function deductCredit(userId) {
    try {
        await dbRun('UPDATE users SET credits = credits - 1 WHERE id = ? AND credits > 0', [userId]);
    } catch (error) {
        console.error('Credit Deduction Error:', error);
        throw error;
    }
}

/**
 * Refund 1 credit to user (on failure)
 */
async function refundCredit(userId) {
    try {
        await dbRun('UPDATE users SET credits = credits + 1 WHERE id = ?', [userId]);
    } catch (error) {
        console.error('Credit Refund Error:', error);
        throw error;
    }
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

module.exports = { checkCredits, deductCredit, refundCredit, logUsage };
