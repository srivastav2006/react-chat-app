import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  where,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export const sendMessage = async (chatId, senderId, text, senderName) => {
  try {
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text,
      senderId,
      senderName,
      timestamp: new Date(),
      read: false
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export const subscribeToMessages = (chatId, callback) => {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
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
