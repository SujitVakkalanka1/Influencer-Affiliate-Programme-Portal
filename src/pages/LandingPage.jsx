import { ArrowRight, Database, Link as LinkIcon, ShieldCheck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Navbar from '../components/Navbar';

const features = [
  { title: 'Register users', description: 'New users are saved through the backend API into MongoDB.' },
  { title: 'Generate affiliate links', description: 'Influencers create tracking links for active campaigns.' },
  { title: 'Manage payouts', description: 'Payout requests can be reviewed and approved by admins.' },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar links={[{ href: '#features', label: 'Features' }, { href: '#flow', label: 'Flow' }]} />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-lg border border-red-900/40 bg-red-950/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-red-300">
            <ShieldCheck className="h-4 w-4" /> Full-stack portal
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Influencer Affiliate Programme Portal
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
            A simple dashboard for influencers and admins to manage campaigns, affiliate links, conversions, and payouts using the existing backend and MongoDB setup.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button as="link" to="/register">
              Create account <ArrowRight className="h-4 w-4" />
            </Button>
            <Button as="link" to="/login" variant="secondary">
              Login
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <p className="section-label">Project Flow</p>
          <h2 className="mt-2 text-2xl font-bold text-white">How it works</h2>
          <div className="mt-6 space-y-4">
            {[
              { icon: Database, title: 'Register', text: 'Frontend sends user details to the Express API.' },
              { icon: LinkIcon, title: 'Create link', text: 'Influencers generate a tracking URL for a campaign.' },
              { icon: TrendingUp, title: 'Track results', text: 'Clicks, sales, commission, and payouts come from database records.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="section-label">Features</p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Clean UI, same functionality.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="p-5">
              <p className="font-semibold text-white">{feature.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer id="flow" className="mt-12 border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Influencer Affiliate Programme Portal</p>
          <div className="flex gap-6">
            <Link to="/register" className="transition hover:text-white">Register</Link>
            <Link to="/login" className="transition hover:text-white">Login</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
