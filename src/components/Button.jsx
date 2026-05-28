import { Link } from 'react-router-dom';

const styles = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white',
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
