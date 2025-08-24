import { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { sendMessage } from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';

export const MessageInput = ({ chatId, recipientName }) => {
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const handleSend = async () => {
    if (!message.trim() || !chatId) return;

    await sendMessage(chatId, user.uid, message.trim(), user.displayName);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex gap-2">
        <Input
          placeholder={`Message ${recipientName}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!message.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
