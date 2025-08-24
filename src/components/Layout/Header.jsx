import { LogOut, MessageCircle } from 'lucide-react';
import { Avatar } from '../UI/Avatar';
import { Button } from '../UI/Button';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">ChatApp</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar src={user.photoURL} alt={user.displayName} />
            <span className="font-medium text-gray-900">{user.displayName}</span>
          </div>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
