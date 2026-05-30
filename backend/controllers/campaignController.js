const db = require('../config/db');

// Create Campaign
const createCampaign = async (req, res) => {
    try {
        const {
            brand_id,
            title,
            description,
            commission_rate,
            budget
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO campaigns
            (brand_id, title, description, commission_rate, budget)
            VALUES (?, ?, ?, ?, ?)`,
            [brand_id, title, description, commission_rate, budget]
        );

        res.status(201).json({
            success: true,
            campaignId: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Campaigns
const getAllCampaigns = async (req, res) => {
    try {
        const [campaigns] = await db.query(
            'SELECT * FROM campaigns'
        );

        res.json(campaigns);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;

        const [campaign] = await db.query(
            'SELECT * FROM campaigns WHERE id = ?',
            [id]
        );

        if (campaign.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }

        res.json(campaign[0]);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            commission_rate,
            budget,
            status
        } = req.body;

        await db.query(
            `UPDATE campaigns
             SET title = ?,
                 description = ?,
                 commission_rate = ?,
                 budget = ?,
                 status = ?
             WHERE id = ?`,
            [
                title,
                description,
                commission_rate,
                budget,
                status,
                id
            ]
        );

        res.status(200).json({
            success: true,
            message: 'Campaign updated successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM campaigns WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Campaign deleted successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
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