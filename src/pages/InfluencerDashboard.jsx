import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Copy, Link2, Plus, ReceiptIndianRupee, RefreshCw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import Table from '../components/Table';
import { useToast } from '../components/Toast';
import api from '../lib/api';
import { currency, number, percent, shortDate } from '../lib/formatters';

export default function InfluencerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [conversionForm, setConversionForm] = useState({ affiliate_link_id: '', conversion_value: '' });
  const [payoutForm, setPayoutForm] = useState({ amount: '', note: '' });
  const { pushToast } = useToast();

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/dashboard/influencer');
      setDashboard(data.data);
      if (data.data.campaigns?.length && !selectedCampaign) {
        setSelectedCampaign(String(data.data.campaigns[0].id));
      }
      if (data.data.links?.length && !conversionForm.affiliate_link_id) {
        setConversionForm((current) => ({ ...current, affiliate_link_id: String(data.data.links[0].id) }));
      }
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to load dashboard', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const data = dashboard?.stats || {};
    return [
      { label: 'Affiliate Links', value: number(data.links), delta: 'Live', tone: 'red' },
      { label: 'Clicks', value: number(data.clicks), delta: 'Tracked' },
      { label: 'Conversions', value: number(data.conversions), delta: 'API' },
      { label: 'Commission', value: currency(data.commission), delta: 'Real' },
    ];
  }, [dashboard]);

  const performance = useMemo(() => {
    const clicks = Number(dashboard?.stats?.clicks || 0);
    const conversions = Number(dashboard?.stats?.conversions || 0);
    const revenue = Number(dashboard?.stats?.revenue || 0);
    return [
      { label: 'Conversion Rate', value: clicks ? percent((conversions / clicks) * 100) : '0.0%' },
      { label: 'Sales Revenue', value: currency(revenue) },
      { label: 'Average Sale', value: conversions ? currency(revenue / conversions) : currency(0) },
    ];
  }, [dashboard]);

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      pushToast('Affiliate link copied');
    } catch {
      pushToast('Clipboard permission blocked', 'info');
    }
  };

  const createLink = async (event) => {
    event.preventDefault();
    if (!selectedCampaign) return pushToast('Choose a campaign first', 'info');

    try {
      await api.post('/affiliate-links', { campaign_id: Number(selectedCampaign) });
      pushToast('Affiliate link created');
      await loadDashboard();
    } catch (error) {
      pushToast(error.response?.data?.message || 'Could not create link', 'info');
    }
  };

  const recordConversion = async (event) => {
    event.preventDefault();
    if (!conversionForm.affiliate_link_id || !conversionForm.conversion_value) {
      return pushToast('Select a link and enter sale value', 'info');
    }

    try {
      await api.post('/conversions', {
        affiliate_link_id: Number(conversionForm.affiliate_link_id),
        conversion_value: Number(conversionForm.conversion_value),
      });
      setConversionForm((current) => ({ ...current, conversion_value: '' }));
      pushToast('Conversion recorded with automatic commission');
      await loadDashboard();
    } catch (error) {
      pushToast(error.response?.data?.message || 'Could not record conversion', 'info');
    }
  };

  const requestPayout = async (event) => {
    event.preventDefault();
    if (!payoutForm.amount) return pushToast('Enter payout amount', 'info');

    try {
      await api.post('/payouts', {
        amount: Number(payoutForm.amount),
        note: payoutForm.note,
      });
      setPayoutForm({ amount: '', note: '' });
      pushToast('Payout request submitted');
      await loadDashboard();
    } catch (error) {
      pushToast(error.response?.data?.message || 'Could not request payout', 'info');
    }
  };

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base text-white">
        Loading real dashboard data...
      </div>
    );
  }

  return (
    <div className="app-shell flex bg-base">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar title="Influencer Dashboard" subtitle="API-backed creator workspace" onMenuClick={() => setDrawerOpen(true)} />
        <main className="space-y-6 px-4 py-6 md:px-8">
          <section className="grid gap-4 xl:grid-cols-4">
            {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <Card className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="section-label">Clicks</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Last 7 days</h2>
                </div>
                <Button variant="secondary" onClick={loadDashboard}>
                  <RefreshCw className="h-4 w-4" /> Refresh
                </Button>
              </div>
              <div className="mt-6 h-72 rounded-xl border border-slate-800 bg-slate-950 p-4">
                {dashboard?.chart?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboard.chart}>
                      <defs>
                        <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e50914" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#e50914" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#71717a" />
                      <YAxis tickLine={false} axisLine={false} stroke="#71717a" />
                      <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px' }} />
                      <Area type="monotone" dataKey="clicks" stroke="#e50914" fill="url(#clickGradient)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">No clicks yet. Copy and open an affiliate link to track clicks.</div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <p className="section-label">Performance</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Quick numbers</h2>
              <div className="mt-6 space-y-3">
                {performance.map((item) => (
                  <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400">{item.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <Card className="p-6">
              <p className="section-label">Create Link</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Choose active campaign</h2>
              <form className="mt-5 space-y-4" onSubmit={createLink}>
                <select
                  value={selectedCampaign}
                  onChange={(event) => setSelectedCampaign(event.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                >
                  {dashboard?.campaigns?.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.title} — {percent(campaign.commission_rate)}
                    </option>
                  ))}
                </select>
                <Button className="w-full" type="submit">
                  <Link2 className="h-4 w-4" /> Generate affiliate link
                </Button>
              </form>
            </Card>

            <Card className="p-6">
              <p className="section-label">Record Sale</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Automatic commission</h2>
              <form className="mt-5 space-y-4" onSubmit={recordConversion}>
                <select
                  value={conversionForm.affiliate_link_id}
                  onChange={(event) => setConversionForm((current) => ({ ...current, affiliate_link_id: event.target.value }))}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                >
                  <option value="">Select affiliate link</option>
                  {dashboard?.links?.map((link) => (
                    <option key={link.id} value={link.id}>{link.campaign_title}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={conversionForm.conversion_value}
                  onChange={(event) => setConversionForm((current) => ({ ...current, conversion_value: event.target.value }))}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                  placeholder="Sale value, e.g. 2500"
                />
                <Button className="w-full" type="submit">
                  <ReceiptIndianRupee className="h-4 w-4" /> Save conversion
                </Button>
              </form>
            </Card>

            <Card className="p-6">
              <p className="section-label">Payout</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Request commission payout</h2>
              <form className="mt-5 space-y-4" onSubmit={requestPayout}>
                <input
                  type="number"
                  min="1"
                  value={payoutForm.amount}
                  onChange={(event) => setPayoutForm((current) => ({ ...current, amount: event.target.value }))}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                  placeholder="Amount"
                />
                <input
                  value={payoutForm.note}
                  onChange={(event) => setPayoutForm((current) => ({ ...current, note: event.target.value }))}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                  placeholder="Optional note"
                />
                <Button className="w-full" type="submit">
                  <Plus className="h-4 w-4" /> Request payout
                </Button>
              </form>
            </Card>
          </section>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-label">Affiliate Links</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Real links from database</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dashboard?.links?.length ? dashboard.links.map((link) => (
                <div key={link.id} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{link.campaign_title}</p>
                      <p className="mt-1 text-xs text-slate-400">{number(link.click_count)} clicks · {number(link.conversion_count)} conversions</p>
                    </div>
                    <button type="button" onClick={() => copyLink(link.tracking_url)} className="rounded-lg border border-slate-800 p-2 text-slate-300 hover:bg-slate-700">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-4 break-all rounded-xl bg-slate-950 p-3 text-xs text-slate-400">{link.tracking_url}</p>
                  <div className="mt-4 flex justify-between text-sm text-slate-300">
                    <span>{percent(link.commission_rate)}</span>
                    <span>{currency(link.commission)}</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-400">No affiliate links yet. Generate one from an active campaign above.</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <p className="section-label">Payout History</p>
            <div className="mt-5">
              <Table
                columns={['Date', 'Amount', 'Status', 'Note']}
                rows={dashboard?.payouts || []}
                renderRow={(payout) => (
                  <tr key={payout.id} className="transition hover:bg-slate-900">
                    <td className="px-5 py-4 text-slate-300">{shortDate(payout.requested_at)}</td>
                    <td className="px-5 py-4 text-slate-300">{currency(payout.amount)}</td>
                    <td className="px-5 py-4 capitalize text-slate-300">{payout.status}</td>
                    <td className="px-5 py-4 text-slate-400">{payout.note || '-'}</td>
                  </tr>
                )}
              />
            </div>
          </Card>
        </main>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 bg-black/70 xl:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-80 border-r border-slate-800 bg-slate-950 p-6" onClick={(event) => event.stopPropagation()}>
            <Sidebar mobile />
          </div>
        </div>
      ) : null}
    </div>
  );
}
