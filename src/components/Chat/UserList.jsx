import { useState, useEffect } from 'react';
import { Search, Plus, Users, UserPlus } from 'lucide-react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Avatar } from '../UI/Avatar';
import { searchUsers, createChatId } from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';

export const UserList = ({ onUserSelect, selectedUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const users = await searchUsers(searchTerm);
      setSearchResults(users.filter(u => u.uid !== user.uid));
    } catch (error) {
      console.error('Error searching users:', error);
    }
    setLoading(false);
  };

  const handleUserSelect = (selectedUser) => {
    const chatId = createChatId(user.uid, selectedUser.uid);
    onUserSelect(selectedUser, chatId);
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      const debounceTimer = setTimeout(handleSearch, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
          <Button variant="ghost" size="sm" className="text-navy-600">
            <UserPlus className="w-4 h-4" />
          </Button>
        </div>
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          icon={<Search className="w-4 h-4" />}
          className="bg-white shadow-sm"
        />
      </div>
      
      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-navy-600 border-t-transparent"></div>
          </div>
        )}

        {searchResults.map((searchUser) => (
          <div
            key={searchUser.uid}
            onClick={() => handleUserSelect(searchUser)}
            className={`p-4 cursor-pointer hover:bg-slate-50 border-b border-slate-100 transition-all duration-200 animate-fade-in ${
              selectedUserId === searchUser.uid 
                ? 'bg-navy-50 border-l-4 border-l-navy-600 shadow-sm' 
                : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={searchUser.photoURL}
                alt={searchUser.displayName}
                online={searchUser.online}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 truncate">
                  {searchUser.displayName}
                </h3>
                <p className="text-sm text-slate-500 truncate">{searchUser.email}</p>
                {searchUser.online && (
                  <p className="text-xs text-green-600 font-medium">Online</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {searchResults.length === 0 && searchTerm && !loading && (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">No users found</p>
            <p className="text-slate-400 text-sm">Try searching with a different name</p>
          </div>
        )}

        {!searchTerm && (
          <div className="p-8 text-center">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Search for users</p>
            <p className="text-slate-400 text-sm">Start typing to find people to chat with</p>
          </div>
        )}
      </div>
    </div>
  );
};
