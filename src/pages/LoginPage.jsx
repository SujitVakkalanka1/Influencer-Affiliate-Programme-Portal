import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import Button from '../components/Button';
import Card from '../components/Card';

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Access Portal"
      title="Welcome back to your creator workspace"
      subtitle="Sign in to manage affiliate links, campaign performance, and payout approvals in a premium dark interface."
    >
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <Card className="p-6 sm:p-8">
          <div className="mb-8">
            <p className="section-label">Login</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Continue with your account</h2>
          </div>
          <form className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">Email address</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 focus-within:border-red-500/60">
                <Mail className="h-4 w-4 text-zinc-500" />
                <input className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none" placeholder="creator@portal.com" />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 focus-within:border-red-500/60">
                <Lock className="h-4 w-4 text-zinc-500" />
                <input type="password" className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none" placeholder="••••••••" />
              </div>
            </label>
            <div className="flex items-center justify-between text-sm text-zinc-500">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-red-500" />
                Remember me
              </label>
              <a href="#" className="transition hover:text-white">Forgot password?</a>
            </div>
            <Button className="w-full">Login</Button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-500">
            New here? <Link to="/register" className="text-white transition hover:text-red-300">Create account</Link>
          </p>
        </Card>
      </motion.div>
    </AuthShell>
  );
}
