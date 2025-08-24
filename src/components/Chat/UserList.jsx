import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
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
    const users = await searchUsers(searchTerm);
    setSearchResults(users.filter(u => u.uid !== user.uid));
    setLoading(false);
  };

  const handleUserSelect = (selectedUser) => {
    const chatId = createChatId(user.uid, selectedUser.uid);
    onUserSelect(selectedUser, chatId);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading} size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {searchResults.map((searchUser) => (
          <div
            key={searchUser.uid}
            onClick={() => handleUserSelect(searchUser)}
            className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
              selectedUserId === searchUser.uid ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={searchUser.photoURL}
                alt={searchUser.displayName}
                online={searchUser.online}
              />
              <div>
                <h3 className="font-medium text-gray-900">{searchUser.displayName}</h3>
                <p className="text-sm text-gray-500">{searchUser.email}</p>
              </div>
            </div>
          </div>
        ))}
        
        {searchResults.length === 0 && searchTerm && !loading && (
          <div className="p-4 text-center text-gray-500">
            No users found for "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};
