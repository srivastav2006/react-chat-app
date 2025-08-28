import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Avatar } from '../UI/Avatar';
import { Button } from '../UI/Button';
import { useChat } from '../../hooks/useChat';
import { Phone, Video, MoreVertical, MessageCircle } from 'lucide-react';

export const ChatRoom = ({ selectedUser, chatId, onStartAudioCall, onStartVideoCall }) => {
  const { messages, loading } = useChat(chatId);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="bg-navy-100 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-navy-600" />
          </div>
          <h3 className="text-xl font-medium text-slate-900 mb-2">No chat selected</h3>
          <p className="text-slate-500">Search for users to start a conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={selectedUser.photoURL}
              alt={selectedUser.displayName}
              online={selectedUser.online}
              size="md"
            />
            <div>
              <h3 className="font-medium text-slate-900">{selectedUser.displayName}</h3>
              <p className="text-sm text-slate-500">
                {selectedUser.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onStartAudioCall && onStartAudioCall(selectedUser)}>
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onStartVideoCall && onStartVideoCall(selectedUser)}>
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-navy-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-600">Loading messages...</p>
          </div>
        </div>
      ) : (
        <MessageList messages={messages} selectedUser={selectedUser} />
      )}
      
      {/* Message Input */}
      <MessageInput chatId={chatId} recipientName={selectedUser.displayName} />
    </div>
  );
};
