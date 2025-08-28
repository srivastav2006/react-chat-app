import { useState } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { sendMessage } from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';

export const MessageInput = ({ chatId, recipientName }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

  const handleSend = async () => {
    if (!message.trim() || !chatId || sending) return;
    
    setSending(true);
    try {
      await sendMessage(
        chatId, 
        user.uid, 
        message.trim(), 
        user.displayName,
        user.photoURL
      );
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-slate-200 bg-white">
      <div className="flex gap-3 items-end">
        <Button variant="ghost" size="sm" className="text-slate-500">
          <Paperclip className="w-4 h-4" />
        </Button>
        
        <div className="flex-1">
          <Input
            placeholder={`Message ${recipientName}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="resize-none border-slate-300 focus:border-navy-500"
            disabled={sending}
          />
        </div>
        
        <Button variant="ghost" size="sm" className="text-slate-500">
          <Smile className="w-4 h-4" />
        </Button>
        
        <Button 
          onClick={handleSend} 
          disabled={!message.trim() || sending}
          loading={sending}
          size="sm"
          className="bg-navy-600 hover:bg-navy-700 shadow-lg"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
