import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Avatar } from '../UI/Avatar';
import { useChat } from '../../hooks/useChat';

export const ChatRoom = ({ selectedUser, chatId }) => {
  const { messages, loading } = useChat(chatId);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No chat selected</h3>
          <p className="text-gray-500">Search for users to start a conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <Avatar
            src={selectedUser.photoURL}
            alt={selectedUser.displayName}
            online={selectedUser.online}
          />
          <div>
            <h3 className="font-medium text-gray-900">{selectedUser.displayName}</h3>
            <p className="text-sm text-gray-500">
              {selectedUser.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <MessageList messages={messages} />
      )}
      
      <MessageInput chatId={chatId} recipientName={selectedUser.displayName} />
    </div>
  );
};
