import React from 'react';
import { User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface UserAvatarProps {
  user: User | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, className = "", size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[12px]',
    md: 'w-10 h-10 text-[16px]',
    lg: 'w-12 h-12 text-[18px]',
  };

  const getInitials = () => {
    if (!user) return '?';
    const name = user.displayName || user.email || '';
    if (!name) return '?';
    
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  };

  const [imgError, setImgError] = React.useState(false);
  const initials = getInitials();
  const hasValidPhoto = user?.photoURL && !imgError;

  React.useEffect(() => {
    setImgError(false);
  }, [user?.photoURL]);

  return (
    <div className={`rounded-full border border-white/10 overflow-hidden bg-luxury-gray flex items-center justify-center transition-all group-hover:border-neon/50 group-hover:shadow-[0_0_20px_rgba(204,255,0,0.2)] ${sizeClasses[size]} ${className}`}>
      {hasValidPhoto ? (
        <img 
          src={user.photoURL!} 
          alt={user.displayName || 'User'} 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer" 
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-white/10 to-transparent font-black text-neon uppercase tracking-tighter antialiased">
          {initials}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
