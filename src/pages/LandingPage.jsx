import { ArrowRight, PlayCircle, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Navbar from '../components/Navbar';
import { landingFeatures } from '../data/mockData';

const highlights = [
  { title: 'Creator-ready dashboards', value: '01' },
  { title: 'Red-accent campaign system', value: '02' },
  { title: 'Minimal premium UX', value: '03' },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen text-white">
      <div className="absolute inset-0 -z-10 bg-hero-glow" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <Navbar links={[{ href: '#features', label: 'Features' }, { href: '#dashboard', label: 'Dashboard' }, { href: '#platform', label: 'Platform' }]} />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/15 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-red-300">
            <Sparkles className="h-3.5 w-3.5" />
            Premium creator operations
          </div>
          <h1 className="mt-8 text-5xl font-semibold leading-[0.92] text-white sm:text-6xl xl:text-7xl">
            Turn Influence Into Income
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
            A cinematic affiliate portal for creators and administrators who want a clean, modern, and high-trust workspace for revenue, links, and approvals.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button as="link" to="/register">
              Start Earning <ArrowRight className="h-4 w-4" />
            </Button>
            <Button as="link" to="/login" variant="secondary">
              Login <PlayCircle className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <Card key={item.title} className="p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-600">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{item.title}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 translate-y-10 rounded-[2rem] bg-red-500/15 blur-3xl" />
          <Card className="overflow-hidden p-0">
            <div className="grid-pattern border-b border-white/10 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-label">Live Portal Preview</p>
                  <h2 className="mt-2 text-2xl text-white">Creator command center</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-red-500/15 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure
                </div>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(229,9,20,0.14),rgba(255,255,255,0.02))] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Revenue pulse</p>
                    <p className="mt-3 text-4xl font-semibold text-white">$24,840</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-red-400" />
                </div>
                <div className="mt-6 h-2 rounded-full bg-white/5">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-red-600 to-red-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Clicks</p>
                  <p className="mt-3 text-2xl font-semibold text-white">48.2K</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Conversions</p>
                  <p className="mt-3 text-2xl font-semibold text-white">3,216</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="section-label">Features</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Minimal, premium, and creator-first.</h2>
          </div>
          <p className="hidden max-w-xl text-sm leading-7 text-zinc-500 md:block">
            The interface keeps focus on performance, commissions, and approvals while preserving a cinematic black-and-red aesthetic.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {landingFeatures.map((feature) => (
            <Card key={feature.title} className="p-6">
              <p className="text-sm font-semibold text-white">{feature.title}</p>
              <p className="mt-4 text-sm leading-7 text-zinc-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="dashboard" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="p-7">
            <p className="section-label">Smooth Flow</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Everything is spaced, calm, and easy to scan.</h2>
            <p className="mt-5 text-sm leading-7 text-zinc-400">
              Inspired by YouTube Studio and Netflix, but stripped down to the essentials so creators and admins can move quickly.
            </p>
            <div className="mt-8 space-y-3">
              {['Dark mode only', 'Rounded cards', 'Soft red glow accents'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  {item}
                </div>
              ))}
            </div>
          </Card>
          <Card className="overflow-hidden p-0">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="section-label">Platform feel</p>
              <h3 className="mt-2 text-2xl text-white">Streaming-inspired campaign boards</h3>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              {['Campaign tracking', 'Creator payouts', 'Link performance', 'Admin approvals'].map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">0{index + 1}</p>
                  <p className="mt-3 text-lg text-white">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <footer id="platform" className="border-t border-white/10 bg-black/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Influencer Affiliate Programme Portal</p>
          <div className="flex gap-6">
            <Link to="/dashboard" className="transition hover:text-white">Creator Dashboard</Link>
            <Link to="/admin" className="transition hover:text-white">Admin Dashboard</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
