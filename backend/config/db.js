const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const now = () => new Date();
const toNumber = (value) => Number(value || 0);
const clone = (value) => JSON.parse(JSON.stringify(value));

let initialized = false;

const baseOptions = { versionKey: false };

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
}, baseOptions);

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'brand', 'influencer'], default: 'influencer' },
  created_at: { type: Date, default: Date.now }
}, baseOptions);

const campaignSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  brand_id: { type: Number, default: null },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  commission_rate: { type: Number, default: 0 },
  budget: { type: Number, default: 0 },
  destination_url: { type: String, default: 'https://example.com' },
  status: { type: String, enum: ['active', 'paused', 'closed'], default: 'active' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, baseOptions);

const affiliateLinkSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  influencer_id: { type: Number, required: true, index: true },
  campaign_id: { type: Number, required: true, index: true },
  unique_code: { type: String, required: true, unique: true, index: true },
  created_at: { type: Date, default: Date.now }
}, baseOptions);

affiliateLinkSchema.index({ influencer_id: 1, campaign_id: 1 }, { unique: true });

const affiliateClickSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  affiliate_link_id: { type: Number, required: true, index: true },
  ip_address: { type: String, default: '' },
  user_agent: { type: String, default: '' },
  clicked_at: { type: Date, default: Date.now }
}, baseOptions);

const conversionSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  affiliate_link_id: { type: Number, required: true, index: true },
  conversion_value: { type: Number, default: 0 },
  commission_earned: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
}, baseOptions);

const payoutRequestSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  influencer_id: { type: Number, required: true, index: true },
  amount: { type: Number, required: true },
  note: { type: String, default: null },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  requested_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, baseOptions);

const Counter = mongoose.model('Counter', counterSchema, 'counters');
const User = mongoose.model('User', userSchema, 'users');
const Campaign = mongoose.model('Campaign', campaignSchema, 'campaigns');
const AffiliateLink = mongoose.model('AffiliateLink', affiliateLinkSchema, 'affiliate_links');
const AffiliateClick = mongoose.model('AffiliateClick', affiliateClickSchema, 'affiliate_clicks');
const Conversion = mongoose.model('Conversion', conversionSchema, 'conversions');
const PayoutRequest = mongoose.model('PayoutRequest', payoutRequestSchema, 'payout_requests');

const collections = {
  users: User,
  campaigns: Campaign,
  affiliate_links: AffiliateLink,
  affiliate_clicks: AffiliateClick,
  conversions: Conversion,
  payout_requests: PayoutRequest
};

function plain(doc) {
  const obj = clone(doc);
  delete obj._id;
  return obj;
}

function sortDescById(a, b) {
  return Number(b.id || 0) - Number(a.id || 0);
}

function sortDescByDate(field) {
  return (a, b) => String(b[field] || '').localeCompare(String(a[field] || ''));
}

function normalize(sql) {
  return String(sql || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not configured');
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB connected');
}

async function syncCounter(name, Model) {
  const highest = await Model.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
  await Counter.updateOne(
    { name },
    { $max: { seq: Number(highest?.id || 0) } },
    { upsert: true }
  );
}

async function nextId(name) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
  return counter.seq;
}

async function insert(table, row) {
  const Model = collections[table];
  if (!Model) throw new Error(`Unknown MongoDB collection: ${table}`);
  const id = await nextId(table);
  const created = await Model.create({ id, ...row });
  return plain(created.toObject());
}

async function snapshot() {
  const [users, campaigns, affiliateLinks, affiliateClicks, conversions, payoutRequests] = await Promise.all([
    User.find({}).lean(),
    Campaign.find({}).lean(),
    AffiliateLink.find({}).lean(),
    AffiliateClick.find({}).lean(),
    Conversion.find({}).lean(),
    PayoutRequest.find({}).lean()
  ]);

  return {
    users: users.map(plain),
    campaigns: campaigns.map(plain),
    affiliate_links: affiliateLinks.map(plain),
    affiliate_clicks: affiliateClicks.map(plain),
    conversions: conversions.map(plain),
    payout_requests: payoutRequests.map(plain)
  };
}

function userPublic(user) {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
}

