import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import Button from './Button';
import { getUser, logout } from '../lib/auth';

export default function Topbar({ title, subtitle, onMenuClick }) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex flex-col gap-4 border-b border-slate-800 bg-slate-950 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
      <div className="flex items-center justify-between gap-3 xl:hidden">
        <Logo />
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-slate-200 transition hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <div>
        <p className="section-label">{subtitle}</p>
        <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-right sm:block">
          <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
          <p className="text-xs capitalize text-slate-400">{user?.role || 'member'}</p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </header>
  );
}
