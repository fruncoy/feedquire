import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export function Logo({ className = 'w-10 h-10 object-contain' }: { className?: string }) {
  return (
    <Link to="/" className="flex items-center hover:opacity-80 transition">
      <img src={logo} alt="Feedquire" className={className} />
    </Link>
  );
}