function getCampaign(db, campaignId) {
  return db.campaigns.find((campaign) => Number(campaign.id) === Number(campaignId));
}

function getUser(db, userId) {
  return db.users.find((user) => Number(user.id) === Number(userId));
}

function getLink(db, linkId) {
  return db.affiliate_links.find((link) => Number(link.id) === Number(linkId));
}

function linkClicks(db, linkId) {
  return db.affiliate_clicks.filter((click) => Number(click.affiliate_link_id) === Number(linkId));
}

function linkConversions(db, linkId) {
  return db.conversions.filter((conversion) => Number(conversion.affiliate_link_id) === Number(linkId));
}

function linksForInfluencer(db, influencerId) {
  return db.affiliate_links.filter((link) => Number(link.influencer_id) === Number(influencerId));
}

function linksForCampaign(db, campaignId) {
  return db.affiliate_links.filter((link) => Number(link.campaign_id) === Number(campaignId));
}

function campaignMetrics(db, campaignId) {
  const links = linksForCampaign(db, campaignId);
  const clicks = links.flatMap((link) => linkClicks(db, link.id));
  const conversions = links.flatMap((link) => linkConversions(db, link.id));
  return {
    affiliate_link_count: links.length,
    click_count: clicks.length,
    conversion_count: conversions.length,
    commission_total: conversions.reduce((sum, row) => sum + toNumber(row.commission_earned), 0)
  };
}

function linkDetails(db, link) {
  const campaign = getCampaign(db, link.campaign_id) || {};
  const clicks = linkClicks(db, link.id);
  const conversions = linkConversions(db, link.id);
  return {
    ...clone(link),
    campaign_title: campaign.title || 'Unknown campaign',
    campaign_description: campaign.description || '',
    destination_url: campaign.destination_url || 'https://example.com',
    commission_rate: toNumber(campaign.commission_rate),
    campaign_status: campaign.status || 'active',
    click_count: clicks.length,
    conversion_count: conversions.length,
    sales_total: conversions.reduce((sum, row) => sum + toNumber(row.conversion_value), 0),
    commission_total: conversions.reduce((sum, row) => sum + toNumber(row.commission_earned), 0),
    revenue: conversions.reduce((sum, row) => sum + toNumber(row.conversion_value), 0),
    commission: conversions.reduce((sum, row) => sum + toNumber(row.commission_earned), 0)
  };
}

function conversionDetails(db, conversion) {
  const link = getLink(db, conversion.affiliate_link_id) || {};
  const campaign = getCampaign(db, link.campaign_id) || {};
  return {
    ...clone(conversion),
    unique_code: link.unique_code,
    influencer_id: link.influencer_id,
    campaign_id: link.campaign_id,
    campaign_title: campaign.title || 'Unknown campaign'
  };
}

function payoutDetails(db, payout) {
  const user = getUser(db, payout.influencer_id) || {};
  return {
    ...clone(payout),
    influencer_name: user.name || 'Unknown user',
    influencer_email: user.email || ''
  };
}

function getCampaignsWithMetrics(db) {
  return clone(db.campaigns)
    .sort(sortDescByDate('created_at'))
    .map((campaign) => ({ ...campaign, ...campaignMetrics(db, campaign.id) }));
}

function getInfluencerStats(db, influencerId) {
  const links = linksForInfluencer(db, influencerId);
  const clicks = links.flatMap((link) => linkClicks(db, link.id));
  const conversions = links.flatMap((link) => linkConversions(db, link.id));
  return {
    links: links.length,
    clicks: clicks.length,
    conversions: conversions.length,
    revenue: conversions.reduce((sum, row) => sum + toNumber(row.conversion_value), 0),
    commission: conversions.reduce((sum, row) => sum + toNumber(row.commission_earned), 0)
  };
}

function getAdminStats(db) {
  return {
    users: db.users.length,
    campaigns: db.campaigns.length,
    clicks: db.affiliate_clicks.length,
    conversions: db.conversions.length,
    commission: db.conversions.reduce((sum, row) => sum + toNumber(row.commission_earned), 0),
    pending_payouts: db.payout_requests.filter((payout) => payout.status === 'pending').length
  };
}

