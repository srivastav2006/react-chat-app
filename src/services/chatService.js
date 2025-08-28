import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  where,
  getDocs,
  doc,
  getDoc,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

export const sendMessage = async (chatId, senderId, text, senderName, senderPhoto) => {
  try {
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text,
      senderId,
      senderName,
      senderPhoto,
      timestamp: serverTimestamp(),
      read: false
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const subscribeToMessages = (chatId, callback) => {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc'),
    limit(100)
  );
  return onSnapshot(q, callback);
};

export const searchUsers = async (searchTerm) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

export const createChatId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_');
};

export const formatTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  // Less than a minute
  if (diff < 60000) {
    return 'Just now';
  }
  
  // Less than an hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than a day
  if (diff < 86400000) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // More than a day
  return date.toLocaleDateString();
};
