const db = require('../config/db');

const createConversion = async (req, res) => {
    try {
        const affiliateLinkId = Number(req.body.affiliate_link_id);
        const conversionValue = Number(req.body.conversion_value || 0);

        if (!affiliateLinkId || Number.isNaN(conversionValue) || conversionValue <= 0) {
            return res.status(400).json({
                success: false,
                message: 'affiliate_link_id and a positive conversion_value are required'
            });
        }

        const [links] = await db.query(
            `SELECT al.id, al.influencer_id, c.commission_rate
             FROM affiliate_links al
             INNER JOIN campaigns c ON c.id = al.campaign_id
             WHERE al.id = ? LIMIT 1`,
            [affiliateLinkId]
        );

        if (links.length === 0) {
            return res.status(404).json({ success: false, message: 'Affiliate link not found' });
        }

        if (req.user.role !== 'admin' && links[0].influencer_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access forbidden' });
        }

        const commissionEarned = Number(((conversionValue * Number(links[0].commission_rate || 0)) / 100).toFixed(2));

        const [result] = await db.query(
            `INSERT INTO conversions (affiliate_link_id, conversion_value, commission_earned)
             VALUES (?, ?, ?)`,
            [affiliateLinkId, conversionValue, commissionEarned]
        );

        return res.status(201).json({
            success: true,
            message: 'Conversion recorded successfully',
            data: {
                id: result.insertId,
                affiliate_link_id: affiliateLinkId,
                conversion_value: conversionValue,
                commission_earned: commissionEarned
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getAllConversions = async (req, res) => {
    try {
        const params = [];
        let where = '';

        if (req.user.role !== 'admin') {
            where = 'WHERE al.influencer_id = ?';
            params.push(req.user.id);
        }

        const [conversions] = await db.query(
            `SELECT cv.*,
                    al.unique_code,
                    al.influencer_id,
                    al.campaign_id,
                    c.title AS campaign_title
             FROM conversions cv
             INNER JOIN affiliate_links al ON cv.affiliate_link_id = al.id
             INNER JOIN campaigns c ON c.id = al.campaign_id
             ${where}
             ORDER BY cv.created_at DESC`,
            params
        );

        return res.json({ success: true, data: conversions });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getConversionById = async (req, res) => {
    try {
        const params = [req.params.id];
        let where = 'WHERE cv.id = ?';

        if (req.user.role !== 'admin') {
            where += ' AND al.influencer_id = ?';
            params.push(req.user.id);
        }

        const [conversions] = await db.query(
            `SELECT cv.*,
                    al.unique_code,
                    al.influencer_id,
                    al.campaign_id,
                    c.title AS campaign_title
             FROM conversions cv
             INNER JOIN affiliate_links al ON cv.affiliate_link_id = al.id
             INNER JOIN campaigns c ON c.id = al.campaign_id
             ${where}
             LIMIT 1`,
            params
        );

        if (conversions.length === 0) {
            return res.status(404).json({ success: false, message: 'Conversion not found' });
        }

        return res.json({ success: true, data: conversions[0] });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteConversion = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only admin can delete conversions' });
        }

        const [result] = await db.query('DELETE FROM conversions WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Conversion not found' });
        }

        return res.json({ success: true, message: 'Conversion deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getCommissionSummary = async (req, res) => {
    try {
        const influencerId = req.user.role === 'admin' && req.params.influencerId
            ? req.params.influencerId
            : req.user.id;

        const [rows] = await db.query(
            `SELECT
                COUNT(cv.id) AS totalConversions,
                COALESCE(SUM(cv.conversion_value), 0) AS totalSales,
                COALESCE(SUM(cv.commission_earned), 0) AS totalCommission
             FROM conversions cv
             INNER JOIN affiliate_links al ON cv.affiliate_link_id = al.id
             WHERE al.influencer_id = ?`,
            [influencerId]
        );

        const summary = rows[0] || {};

        return res.json({
            success: true,
            data: {
                totalConversions: Number(summary.totalConversions || 0),
                totalSales: Number(summary.totalSales || 0),
                totalCommission: Number(summary.totalCommission || 0)
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createConversion,
    getAllConversions,
    getConversionById,
    deleteConversion,
    getCommissionSummary
};
