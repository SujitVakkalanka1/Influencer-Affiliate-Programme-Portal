export default function Card({ className = '', children }) {
  return <div className={`neo-card ${className}`}>{children}</div>;
}
