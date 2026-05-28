import { useMemo, useState } from 'react';
import { Check, Filter, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { adminUsers, campaigns } from '../data/mockData';
import { useToast } from '../components/Toast';

export default function AdminDashboard() {
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { pushToast } = useToast();

  const filteredUsers = useMemo(
    () => adminUsers.filter((user) => `${user.name} ${user.handle} ${user.status}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const columns = ['User', 'Status', 'Revenue', 'Payout'];

  const approvePayout = (name) => {
    pushToast(`${name} payout approved`);
    setModalOpen(false);
  };

  return (
    <div className="app-shell flex bg-base">
      <Sidebar active="admin" />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar title="Admin Dashboard" subtitle="Operations center" onMenuClick={() => setDrawerOpen(true)} />
        <main className="space-y-8 px-4 py-6 md:px-8">
          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-label">User Management</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Creator accounts and payout status</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
                  <Search className="h-4 w-4" />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-40 bg-transparent text-white outline-none placeholder:text-zinc-600" placeholder="Search users" />
                </div>
              </div>
              <div className="mt-6">
                <Table
                  columns={columns}
                  rows={filteredUsers}
                  renderRow={(user) => (
                    <tr key={user.name} className="transition hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-zinc-500">{user.handle}</p>
                      </td>
                      <td className="px-5 py-4 text-zinc-300">{user.status}</td>
                      <td className="px-5 py-4 text-zinc-300">{user.revenue}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.payout === 'Ready' ? 'bg-red-500/10 text-red-300' : 'bg-white/5 text-zinc-400'}`}>
                          {user.payout}
                        </span>
                      </td>
                    </tr>
                  )}
                />
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="section-label">Payout Approvals</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Review and release payments</h2>
                  </div>
                  <Button variant="secondary" onClick={() => setModalOpen(true)}>
                    <Check className="h-4 w-4" /> Review
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {adminUsers.slice(0, 3).map((user) => (
                    <div key={user.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">{user.revenue}</p>
                      </div>
                      <button type="button" onClick={() => approvePayout(user.name)} className="rounded-full bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20">
                        Approve
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="section-label">Campaign Monitoring</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Live campaign overview</h2>
                  </div>
                  <Filter className="h-5 w-5 text-zinc-500" />
                </div>
                <div className="mt-6 space-y-3">
                  {campaigns.map((campaign) => (
                    <div key={campaign.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-white">{campaign.name}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-zinc-500">{campaign.status}</p>
                        </div>
                        <p className="text-sm font-semibold text-red-300">{campaign.progress}</p>
                      </div>
                      <div className="mt-4 h-2 rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: campaign.progress }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 bg-black/65 xl:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-80 border-r border-white/10 bg-[#090909] p-6" onClick={(event) => event.stopPropagation()}>
            <Sidebar mobile active="admin" />
          </div>
        </div>
      ) : null}

      <Modal open={modalOpen} title="Approve payout batch" onClose={() => setModalOpen(false)}>
        Release the pending creator payouts for the current review batch. This flow is designed to feel concise and controlled.
      </Modal>
    </div>
  );
}
