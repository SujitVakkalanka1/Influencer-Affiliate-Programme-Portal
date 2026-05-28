import { Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import Button from '../components/Button';
import Card from '../components/Card';

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Create Account"
      title="Join the premium affiliate platform"
      subtitle="Start earning through a clean, dark, creator-first dashboard with campaign tracking and real-time analytics."
    >
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <Card className="p-6 sm:p-8">
          <div className="mb-8">
            <p className="section-label">Register</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Build your creator profile</h2>
          </div>
          <form className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">Full name</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 focus-within:border-red-500/60">
                <User className="h-4 w-4 text-zinc-500" />
                <input className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none" placeholder="Maya Creator" />
              </div>
            </label>
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
                <input type="password" className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none" placeholder="Create a strong password" />
              </div>
            </label>
            <Button className="w-full">Create account</Button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account? <Link to="/login" className="text-white transition hover:text-red-300">Login</Link>
          </p>
        </Card>
      </motion.div>
    </AuthShell>
  );
}
