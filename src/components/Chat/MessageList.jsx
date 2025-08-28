import { useEffect, useRef } from 'react';
import { Avatar } from '../UI/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { formatTime } from '../../utils/helper';

export const MessageList = ({ messages, selectedUser }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Avatar 
            src={selectedUser?.photoURL} 
            alt={selectedUser?.displayName} 
            size="xl" 
            className="mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Start a conversation with {selectedUser?.displayName}
          </h3>
          <p className="text-slate-500">Send a message to get the conversation started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
      {messages.map((message, index) => {
        const isOwnMessage = user && message.senderId === user.uid;
        const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
        
        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} message-bubble`}
          >
            <div className={`flex gap-3 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
              {!isOwnMessage && showAvatar && (
                <Avatar 
                  src={selectedUser?.photoURL} 
                  alt={message.senderName} 
                  size="sm" 
                  className="flex-shrink-0"
                />
              )}
              {!isOwnMessage && !showAvatar && (
                <div className="w-8"></div>
              )}
              
              <div
                className={`rounded-2xl px-4 py-2 shadow-sm ${
                  isOwnMessage
                    ? 'bg-navy-600 text-white rounded-br-md'
                    : 'bg-white text-slate-900 rounded-bl-md border border-slate-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  isOwnMessage ? 'text-navy-100' : 'text-slate-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
