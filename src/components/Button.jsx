import { Link } from 'react-router-dom';

const styles = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white',
};

export default function Button({ as = 'button', to, href, className = '', variant = 'primary', children, ...props }) {
  const baseClass = `${styles[variant] || styles.primary} ${className}`;

  if (as === 'link' && to) {
    return (
      <Link className={baseClass} to={to} {...props}>
        {children}
      </Link>
    );
  }

  if (as === 'a' && href) {
    return (
      <a className={baseClass} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={baseClass} type={props.type || 'button'} {...props}>
      {children}
    </button>
  );
}
