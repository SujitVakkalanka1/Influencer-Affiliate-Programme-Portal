import { LayoutDashboard, Link2, MonitorUp, Settings, Users, Wallet } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';

const dashboardItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard', label: 'Links', icon: Link2 },
  { to: '/dashboard', label: 'Performance', icon: MonitorUp },
  { to: '/admin', label: 'Admin', icon: Users },
  { to: '/admin', label: 'Payouts', icon: Wallet },
  { to: '/admin', label: 'Settings', icon: Settings },
];

export default function Sidebar({ active = 'influencer', mobile = false }) {
  return (
    <aside className={`${mobile ? 'flex' : 'hidden xl:flex'} min-h-screen w-72 flex-col border-r border-white/10 bg-[#090909]/95 px-6 py-7`}>
      <Logo />
      <div className="mt-10 space-y-2">
        {dashboardItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-red-500/10 text-white ring-1 ring-red-500/20' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>
      <div className="mt-auto rounded-3xl border border-red-500/15 bg-red-500/5 p-5">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">{active === 'admin' ? 'Admin mode' : 'Creator mode'}</p>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Premium creator operations with red-accented performance tracking and payout control.
        </p>
      </div>
    </aside>
  );
}
