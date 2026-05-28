import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Copy, ExternalLink, Menu, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { affiliateLinks, chartData, influencerStats, recentActivity } from '../data/mockData';
import { useToast } from '../components/Toast';

export default function InfluencerDashboard() {
  const [selectedLink, setSelectedLink] = useState(affiliateLinks[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { pushToast } = useToast();

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      pushToast('Affiliate link copied to clipboard');
    } catch {
      pushToast('Clipboard access blocked', 'info');
    }
  };

  const performanceSummary = useMemo(
    () => [
      { label: 'CTR', value: '5.8%' },
      { label: 'Conversion Rate', value: '13.1%' },
      { label: 'Avg. Order Value', value: '$74.40' },
      { label: 'Refund Rate', value: '1.2%' },
    ],
    [],
  );

  return (
    <div className="app-shell flex bg-base">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar title="Influencer Dashboard" subtitle="Creator analytics" onMenuClick={() => setDrawerOpen(true)} />
        <main className="space-y-8 px-4 py-6 md:px-8">
          <section className="grid gap-5 xl:grid-cols-4">
            {influencerStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-label">Analytics</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Red-themed performance overview</h2>
                </div>
                <Button variant="secondary" onClick={() => setModalOpen(true)}>
                  <Plus className="h-4 w-4" /> New payout request
                </Button>
              </div>
              <div className="mt-6 h-80 rounded-[2rem] border border-white/10 bg-black/20 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e50914" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#e50914" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#71717a" />
                    <YAxis tickLine={false} axisLine={false} stroke="#71717a" />
                    <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' }} />
                    <Area type="monotone" dataKey="clicks" stroke="#e50914" fill="url(#clickGradient)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <p className="section-label">Performance</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Quick overview</h2>
              <div className="mt-6 space-y-4">
                {performanceSummary.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{item.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <Card className="p-6">
              <p className="section-label">Recent Activity</p>
              <div className="mt-5 space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        <p className="mt-2 text-sm text-zinc-500">{item.meta}</p>
                      </div>
                      <p className="text-xs text-zinc-600">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="section-label">Affiliate Links</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Manage high-performing links</h2>
                </div>
                <Button variant="secondary" onClick={() => copyLink(selectedLink.url)}>
                  <Copy className="h-4 w-4" /> Copy link
                </Button>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {affiliateLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => setSelectedLink(link)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      selectedLink.id === link.id ? 'border-red-500/30 bg-red-500/10' : 'border-white/10 bg-white/[0.03] hover:border-white/15'
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{link.label}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.3em] text-zinc-500">{link.performance}</p>
                    <p className="mt-3 break-all text-xs text-zinc-400">{link.url}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-black/30 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{selectedLink.label}</p>
                    <p className="mt-2 text-sm text-zinc-500">{selectedLink.url}</p>
                  </div>
                  <a href={selectedLink.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-red-300 transition hover:text-red-200">
                    Open <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 bg-black/65 xl:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-80 border-r border-white/10 bg-[#090909] p-6" onClick={(event) => event.stopPropagation()}>
            <Sidebar mobile />
          </div>
        </div>
      ) : null}

      <Modal open={modalOpen} title="Request payout" onClose={() => setModalOpen(false)}>
        Submit a payout request for the current campaign cycle. The modal is intentionally minimal, matching the rest of the portal.
      </Modal>
    </div>
  );
}
