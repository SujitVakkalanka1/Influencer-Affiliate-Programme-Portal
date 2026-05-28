import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import Logo from "./Logo.jsx";
import Button from "../ui/Button.jsx";
export default function Navbar() {
  return <header className="fixed inset-x-0 top-0 z-30 border-b border-white/[0.06] bg-black/55 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><Link to="/"><Logo /></Link><nav className="hidden items-center gap-7 text-sm font-medium text-white/60 md:flex"><a href="#features" className="transition hover:text-white">Features</a><a href="#analytics" className="transition hover:text-white">Analytics</a><a href="#footer" className="transition hover:text-white">Contact</a></nav><Link to="/login"><Button variant="secondary" className="px-4 py-2"><LogIn className="h-4 w-4" />Login</Button></Link></div></header>;
}
