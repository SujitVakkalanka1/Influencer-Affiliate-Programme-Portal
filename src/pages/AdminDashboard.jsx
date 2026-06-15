import { useEffect, useMemo, useState } from 'react';
import { Check, Plus, RefreshCw, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import { useToast } from '../components/Toast';
import api from '../lib/api';
import { currency, number, percent, shortDate } from '../lib/formatters';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    commission_rate: '',
    budget: '',
    destination_url: '',
  });
  const [loading, setLoading] = useState(true);
  const { pushToast } = useToast();

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/dashboard/admin');
      setDashboard(data.data);
    } catch (error) {
      pushToast(error.response?.data?.message || 'Unable to load admin data', 'info');
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
      { label: 'Users', value: number(data.users), delta: 'DB', tone: 'red' },
      { label: 'Campaigns', value: number(data.campaigns), delta: 'Live' },
      { label: 'Clicks', value: number(data.clicks), delta: 'Tracked' },
      { label: 'Commission', value: currency(data.commission), delta: 'Total' },
    ];
  }, [dashboard]);

  const filteredUsers = useMemo(() => {
    const users = dashboard?.users || [];
    const search = query.toLowerCase();
    return users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search));
  }, [dashboard, query]);

  const updateCampaignField = (field, value) => {
    setCampaignForm((current) => ({ ...current, [field]: value }));
  };

  const createCampaign = async (event) => {
    event.preventDefault();

    try {
      await api.post('/campaigns', {
        ...campaignForm,
        commission_rate: Number(campaignForm.commission_rate),
        budget: Number(campaignForm.budget || 0),
      });
      setCampaignForm({ title: '', description: '', commission_rate: '', budget: '', destination_url: '' });
      pushToast('Campaign created');
      await loadDashboard();
    } catch (error) {
      pushToast(error.response?.data?.message || 'Could not create campaign', 'info');
    }
  };

  const approvePayout = async (id) => {
    try {
      await api.patch(`/payouts/${id}/status`, { status: 'approved' });
      pushToast('Payout approved');
      await loadDashboard();
    } catch (error) {
      pushToast(error.response?.data?.message || 'Could not approve payout', 'info');
    }
  };

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base text-white">
        Loading admin database records...
      </div>
    );
  }

  return (
    <div className="app-shell flex bg-base">
      <Sidebar active="admin" />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar title="Admin Dashboard" subtitle="API operations center" onMenuClick={() => setDrawerOpen(true)} />
        <main className="space-y-6 px-4 py-6 md:px-8">
          <section className="grid gap-4 xl:grid-cols-4">
            {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Card className="p-6">
              <p className="section-label">New Campaign</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Create campaign in database</h2>
              <form className="mt-5 space-y-4" onSubmit={createCampaign}>
                <input
                  value={campaignForm.title}
                  onChange={(event) => updateCampaignField('title', event.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                  placeholder="Campaign title"
                  required
                />
                <textarea
                  value={campaignForm.description}
                  onChange={(event) => updateCampaignField('description', event.target.value)}
                  className="min-h-24 w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                  placeholder="Description"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={campaignForm.commission_rate}
                    onChange={(event) => updateCampaignField('commission_rate', event.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                    placeholder="Commission %"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    value={campaignForm.budget}
                    onChange={(event) => updateCampaignField('budget', event.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                    placeholder="Budget"
                  />
                </div>
                <input
                  type="url"
                  value={campaignForm.destination_url}
                  onChange={(event) => updateCampaignField('destination_url', event.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                  placeholder="Destination URL"
                  required
                />
                <Button className="w-full" type="submit">
                  <Plus className="h-4 w-4" /> Add campaign
                </Button>
              </form>
            </Card>

            <Card className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="section-label">Users</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Registered accounts</h2>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-400">
                  <Search className="h-4 w-4" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="w-44 bg-transparent text-white outline-none placeholder:text-slate-500"
                    placeholder="Search users"
                  />
                </div>
              </div>
              <div className="mt-6 overflow-x-auto">
                <Table
                  columns={['User', 'Role', 'Links', 'Commission']}
                  rows={filteredUsers}
                  renderRow={(user) => (
                    <tr key={user.id} className="transition hover:bg-slate-900">
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </td>
                      <td className="px-5 py-4 capitalize text-slate-300">{user.role}</td>
                      <td className="px-5 py-4 text-slate-300">{number(user.links)}</td>
                      <td className="px-5 py-4 text-slate-300">{currency(user.commission)}</td>
                    </tr>
                  )}
                />
              </div>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="section-label">Campaigns</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Database campaigns</h2>
                </div>
                <Button variant="secondary" onClick={loadDashboard}>
                  <RefreshCw className="h-4 w-4" /> Refresh
                </Button>
              </div>
              <div className="mt-6 space-y-3">
                {dashboard?.campaigns?.length ? dashboard.campaigns.map((campaign) => (
                  <div key={campaign.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-white">{campaign.title}</p>
                        <p className="mt-2 text-xs text-slate-400">{number(campaign.click_count)} clicks · {number(campaign.conversion_count)} conversions</p>
                      </div>
                      <p className="text-sm font-semibold text-red-300">{percent(campaign.commission_rate)}</p>
                    </div>
                  </div>
                )) : <p className="text-sm text-slate-400">No campaigns created yet.</p>}
              </div>
            </Card>

            <Card className="p-6">
              <p className="section-label">Payout Requests</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Approve pending payouts</h2>
              <div className="mt-6 space-y-3">
                {dashboard?.payouts?.length ? dashboard.payouts.map((payout) => (
                  <div key={payout.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
                    <div>
                      <p className="text-sm font-medium text-white">{payout.influencer_name}</p>
                      <p className="mt-1 text-xs text-slate-400">{currency(payout.amount)} · {shortDate(payout.requested_at)} · {payout.status}</p>
                    </div>
                    {payout.status === 'pending' ? (
                      <button type="button" onClick={() => approvePayout(payout.id)} className="rounded-lg bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20">
                        <Check className="mr-1 inline h-3.5 w-3.5" /> Approve
                      </button>
                    ) : (
                      <span className="rounded-lg border border-slate-800 px-4 py-2 text-xs capitalize text-slate-400">{payout.status}</span>
                    )}
                  </div>
                )) : <p className="text-sm text-slate-400">No payout requests yet.</p>}
              </div>
            </Card>
          </section>
        </main>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 bg-black/70 xl:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-80 border-r border-slate-800 bg-slate-950 p-6" onClick={(event) => event.stopPropagation()}>
            <Sidebar mobile active="admin" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
