import { useState, useEffect } from 'react';
import { subscribeToMessages } from '../services/chatService';

export const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToMessages(chatId, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(newMessages);
      setLoading(false);
    });

    return unsubscribe;
  }, [chatId]);

  return { messages, loading };
};
