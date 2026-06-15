const crypto = require('crypto');
const db = require('../config/db');

const buildTrackingUrl = (req, code) => `${req.protocol}://${req.get('host')}/ref/${code}`;

const generateUniqueCode = async () => {
    for (let attempt = 0; attempt < 10; attempt += 1) {
        const uniqueCode = `AFF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const [existing] = await db.query(
            'SELECT id FROM affiliate_links WHERE unique_code = ? LIMIT 1',
            [uniqueCode]
        );

        if (existing.length === 0) return uniqueCode;
    }

    return `AFF-${Date.now().toString(36).toUpperCase()}`;
};

const getLinksQuery = async (whereClause = '', params = [], req = null) => {
    const [rows] = await db.query(
        `SELECT al.id,
                al.influencer_id,
                al.campaign_id,
                al.unique_code,
                al.created_at,
                c.title AS campaign_title,
                c.description AS campaign_description,
                c.destination_url,
                c.commission_rate,
                c.status AS campaign_status,
                COALESCE(clicks.click_count, 0) AS click_count,
                COALESCE(conversions.conversion_count, 0) AS conversion_count,
                COALESCE(conversions.sales_total, 0) AS sales_total,
                COALESCE(conversions.commission_total, 0) AS commission_total
         FROM affiliate_links al
         INNER JOIN campaigns c ON c.id = al.campaign_id
         LEFT JOIN (
             SELECT affiliate_link_id, COUNT(*) AS click_count
             FROM affiliate_clicks
             GROUP BY affiliate_link_id
         ) clicks ON clicks.affiliate_link_id = al.id
         LEFT JOIN (
             SELECT affiliate_link_id,
                    COUNT(*) AS conversion_count,
                    SUM(conversion_value) AS sales_total,
                    SUM(commission_earned) AS commission_total
             FROM conversions
             GROUP BY affiliate_link_id
         ) conversions ON conversions.affiliate_link_id = al.id
         ${whereClause}
         ORDER BY al.created_at DESC`,
        params
    );

    return rows.map((row) => ({
        ...row,
        commission_rate: Number(row.commission_rate || 0),
        click_count: Number(row.click_count || 0),
        conversion_count: Number(row.conversion_count || 0),
        sales_total: Number(row.sales_total || 0),
        commission_total: Number(row.commission_total || 0),
        tracking_url: req ? buildTrackingUrl(req, row.unique_code) : `/ref/${row.unique_code}`
    }));
};

const createAffiliateLink = async (req, res) => {
    try {
        const campaignId = Number(req.body.campaign_id);
        const influencerId = req.user.role === 'admin' && req.body.influencer_id
            ? Number(req.body.influencer_id)
            : req.user.id;

        if (!campaignId) {
            return res.status(400).json({ success: false, message: 'campaign_id is required' });
        }

        const [campaigns] = await db.query(
            'SELECT id, status FROM campaigns WHERE id = ? LIMIT 1',
            [campaignId]
        );

        if (campaigns.length === 0) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        const [existing] = await db.query(
            'SELECT id FROM affiliate_links WHERE influencer_id = ? AND campaign_id = ? LIMIT 1',
            [influencerId, campaignId]
        );

        if (existing.length > 0) {
            const links = await getLinksQuery('WHERE al.id = ?', [existing[0].id], req);
            return res.json({
                success: true,
                message: 'Affiliate link already exists for this campaign',
                data: links[0]
            });
        }

        const uniqueCode = await generateUniqueCode();
        const [result] = await db.query(
            `INSERT INTO affiliate_links (influencer_id, campaign_id, unique_code)
             VALUES (?, ?, ?)`,
            [influencerId, campaignId, uniqueCode]
        );

        const links = await getLinksQuery('WHERE al.id = ?', [result.insertId], req);

        return res.status(201).json({
            success: true,
            message: 'Affiliate link created successfully',
            data: links[0]
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getAllAffiliateLinks = async (req, res) => {
    try {
        const where = req.user.role === 'admin' ? '' : 'WHERE al.influencer_id = ?';
        const params = req.user.role === 'admin' ? [] : [req.user.id];
        const affiliateLinks = await getLinksQuery(where, params, req);

        return res.json({ success: true, data: affiliateLinks });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getAffiliateLinkById = async (req, res) => {
    try {
        const params = [req.params.id];
        let where = 'WHERE al.id = ?';

        if (req.user.role !== 'admin') {
            where += ' AND al.influencer_id = ?';
            params.push(req.user.id);
        }

        const affiliateLinks = await getLinksQuery(where, params, req);

        if (affiliateLinks.length === 0) {
            return res.status(404).json({ success: false, message: 'Affiliate link not found' });
        }

        return res.json({ success: true, data: affiliateLinks[0] });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteAffiliateLink = async (req, res) => {
    try {
        const params = [req.params.id];
        let sql = 'DELETE FROM affiliate_links WHERE id = ?';

        if (req.user.role !== 'admin') {
            sql += ' AND influencer_id = ?';
            params.push(req.user.id);
        }

        const [result] = await db.query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Affiliate link not found' });
        }

        return res.json({ success: true, message: 'Affiliate link deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const trackAffiliateClickByCode = async (req, res) => {
    try {
        const { unique_code: uniqueCode } = req.params;

        const [links] = await db.query(
            `SELECT al.id, al.unique_code, c.destination_url
             FROM affiliate_links al
             INNER JOIN campaigns c ON c.id = al.campaign_id
             WHERE al.unique_code = ? LIMIT 1`,
            [uniqueCode]
        );

        if (links.length === 0) {
            return res.status(404).json({ success: false, message: 'Affiliate link not found' });
        }

        const affiliateLink = links[0];

        await db.query(
            'INSERT INTO affiliate_clicks (affiliate_link_id, ip_address, user_agent) VALUES (?, ?, ?)',
            [affiliateLink.id, req.ip, String(req.headers['user-agent'] || '').slice(0, 255)]
        );

        if (req.query.json === 'true') {
            const updatedLinks = await getLinksQuery('WHERE al.id = ?', [affiliateLink.id], req);
            return res.json({
                success: true,
                message: 'Click tracked successfully',
                data: updatedLinks[0]
            });
        }

        return res.redirect(affiliateLink.destination_url);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createAffiliateLink,
    getAllAffiliateLinks,
    getAffiliateLinkById,
    deleteAffiliateLink,
    trackAffiliateClickByCode
};
