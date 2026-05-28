import { Link } from 'react-router-dom';
import Logo from './Logo';
import Button from './Button';

export default function Navbar({ links = [] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button as="link" to="/login" variant="ghost">
            Login
          </Button>
          <Button as="link" to="/register">
            Start Earning
          </Button>
        </div>
      </div>
    </header>
  );
}
