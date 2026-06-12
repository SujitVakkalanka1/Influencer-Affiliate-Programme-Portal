const crypto = require('crypto');
const db = require('../config/db');

const ensureAffiliateClicksTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS affiliate_clicks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            affiliate_link_id INT,
            clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

const getAffiliateLinksWithClickCounts = async (whereClause = '', params = []) => {
    await ensureAffiliateClicksTable();

    const [rows] = await db.query(
        `SELECT al.*,
                COALESCE(clicks.click_count, 0) AS click_count
         FROM affiliate_links al
         LEFT JOIN (
             SELECT affiliate_link_id, COUNT(*) AS click_count
             FROM affiliate_clicks
             GROUP BY affiliate_link_id
         ) clicks ON clicks.affiliate_link_id = al.id
         ${whereClause}`,
        params
    );

    return rows;
};

const generateUniqueCode = async () => {
    for (let attempt = 0; attempt < 10; attempt += 1) {
        const uniqueCode = `AFF${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const [existing] = await db.query(
            'SELECT id FROM affiliate_links WHERE unique_code = ?',
            [uniqueCode]
        );

        if (existing.length === 0) {
            return uniqueCode;
        }
    }

    return `AFF${Date.now().toString(36).toUpperCase()}`;
};

const createAffiliateLink = async (req, res) => {
    try {
        const { influencer_id, campaign_id } = req.body;

        if (!influencer_id || !campaign_id) {
            return res.status(400).json({
                success: false,
                message: 'influencer_id and campaign_id are required'
            });
        }

        const uniqueCode = await generateUniqueCode();

        const [result] = await db.query(
            `INSERT INTO affiliate_links (influencer_id, campaign_id, unique_code)
             VALUES (?, ?, ?)`,
            [influencer_id, campaign_id, uniqueCode]
        );

        res.status(201).json({
            success: true,
            unique_code: uniqueCode,
            affiliate_link_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllAffiliateLinks = async (req, res) => {
    try {
        const affiliateLinks = await getAffiliateLinksWithClickCounts('ORDER BY al.id DESC');

        res.json({
            success: true,
            data: affiliateLinks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAffiliateLinkById = async (req, res) => {
    try {
        const { id } = req.params;
        const affiliateLinks = await getAffiliateLinksWithClickCounts('WHERE al.id = ?', [id]);

        if (affiliateLinks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Affiliate link not found'
            });
        }

        res.json({
            success: true,
            data: affiliateLinks[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteAffiliateLink = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM affiliate_links WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Affiliate link not found'
            });
        }

        res.json({
            success: true,
            message: 'Affiliate link deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const trackAffiliateClickByCode = async (req, res) => {
    try {
        const { unique_code } = req.params;

        const [links] = await db.query(
            'SELECT * FROM affiliate_links WHERE unique_code = ?',
            [unique_code]
        );

        if (links.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Affiliate link not found'
            });
        }

        await ensureAffiliateClicksTable();

        const affiliateLink = links[0];

        await db.query(
            'INSERT INTO affiliate_clicks (affiliate_link_id) VALUES (?)',
            [affiliateLink.id]
        );

        const updatedLinks = await getAffiliateLinksWithClickCounts('WHERE al.id = ?', [affiliateLink.id]);

        res.json({
            success: true,
            message: 'Click tracked successfully',
            unique_code: unique_code,
            affiliate_link: updatedLinks[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createAffiliateLink,
    getAllAffiliateLinks,
    getAffiliateLinkById,
    deleteAffiliateLink,
    trackAffiliateClickByCode
};