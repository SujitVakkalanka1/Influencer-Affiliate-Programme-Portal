import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import Button from '../components/Button';
import Card from '../components/Card';
import api from '../lib/api';
import { saveAuth } from '../lib/auth';
import { useToast } from '../components/Toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', form);
      saveAuth(data);
      pushToast('Login successful');
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      pushToast(
        error.response?.data?.message || 'Cannot reach the login service. Please try again shortly.',
        'info',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Access Portal"
      title="Welcome back"
      subtitle="Login with your saved account and continue managing campaigns, links, payouts, and analytics."
    >
      <Card className="p-6 sm:p-8">
        <div className="mb-7">
          <p className="section-label">Login</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Continue to dashboard</h2>
          <p className="mt-2 text-sm text-slate-400">This form now calls the real backend API.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Email address</span>
            <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3.5 focus-within:border-red-500/60">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                placeholder="creator@portal.com"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Password</span>
            <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3.5 focus-within:border-red-500/60">
              <Lock className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                placeholder="Enter password"
                required
              />
            </div>
          </label>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New here? <Link to="/register" className="text-white transition hover:text-red-300">Create account</Link>
        </p>
      </Card>
    </AuthShell>
  );
}
