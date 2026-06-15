const db = require('../config/db');

const normalizeCampaign = (campaign) => ({
    ...campaign,
    commission_rate: Number(campaign.commission_rate || 0),
    budget: Number(campaign.budget || 0)
});

const createCampaign = async (req, res) => {
    try {
        const title = String(req.body.title || '').trim();
        const description = String(req.body.description || '').trim();
        const commissionRate = Number(req.body.commission_rate || 0);
        const budget = Number(req.body.budget || 0);
        const destinationUrl = String(req.body.destination_url || '').trim() || 'https://example.com';
        const status = String(req.body.status || 'active').toLowerCase();
        const brandId = req.body.brand_id || (req.user?.role === 'brand' ? req.user.id : null);

        if (!title || Number.isNaN(commissionRate) || commissionRate < 0) {
            return res.status(400).json({
                success: false,
                message: 'Campaign title and a valid commission rate are required'
            });
        }

        const [result] = await db.query(
            `INSERT INTO campaigns
             (brand_id, title, description, commission_rate, budget, destination_url, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [brandId, title, description, commissionRate, budget, destinationUrl, status]
        );

        const [campaigns] = await db.query('SELECT * FROM campaigns WHERE id = ?', [result.insertId]);

        return res.status(201).json({
            success: true,
            message: 'Campaign created successfully',
            data: normalizeCampaign(campaigns[0])
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllCampaigns = async (req, res) => {
    try {
        const [campaigns] = await db.query(
            `SELECT c.*,
                    COALESCE(links.affiliate_link_count, 0) AS affiliate_link_count,
                    COALESCE(clicks.click_count, 0) AS click_count,
                    COALESCE(conversions.conversion_count, 0) AS conversion_count,
                    COALESCE(conversions.commission_total, 0) AS commission_total
             FROM campaigns c
             LEFT JOIN (
                 SELECT campaign_id, COUNT(*) AS affiliate_link_count
                 FROM affiliate_links
                 GROUP BY campaign_id
             ) links ON links.campaign_id = c.id
             LEFT JOIN (
                 SELECT al.campaign_id, COUNT(ac.id) AS click_count
                 FROM affiliate_links al
                 INNER JOIN affiliate_clicks ac ON ac.affiliate_link_id = al.id
                 GROUP BY al.campaign_id
             ) clicks ON clicks.campaign_id = c.id
             LEFT JOIN (
                 SELECT al.campaign_id,
                        COUNT(cv.id) AS conversion_count,
                        SUM(cv.commission_earned) AS commission_total
                 FROM affiliate_links al
                 INNER JOIN conversions cv ON cv.affiliate_link_id = al.id
                 GROUP BY al.campaign_id
             ) conversions ON conversions.campaign_id = c.id
             ORDER BY c.created_at DESC`
        );

        return res.json({
            success: true,
            data: campaigns.map(normalizeCampaign)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCampaignById = async (req, res) => {
    try {
        const [campaigns] = await db.query('SELECT * FROM campaigns WHERE id = ? LIMIT 1', [req.params.id]);

        if (campaigns.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }

        return res.json({
            success: true,
            data: normalizeCampaign(campaigns[0])
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateCampaign = async (req, res) => {
    try {
        const title = String(req.body.title || '').trim();
        const description = String(req.body.description || '').trim();
        const commissionRate = Number(req.body.commission_rate || 0);
        const budget = Number(req.body.budget || 0);
        const destinationUrl = String(req.body.destination_url || '').trim() || 'https://example.com';
        const status = String(req.body.status || 'active').toLowerCase();

        const [result] = await db.query(
            `UPDATE campaigns
             SET title = ?, description = ?, commission_rate = ?, budget = ?, destination_url = ?, status = ?
             WHERE id = ?`,
            [title, description, commissionRate, budget, destinationUrl, status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        const [campaigns] = await db.query('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);

        return res.json({
            success: true,
            message: 'Campaign updated successfully',
            data: normalizeCampaign(campaigns[0])
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteCampaign = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM campaigns WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }

        return res.json({
            success: true,
            message: 'Campaign deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign
};
