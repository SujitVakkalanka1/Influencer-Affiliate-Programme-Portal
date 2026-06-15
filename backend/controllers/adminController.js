const db = require('../config/db');

const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, role FROM users ORDER BY id DESC'
        );

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllCampaigns = async (req, res) => {
    try {
        const [campaigns] = await db.query(
            'SELECT * FROM campaigns ORDER BY id DESC'
        );

        res.json({
            success: true,
            data: campaigns
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
        const [affiliateLinks] = await db.query(
            `SELECT al.*
             FROM affiliate_links al
             ORDER BY al.id DESC`
        );

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

module.exports = {
    getAllUsers,
    getAllCampaigns,
    getAllAffiliateLinks,
    getAllConversions
};