import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

export function Logo({ className = 'w-10 h-10 object-contain' }: { className?: string }) {
  const { user } = useAuth();
  
  return (
    <Link to={user ? "/dashboard" : "/"} className="flex items-center hover:opacity-80 transition">
      <img src={logo} alt="Feedquire" className={className} />
    </Link>
  );
}