function getUsersWithMetrics(db) {
  return clone(db.users)
    .sort(sortDescByDate('created_at'))
    .map((user) => {
      const stats = getInfluencerStats(db, user.id);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        links: stats.links,
        clicks: stats.clicks,
        conversions: stats.conversions,
        commission: stats.commission
      };
    });
}

function getClickChart(db, influencerId) {
  const links = linksForInfluencer(db, influencerId).map((link) => Number(link.id));
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const minDate = sevenDaysAgo.toISOString().slice(0, 10);
  const buckets = new Map();

  db.affiliate_clicks.forEach((click) => {
    if (!links.includes(Number(click.affiliate_link_id))) return;
    const date = String(click.clicked_at || '').slice(0, 10);
    if (date < minDate) return;
    buckets.set(date, (buckets.get(date) || 0) + 1);
  });

  return [...buckets.entries()]
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, clicks]) => ({ date, clicks }));
}

function selectConversions(db, params, sql) {
  const norm = normalize(sql);
  let rows = db.conversions.map((conversion) => conversionDetails(db, conversion));

  if (norm.includes('where cv.id = ?')) {
    rows = rows.filter((row) => Number(row.id) === Number(params[0]));
    if (norm.includes('and al.influencer_id = ?')) {
      rows = rows.filter((row) => Number(row.influencer_id) === Number(params[1]));
    }
  } else if (norm.includes('where al.influencer_id = ?')) {
    rows = rows.filter((row) => Number(row.influencer_id) === Number(params[0]));
  }

  return rows.sort(sortDescByDate('created_at'));
}

async function seedInitialData() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@portal.com').toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail }).lean();

  if (!existingAdmin) {
    await insert('users', {
      name: process.env.ADMIN_NAME || 'Admin User',
      email: adminEmail,
      password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'password', 10),
      role: 'admin',
      created_at: now()
    });
  }

  const campaignCount = await Campaign.countDocuments();
  if (campaignCount === 0) {
    const starterCampaigns = [
      {
        brand_id: null,
        title: 'Campus Creator Launch',
        description: 'Promote a starter creator campaign and earn commission on every tracked sale.',
        commission_rate: 12,
        budget: 25000,
        destination_url: 'https://example.com/campus-creator',
        status: 'active'
      },
      {
        brand_id: null,
        title: 'Premium Gadget Promo',
        description: 'Affiliate campaign for creators promoting tech products.',
        commission_rate: 8,
        budget: 50000,
        destination_url: 'https://example.com/gadgets',
        status: 'active'
      },
      {
        brand_id: null,
        title: 'Fashion Drop Campaign',
        description: 'Commission-based campaign for influencer-led fashion sales.',
        commission_rate: 10,
        budget: 35000,
        destination_url: 'https://example.com/fashion',
        status: 'active'
      }
    ];

    for (const campaign of starterCampaigns) {
      await insert('campaigns', { ...campaign, created_at: now(), updated_at: now() });
    }
  }
}

async function initialize() {
  if (initialized && mongoose.connection.readyState === 1) return;
  try {
    await connectMongo();
    await Promise.all(Object.entries(collections).map(([name, Model]) => syncCounter(name, Model)));
    await seedInitialData();
    initialized = true;
    console.log('MongoDB database ready: influencer_affiliate_portal');
  } catch (error) {
    console.error('MongoDB setup failed.');
    console.error(`Reason: ${error.message}`);
    console.error('Fix backend/.env MONGO_URI or start MongoDB, then restart the backend.');
    throw error;
  }
}

async function resetDatabase() {
  await initialize();
  await Promise.all([
    User.deleteMany({}),
    Campaign.deleteMany({}),
    AffiliateLink.deleteMany({}),
    AffiliateClick.deleteMany({}),
    Conversion.deleteMany({}),
    PayoutRequest.deleteMany({}),
    Counter.deleteMany({})
  ]);
  initialized = false;
  await initialize();
}

