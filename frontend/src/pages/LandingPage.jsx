import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Link2, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
const features = [{ icon: Link2, title: "Smart affiliate links", text: "Launch trackable product links with polished creator-ready controls." }, { icon: BarChart3, title: "Studio analytics", text: "Monitor clicks, conversions, revenue, and campaign lift in one dark workspace." }, { icon: ShieldCheck, title: "Payout clarity", text: "Keep earnings, pending revenue, and approval state visible at all times." }];
export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-ink-950 text-white">
      <Navbar />
      <section className="relative min-h-screen px-5 pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(239,29,47,0.17),transparent_38%,rgba(255,255,255,0.04))]" />
        <div className="absolute right-[-10rem] top-28 h-80 w-80 rounded-full bg-ember-500/20 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl pt-12">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-ember-500/25 bg-ember-500/10 px-4 py-2 text-sm font-semibold text-ember-500"><Sparkles className="h-4 w-4" />Premium creator affiliate suite</div>
            <h1 className="text-5xl font-black leading-[0.98] tracking-normal text-white md:text-7xl lg:text-8xl">Turn Influence Into Income</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62">A cinematic affiliate workspace for creators who want clean links, transparent payouts, and analytics that feel built for the studio.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row"><Link to="/register"><Button className="w-full sm:w-auto">Start Earning<ArrowRight className="h-4 w-4" /></Button></Link><Link to="/login"><Button variant="secondary" className="w-full sm:w-auto">Login</Button></Link></div>
          </motion.div>
          <div id="features" className="grid gap-4 pb-12 md:grid-cols-3">{features.map((feature) => <Card key={feature.title} className="group hover:border-ember-500/30"><feature.icon className="mb-6 h-7 w-7 text-ember-500 transition group-hover:scale-110" /><h3 className="text-xl font-bold">{feature.title}</h3><p className="mt-3 text-sm leading-6 text-white/50">{feature.text}</p></Card>)}</div>
        </div>
      </section>
      <section id="analytics" className="border-y border-white/[0.06] bg-ink-900 px-5 py-24"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div><p className="text-sm font-bold uppercase text-ember-500">Creator command center</p><h2 className="mt-4 text-4xl font-black md:text-5xl">Minimal controls. Serious revenue visibility.</h2><p className="mt-5 text-white/55">The dashboard keeps campaign signal front and center with red-accent analytics, link performance, recent activity, and payout status.</p></div><div className="rounded-[2rem] border border-white/10 bg-black p-4 shadow-glow"><div className="grid gap-3 sm:grid-cols-2">{["Clicks 128K","Revenue $38K","Conversion 9.7%","Pending $7.6K"].map((item) => <div key={item} className="rounded-2xl bg-ink-850 p-5 text-lg font-bold">{item}</div>)}</div><div className="mt-4 h-40 rounded-2xl bg-gradient-to-r from-ember-700/50 via-ember-500/25 to-white/5" /></div></div></section>
      <footer id="footer" className="px-5 py-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-white/45 md:flex-row"><span>InfluenceX Affiliate Studio</span><span>Built for creators, campaigns, and clean revenue operations.</span></div></footer>
    </div>
  );
}
