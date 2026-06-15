const db = require('../config/db');

const buildTrackingUrl = (req, code) => `${req.protocol}://${req.get('host')}/ref/${code}`;

const getInfluencerDashboard = async (req, res) => {
    try {
        const influencerId = req.user.id;

        const [[stats]] = await db.query(
            `SELECT
                (SELECT COUNT(*) FROM affiliate_links WHERE influencer_id = ?) AS links,
                (SELECT COUNT(ac.id)
                 FROM affiliate_clicks ac
                 INNER JOIN affiliate_links al ON al.id = ac.affiliate_link_id
                 WHERE al.influencer_id = ?) AS clicks,
                (SELECT COUNT(cv.id)
                 FROM conversions cv
                 INNER JOIN affiliate_links al ON al.id = cv.affiliate_link_id
                 WHERE al.influencer_id = ?) AS conversions,
                (SELECT COALESCE(SUM(cv.conversion_value), 0)
                 FROM conversions cv
                 INNER JOIN affiliate_links al ON al.id = cv.affiliate_link_id
                 WHERE al.influencer_id = ?) AS revenue,
                (SELECT COALESCE(SUM(cv.commission_earned), 0)
                 FROM conversions cv
                 INNER JOIN affiliate_links al ON al.id = cv.affiliate_link_id
                 WHERE al.influencer_id = ?) AS commission`,
            [influencerId, influencerId, influencerId, influencerId, influencerId]
        );

        const [links] = await db.query(
            `SELECT al.id,
                    al.unique_code,
                    al.created_at,
                    c.id AS campaign_id,
                    c.title AS campaign_title,
                    c.description AS campaign_description,
                    c.commission_rate,
                    c.destination_url,
                    c.status AS campaign_status,
                    COALESCE(clicks.click_count, 0) AS click_count,
                    COALESCE(conversions.conversion_count, 0) AS conversion_count,
                    COALESCE(conversions.revenue, 0) AS revenue,
                    COALESCE(conversions.commission, 0) AS commission
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
                        SUM(conversion_value) AS revenue,
                        SUM(commission_earned) AS commission
                 FROM conversions
                 GROUP BY affiliate_link_id
             ) conversions ON conversions.affiliate_link_id = al.id
             WHERE al.influencer_id = ?
             ORDER BY al.created_at DESC`,
            [influencerId]
        );

        const [campaigns] = await db.query(
            `SELECT c.*,
                    CASE WHEN al.id IS NULL THEN 0 ELSE 1 END AS has_link
             FROM campaigns c
             LEFT JOIN affiliate_links al
                    ON al.campaign_id = c.id AND al.influencer_id = ?
             WHERE c.status = 'active'
             ORDER BY c.created_at DESC`,
            [influencerId]
        );

        const [chart] = await db.query(
            `SELECT DATE(ac.clicked_at) AS date, COUNT(ac.id) AS clicks
             FROM affiliate_clicks ac
             INNER JOIN affiliate_links al ON al.id = ac.affiliate_link_id
             WHERE al.influencer_id = ? AND ac.clicked_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
             GROUP BY DATE(ac.clicked_at)
             ORDER BY DATE(ac.clicked_at) ASC`,
            [influencerId]
        );

        const [payouts] = await db.query(
            `SELECT id, amount, status, note, requested_at, updated_at
             FROM payout_requests
             WHERE influencer_id = ?
             ORDER BY requested_at DESC
             LIMIT 8`,
            [influencerId]
        );

        return res.json({
            success: true,
            data: {
                user: req.user,
                stats: {
                    links: Number(stats.links || 0),
                    clicks: Number(stats.clicks || 0),
                    conversions: Number(stats.conversions || 0),
                    revenue: Number(stats.revenue || 0),
                    commission: Number(stats.commission || 0)
                },
                links: links.map((link) => ({
                    ...link,
                    commission_rate: Number(link.commission_rate || 0),
                    click_count: Number(link.click_count || 0),
                    conversion_count: Number(link.conversion_count || 0),
                    revenue: Number(link.revenue || 0),
                    commission: Number(link.commission || 0),
                    tracking_url: buildTrackingUrl(req, link.unique_code)
                })),
                campaigns: campaigns.map((campaign) => ({
                    ...campaign,
                    commission_rate: Number(campaign.commission_rate || 0),
                    budget: Number(campaign.budget || 0),
                    has_link: Boolean(campaign.has_link)
                })),
                chart: chart.map((row) => ({
                    date: row.date,
                    clicks: Number(row.clicks || 0)
                })),
                payouts: payouts.map((payout) => ({
                    ...payout,
                    amount: Number(payout.amount || 0)
                }))
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getAdminDashboard = async (req, res) => {
    try {
        const [[stats]] = await db.query(
            `SELECT
                (SELECT COUNT(*) FROM users) AS users,
                (SELECT COUNT(*) FROM campaigns) AS campaigns,
                (SELECT COUNT(*) FROM affiliate_clicks) AS clicks,
                (SELECT COUNT(*) FROM conversions) AS conversions,
                (SELECT COALESCE(SUM(commission_earned), 0) FROM conversions) AS commission,
                (SELECT COUNT(*) FROM payout_requests WHERE status = 'pending') AS pending_payouts`
        );

        const [users] = await db.query(
            `SELECT u.id,
                    u.name,
                    u.email,
                    u.role,
                    u.created_at,
                    COALESCE(links.link_count, 0) AS links,
                    COALESCE(clicks.click_count, 0) AS clicks,
                    COALESCE(conversions.conversion_count, 0) AS conversions,
                    COALESCE(conversions.commission, 0) AS commission
             FROM users u
             LEFT JOIN (
                 SELECT influencer_id, COUNT(*) AS link_count
                 FROM affiliate_links
                 GROUP BY influencer_id
             ) links ON links.influencer_id = u.id
             LEFT JOIN (
                 SELECT al.influencer_id, COUNT(ac.id) AS click_count
                 FROM affiliate_links al
                 INNER JOIN affiliate_clicks ac ON ac.affiliate_link_id = al.id
                 GROUP BY al.influencer_id
             ) clicks ON clicks.influencer_id = u.id
             LEFT JOIN (
                 SELECT al.influencer_id,
                        COUNT(cv.id) AS conversion_count,
                        SUM(cv.commission_earned) AS commission
                 FROM affiliate_links al
                 INNER JOIN conversions cv ON cv.affiliate_link_id = al.id
                 GROUP BY al.influencer_id
             ) conversions ON conversions.influencer_id = u.id
             ORDER BY u.created_at DESC
             LIMIT 50`
        );

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
             ORDER BY c.created_at DESC
             LIMIT 20`
        );

        const [payouts] = await db.query(
            `SELECT pr.*, u.name AS influencer_name, u.email AS influencer_email
             FROM payout_requests pr
             INNER JOIN users u ON u.id = pr.influencer_id
             ORDER BY pr.requested_at DESC
             LIMIT 20`
        );

        return res.json({
            success: true,
            data: {
                stats: {
                    users: Number(stats.users || 0),
                    campaigns: Number(stats.campaigns || 0),
                    clicks: Number(stats.clicks || 0),
                    conversions: Number(stats.conversions || 0),
                    commission: Number(stats.commission || 0),
                    pending_payouts: Number(stats.pending_payouts || 0)
                },
                users: users.map((user) => ({
                    ...user,
                    links: Number(user.links || 0),
                    clicks: Number(user.clicks || 0),
                    conversions: Number(user.conversions || 0),
                    commission: Number(user.commission || 0)
                })),
                campaigns: campaigns.map((campaign) => ({
                    ...campaign,
                    commission_rate: Number(campaign.commission_rate || 0),
                    budget: Number(campaign.budget || 0),
                    affiliate_link_count: Number(campaign.affiliate_link_count || 0),
                    click_count: Number(campaign.click_count || 0),
                    conversion_count: Number(campaign.conversion_count || 0),
                    commission_total: Number(campaign.commission_total || 0)
                })),
                payouts: payouts.map((payout) => ({
                    ...payout,
                    amount: Number(payout.amount || 0)
                }))
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getInfluencerDashboard,
    getAdminDashboard
};
