import { Link } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../components/layout/Logo.jsx";
import Button from "../components/ui/Button.jsx";
export default function AuthPage({ mode = "login" }) {
  const isRegister = mode === "register";
  return <main className="grid min-h-screen place-items-center bg-ink-950 px-5 py-12"><div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-ember-500/18 blur-3xl" /><motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} className="glass relative w-full max-w-md rounded-[2rem] p-8 shadow-glow"><Link to="/" className="mb-10 block"><Logo /></Link><h1 className="text-3xl font-black">{isRegister ? "Create your studio" : "Welcome back"}</h1><p className="mt-2 text-sm text-white/50">{isRegister ? "Start tracking creator revenue with a clean affiliate workspace." : "Sign in to manage campaigns, links, payouts, and analytics."}</p><form className="mt-8 space-y-4">{isRegister && <Field icon={User} placeholder="Creator name" />}<Field icon={Mail} placeholder="Email address" type="email" /><Field icon={Lock} placeholder="Password" type="password" /><Button className="w-full">{isRegister ? "Create account" : "Login"}</Button></form><p className="mt-6 text-center text-sm text-white/45">{isRegister ? "Already earning here?" : "New to InfluenceX?"} <Link className="font-semibold text-ember-500 hover:text-white" to={isRegister ? "/login" : "/register"}>{isRegister ? "Login" : "Register"}</Link></p></motion.div></main>;
}
function Field({ icon: Icon, ...props }) {
  return <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white/55 transition focus-within:border-ember-500 focus-within:shadow-glow"><Icon className="h-5 w-5" /><input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35" {...props} /></label>;
}
