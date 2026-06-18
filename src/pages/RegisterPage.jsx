import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import Button from '../components/Button';
import Card from '../components/Card';
import api from '../lib/api';
import { saveAuth } from '../lib/auth';
import { useToast } from '../components/Toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'influencer' });
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
      const { data } = await api.post('/auth/register', form);
      saveAuth(data);
      pushToast('Account created and saved in database');
      navigate('/dashboard');
    } catch (error) {
      pushToast(
        error.response?.data?.message || 'Cannot reach the registration service. Please try again shortly.',
        'info',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Create Account"
      title="Join the affiliate portal"
      subtitle="Register once, store the user in the database, then use real API data across the dashboard."
    >
      <Card className="p-6 sm:p-8">
        <div className="mb-7">
          <p className="section-label">Register</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Create your profile</h2>
          <p className="mt-2 text-sm text-slate-400">Your details are inserted into the MongoDB users collection through the API.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Full name</span>
            <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3.5 focus-within:border-red-500/60">
              <User className="h-4 w-4 text-slate-400" />
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                placeholder="Your name"
                required
              />
            </div>
          </label>

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
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Account type</span>
            <select
              value={form.role}
              onChange={(event) => updateField('role', event.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-red-500"
            >
              <option value="influencer">Influencer</option>
              <option value="brand">Brand</option>
            </select>
          </label>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-white transition hover:text-red-300">Login</Link>
        </p>
      </Card>
    </AuthShell>
  );
}
