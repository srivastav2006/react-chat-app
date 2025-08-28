import { LogOut, MessageCircle, Settings, Bell, Users } from 'lucide-react';
import { Avatar } from '../UI/Avatar';
import { Button } from '../UI/Button';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-navy-600 to-navy-700 p-2 rounded-xl shadow-md">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">ChatPro</h1>
            <p className="text-xs text-slate-500">Professional Messaging</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Users className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          
          <div className="h-6 w-px bg-slate-300"></div>
          
          <div className="flex items-center gap-3">
            <Avatar 
              src={user?.photoURL} 
              alt={user?.displayName} 
              size="sm"
              online={true}
            />
            <div className="hidden md:block">
              <p className="font-medium text-slate-900 text-sm">{user?.displayName}</p>
              <p className="text-xs text-slate-500 truncate max-w-32">{user?.email}</p>
            </div>
            <Button variant="ghost" onClick={logout} size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
