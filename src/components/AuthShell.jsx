import Logo from './Logo';

export default function AuthShell({ eyebrow, title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col justify-center">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="mb-6 text-center">
          <p className="section-label">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>

        {children}
      </div>
    </main>
  );
}
