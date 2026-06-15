const db = require('../config/db');

const createPayoutRequest = async (req, res) => {
    try {
        const amount = Number(req.body.amount || 0);
        const note = String(req.body.note || '').trim();

        if (Number.isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: 'A positive payout amount is required' });
        }

        const [result] = await db.query(
            'INSERT INTO payout_requests (influencer_id, amount, note) VALUES (?, ?, ?)',
            [req.user.id, amount, note || null]
        );

        const [rows] = await db.query('SELECT * FROM payout_requests WHERE id = ?', [result.insertId]);

        return res.status(201).json({
            success: true,
            message: 'Payout request submitted successfully',
            data: rows[0]
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getPayoutRequests = async (req, res) => {
    try {
        const params = [];
        let where = '';

        if (req.user.role !== 'admin') {
            where = 'WHERE pr.influencer_id = ?';
            params.push(req.user.id);
        }

        const [rows] = await db.query(
            `SELECT pr.*, u.name AS influencer_name, u.email AS influencer_email
             FROM payout_requests pr
             INNER JOIN users u ON u.id = pr.influencer_id
             ${where}
             ORDER BY pr.requested_at DESC`,
            params
        );

        return res.json({ success: true, data: rows });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updatePayoutStatus = async (req, res) => {
    try {
        const status = String(req.body.status || '').toLowerCase();

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be approved, rejected, or pending' });
        }

        const [result] = await db.query(
            'UPDATE payout_requests SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Payout request not found' });
        }

        const [rows] = await db.query(
            `SELECT pr.*, u.name AS influencer_name, u.email AS influencer_email
             FROM payout_requests pr
             INNER JOIN users u ON u.id = pr.influencer_id
             WHERE pr.id = ?`,
            [req.params.id]
        );

        return res.json({
            success: true,
            message: `Payout ${status} successfully`,
            data: rows[0]
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createPayoutRequest,
    getPayoutRequests,
    updatePayoutStatus
};
