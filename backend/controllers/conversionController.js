const db = require('../config/db');

const createConversion = async (req, res) => {
    try {
        const { affiliate_link_id, conversion_value, commission_earned } = req.body;

        if (!affiliate_link_id || conversion_value === undefined || commission_earned === undefined) {
            return res.status(400).json({
                success: false,
                message: 'affiliate_link_id, conversion_value, and commission_earned are required'
            });
        }

        const [result] = await db.query(
            `INSERT INTO conversions (affiliate_link_id, conversion_value, commission_earned)
             VALUES (?, ?, ?)`,
            [affiliate_link_id, conversion_value, commission_earned]
        );

        res.status(201).json({
            success: true,
            conversion_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllConversions = async (req, res) => {
    try {
        const [conversions] = await db.query(
            `SELECT c.*,
                    al.unique_code,
                    al.influencer_id,
                    al.campaign_id
             FROM conversions c
             LEFT JOIN affiliate_links al ON c.affiliate_link_id = al.id
             ORDER BY c.id DESC`
        );

        res.json({
            success: true,
            data: conversions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getConversionById = async (req, res) => {
    try {
        const { id } = req.params;

        const [conversions] = await db.query(
            `SELECT c.*,
                    al.unique_code,
                    al.influencer_id,
                    al.campaign_id
             FROM conversions c
             LEFT JOIN affiliate_links al ON c.affiliate_link_id = al.id
             WHERE c.id = ?`,
            [id]
        );

        if (conversions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Conversion not found'
            });
        }

        res.json({
            success: true,
            data: conversions[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteConversion = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM conversions WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Conversion not found'
            });
        }

        res.json({
            success: true,
            message: 'Conversion deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCommissionSummary = async (req, res) => {
    try {
        const { influencerId } = req.params;

        const [rows] = await db.query(
            `SELECT
                COUNT(c.id) AS totalConversions,
                COALESCE(SUM(c.conversion_value), 0) AS totalSales,
                COALESCE(SUM(c.commission_earned), 0) AS totalCommission
             FROM conversions c
             INNER JOIN affiliate_links al ON c.affiliate_link_id = al.id
             WHERE al.influencer_id = ?`,
            [influencerId]
        );

        const summary = rows[0] || {
            totalConversions: 0,
            totalSales: 0,
            totalCommission: 0
        };

        res.json({
            success: true,
            totalConversions: Number(summary.totalConversions),
            totalSales: Number(summary.totalSales),
            totalCommission: Number(summary.totalCommission)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createConversion,
    getAllConversions,
    getConversionById,
    deleteConversion,
    getCommissionSummary
};