async function query(sql, params = []) {
  await initialize();
  const db = await snapshot();
  const norm = normalize(sql);

  if (norm === 'select 1') return [[{ 1: 1 }], []];

  // USERS / AUTH
  if (norm.startsWith('select id from users where email')) {
    const email = String(params[0] || '').toLowerCase();
    return [db.users.filter((user) => user.email === email).map((user) => ({ id: user.id })), []];
  }

  if (norm.startsWith('select * from users where email')) {
    const email = String(params[0] || '').toLowerCase();
    return [clone(db.users.filter((user) => user.email === email).slice(0, 1)), []];
  }

  if (norm.startsWith('select id, name, email, role, created_at from users where id')) {
    const user = getUser(db, params[0]);
    return [user ? [userPublic(clone(user))] : [], []];
  }

  if (norm.startsWith('select id, name, email, role from users order by id desc')) {
    return [getUsersWithMetrics(db).map(({ id, name, email, role }) => ({ id, name, email, role })), []];
  }

  if (norm.startsWith('insert into users')) {
    const [name, email, password, role] = params;
    const user = await insert('users', {
      name,
      email: String(email || '').toLowerCase(),
      password,
      role,
      created_at: now()
    });
    return [{ insertId: user.id, affectedRows: 1 }, []];
  }

  if (norm.startsWith('update users set name = ?, password = ?, role = ? where email = ?')) {
    const [name, password, role, email] = params;
    const result = await User.updateOne(
      { email: String(email || '').toLowerCase() },
      { $set: { name, password, role } }
    );
    return [{ affectedRows: result.matchedCount || 0 }, []];
  }

  // CAMPAIGNS
  if (norm.startsWith('insert into campaigns')) {
    const [brand_id, title, description, commission_rate, budget, destination_url, status] = params;
    const campaign = await insert('campaigns', {
      brand_id: brand_id || null,
      title,
      description,
      commission_rate: toNumber(commission_rate),
      budget: toNumber(budget),
      destination_url,
      status,
      created_at: now(),
      updated_at: now()
    });
    return [{ insertId: campaign.id, affectedRows: 1 }, []];
  }

  if (norm.startsWith('select id, status from campaigns where id')) {
    const campaign = getCampaign(db, params[0]);
    return [campaign ? [{ id: campaign.id, status: campaign.status }] : [], []];
  }

  if (norm.startsWith('select * from campaigns where id')) {
    const campaign = getCampaign(db, params[0]);
    return [campaign ? [clone(campaign)] : [], []];
  }

  if (norm.startsWith('select * from campaigns order by id desc')) {
    return [clone(db.campaigns).sort(sortDescById), []];
  }

  if (norm.startsWith('select c.*, case when al.id is null')) {
    const influencerId = Number(params[0]);
    const rows = clone(db.campaigns)
      .filter((campaign) => campaign.status === 'active')
      .sort(sortDescByDate('created_at'))
      .map((campaign) => ({
        ...campaign,
        has_link: db.affiliate_links.some((link) => Number(link.campaign_id) === Number(campaign.id) && Number(link.influencer_id) === influencerId) ? 1 : 0
      }));
    return [rows, []];
  }

  if (norm.startsWith('select c.*') && norm.includes('from campaigns c')) {
    return [getCampaignsWithMetrics(db), []];
  }

  if (norm.startsWith('update campaigns')) {
    const [title, description, commission_rate, budget, destination_url, status, id] = params;
    const result = await Campaign.updateOne(
      { id: Number(id) },
      {
        $set: {
          title,
          description,
          commission_rate: toNumber(commission_rate),
          budget: toNumber(budget),
          destination_url,
          status,
          updated_at: now()
        }
      }
    );
    return [{ affectedRows: result.matchedCount || 0 }, []];
  }

  if (norm.startsWith('delete from campaigns where id')) {
    const id = Number(params[0]);
    const result = await Campaign.deleteOne({ id });
    const links = db.affiliate_links.filter((link) => Number(link.campaign_id) === id).map((link) => Number(link.id));
    await AffiliateLink.deleteMany({ campaign_id: id });
    await AffiliateClick.deleteMany({ affiliate_link_id: { $in: links } });
    await Conversion.deleteMany({ affiliate_link_id: { $in: links } });
    return [{ affectedRows: result.deletedCount || 0 }, []];
  }

  // AFFILIATE LINKS
  if (norm.startsWith('select id from affiliate_links where unique_code')) {
    const code = String(params[0] || '');
    return [db.affiliate_links.filter((link) => link.unique_code === code).map((link) => ({ id: link.id })).slice(0, 1), []];
  }

  if (norm.startsWith('select id from affiliate_links where influencer_id')) {
    const [influencerId, campaignId] = params.map(Number);
    const link = db.affiliate_links.find((row) => Number(row.influencer_id) === influencerId && Number(row.campaign_id) === campaignId);
    return [link ? [{ id: link.id }] : [], []];
  }

  if (norm.startsWith('insert into affiliate_links')) {
    const [influencer_id, campaign_id, unique_code] = params;
    const link = await insert('affiliate_links', {
      influencer_id: Number(influencer_id),
      campaign_id: Number(campaign_id),
      unique_code,
      created_at: now()
    });
    return [{ insertId: link.id, affectedRows: 1 }, []];
  }

  if (norm.startsWith('select al.id, al.unique_code, c.destination_url')) {
    const code = String(params[0] || '');
    const link = db.affiliate_links.find((row) => row.unique_code === code);
    if (!link) return [[], []];
    const campaign = getCampaign(db, link.campaign_id) || {};
    return [[{ id: link.id, unique_code: link.unique_code, destination_url: campaign.destination_url || 'https://example.com' }], []];
  }

  if (norm.startsWith('insert into affiliate_clicks')) {
    const [affiliate_link_id, ip_address, user_agent] = params;
    const click = await insert('affiliate_clicks', {
      affiliate_link_id: Number(affiliate_link_id),
      ip_address,
      user_agent,
      clicked_at: now()
    });
    return [{ insertId: click.id, affectedRows: 1 }, []];
  }

  if (norm.startsWith('delete from affiliate_links where id')) {
    const id = Number(params[0]);
    const influencerId = params[1] !== undefined ? Number(params[1]) : null;
    const filter = influencerId === null ? { id } : { id, influencer_id: influencerId };
    const result = await AffiliateLink.deleteOne(filter);
    if (result.deletedCount) {
      await AffiliateClick.deleteMany({ affiliate_link_id: id });
      await Conversion.deleteMany({ affiliate_link_id: id });
    }
    return [{ affectedRows: result.deletedCount || 0 }, []];
  }

  if (norm.startsWith('select al.id') && norm.includes('from affiliate_links al') && norm.includes('inner join campaigns c')) {
    let rows = db.affiliate_links.map((link) => linkDetails(db, link));
    if (norm.includes('where al.id = ?')) rows = rows.filter((row) => Number(row.id) === Number(params[0]));
    if (norm.includes('where al.influencer_id = ?')) rows = rows.filter((row) => Number(row.influencer_id) === Number(params[0]));
    if (norm.includes('and al.influencer_id = ?')) rows = rows.filter((row) => Number(row.influencer_id) === Number(params[params.length - 1]));
    rows = rows.sort(sortDescByDate('created_at'));
    return [clone(rows), []];
  }

  if (norm.startsWith('select al.*')) {
    return [clone(db.affiliate_links).sort(sortDescById), []];
  }

  // CONVERSIONS
  if (norm.startsWith('select al.id, al.influencer_id, c.commission_rate')) {
    const link = getLink(db, params[0]);
    if (!link) return [[], []];
    const campaign = getCampaign(db, link.campaign_id) || {};
    return [[{ id: link.id, influencer_id: link.influencer_id, commission_rate: toNumber(campaign.commission_rate) }], []];
  }

  if (norm.startsWith('insert into conversions')) {
    const [affiliate_link_id, conversion_value, commission_earned] = params;
    const conversion = await insert('conversions', {
      affiliate_link_id: Number(affiliate_link_id),
      conversion_value: toNumber(conversion_value),
      commission_earned: toNumber(commission_earned),
      created_at: now()
    });
    return [{ insertId: conversion.id, affectedRows: 1 }, []];
  }

  if (norm.startsWith('select cv.*') || (norm.startsWith('select c.*') && norm.includes('from conversions c'))) {
    return [selectConversions(db, params, sql), []];
  }

  if (norm.startsWith('delete from conversions where id')) {
    const result = await Conversion.deleteOne({ id: Number(params[0]) });
    return [{ affectedRows: result.deletedCount || 0 }, []];
  }

  if (norm.startsWith('select count(cv.id) as totalconversions')) {
    const influencerId = Number(params[0]);
    const links = linksForInfluencer(db, influencerId).map((link) => Number(link.id));
    const conversions = db.conversions.filter((row) => links.includes(Number(row.affiliate_link_id)));
    return [[{
      totalConversions: conversions.length,
      totalSales: conversions.reduce((sum, row) => sum + toNumber(row.conversion_value), 0),
      totalCommission: conversions.reduce((sum, row) => sum + toNumber(row.commission_earned), 0)
    }], []];
  }

  // DASHBOARD
  if (norm.startsWith('select (select count(*) from affiliate_links where influencer_id')) {
    return [[getInfluencerStats(db, params[0])], []];
  }

  if (norm.startsWith('select al.id, al.unique_code')) {
    const influencerId = Number(params[0]);
    const rows = linksForInfluencer(db, influencerId).map((link) => {
      const details = linkDetails(db, link);
      return {
        id: details.id,
        unique_code: details.unique_code,
        created_at: details.created_at,
        campaign_id: details.campaign_id,
        campaign_title: details.campaign_title,
        campaign_description: details.campaign_description,
        commission_rate: details.commission_rate,
        destination_url: details.destination_url,
        campaign_status: details.campaign_status,
        click_count: details.click_count,
        conversion_count: details.conversion_count,
        revenue: details.revenue,
        commission: details.commission
      };
    }).sort(sortDescByDate('created_at'));
    return [rows, []];
  }

  if (norm.startsWith('select date(ac.clicked_at)')) {
    return [getClickChart(db, params[0]), []];
  }

  if (norm.startsWith('select id, amount, status, note, requested_at, updated_at from payout_requests')) {
    const influencerId = Number(params[0]);
    return [clone(db.payout_requests)
      .filter((payout) => Number(payout.influencer_id) === influencerId)
      .sort(sortDescByDate('requested_at'))
      .slice(0, 8), []];
  }

  if (norm.startsWith('select (select count(*) from users)')) {
    return [[getAdminStats(db)], []];
  }

  if (norm.startsWith('select u.id')) {
    return [getUsersWithMetrics(db).slice(0, 50), []];
  }

  // PAYOUTS
  if (norm.startsWith('insert into payout_requests')) {
    const [influencer_id, amount, note] = params;
    const payout = await insert('payout_requests', {
      influencer_id: Number(influencer_id),
      amount: toNumber(amount),
      note: note || null,
      status: 'pending',
      requested_at: now(),
      updated_at: now()
    });
    return [{ insertId: payout.id, affectedRows: 1 }, []];
  }

  if (norm.startsWith('select * from payout_requests where id')) {
    const payout = db.payout_requests.find((row) => Number(row.id) === Number(params[0]));
    return [payout ? [clone(payout)] : [], []];
  }

  if (norm.startsWith('select pr.*')) {
    let rows = db.payout_requests.map((payout) => payoutDetails(db, payout));
    if (norm.includes('where pr.influencer_id = ?')) {
      rows = rows.filter((row) => Number(row.influencer_id) === Number(params[0]));
    }
    if (norm.includes('where pr.id = ?')) {
      rows = rows.filter((row) => Number(row.id) === Number(params[0]));
    }
    rows = rows.sort(sortDescByDate('requested_at'));
    if (norm.includes('limit 20')) rows = rows.slice(0, 20);
    return [rows, []];
  }

  if (norm.startsWith('update payout_requests set status')) {
    const [status, id] = params;
    const result = await PayoutRequest.updateOne(
      { id: Number(id) },
      { $set: { status, updated_at: now() } }
    );
    return [{ affectedRows: result.matchedCount || 0 }, []];
  }

  console.warn('MongoDB adapter received unsupported query:', sql);
  return [[], []];
}

async function end() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  initialized = false;
}

module.exports = {
  query,
  initialize,
  resetDatabase,
  end,
  models: {
    User,
    Campaign,
    AffiliateLink,
    AffiliateClick,
    Conversion,
    PayoutRequest,
    Counter
  }
};
