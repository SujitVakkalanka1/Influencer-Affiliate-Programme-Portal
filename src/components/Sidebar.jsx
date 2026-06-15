import { LayoutDashboard, Link2, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { getUser } from '../lib/auth';

export default function Sidebar({ active = 'influencer', mobile = false }) {
  const user = getUser();
  const items = user?.role === 'admin'
    ? [{ to: '/admin', label: 'Admin Panel', icon: Users }]
    : [
        { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { to: '/dashboard', label: 'Links & Payouts', icon: Link2 },
      ];

  return (
    <aside className={`${mobile ? 'flex' : 'hidden xl:flex'} min-h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 px-5 py-6`}>
      <Logo />
      <div className="mt-8 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>
      <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{active === 'admin' ? 'Admin' : 'Influencer'}</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">Connected to the same backend and MongoDB database.</p>
      </div>
    </aside>
  );
}
