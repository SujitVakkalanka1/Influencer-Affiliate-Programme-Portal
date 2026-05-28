import { Link, NavLink } from "react-router-dom";
import { BarChart3, CreditCard, Home, LayoutDashboard, Link2, Megaphone, Search, Settings, Shield, Users } from "lucide-react";
import Logo from "./Logo.jsx";
const influencerItems = [{ label: "Overview", icon: LayoutDashboard, to: "/dashboard" }, { label: "Links", icon: Link2, to: "/dashboard" }, { label: "Analytics", icon: BarChart3, to: "/dashboard" }, { label: "Payouts", icon: CreditCard, to: "/dashboard" }, { label: "Settings", icon: Settings, to: "/dashboard" }];
const adminItems = [{ label: "Admin", icon: Shield, to: "/admin" }, { label: "Users", icon: Users, to: "/admin" }, { label: "Campaigns", icon: Megaphone, to: "/admin" }, { label: "Payouts", icon: CreditCard, to: "/admin" }, { label: "Home", icon: Home, to: "/" }];
export default function Sidebar({ admin = false }) {
  const items = admin ? adminItems : influencerItems;
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/[0.06] bg-ink-950/95 px-5 py-6 lg:block"><Link to="/" className="mb-9 block"><Logo /></Link><div className="mb-7 flex items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-white/45"><Search className="h-4 w-4" /><span className="text-sm">Search creator data</span></div><nav className="space-y-2">{items.map((item) => <NavLink key={item.label} to={item.to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-ember-500/12 text-white" : "text-white/52 hover:bg-white/[0.05] hover:text-white"}`}><item.icon className="h-5 w-5" />{item.label}</NavLink>)}</nav></aside>;
}
