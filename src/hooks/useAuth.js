import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../services/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Create/update user document in Firestore
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          const userData = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastSeen: serverTimestamp(),
            online: true,
            createdAt: userSnap.exists() ? userSnap.data().createdAt : serverTimestamp()
          };

          if (!userSnap.exists()) {
            await setDoc(userRef, userData);
          } else {
            await updateDoc(userRef, {
              online: true,
              lastSeen: serverTimestamp(),
              photoURL: user.photoURL,
              displayName: user.displayName
            });
          }
          
          setUser(user);
        } catch (error) {
          console.error('Error updating user data:', error);
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      console.error('Error signing in:', error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Update user status to offline
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { 
          online: false, 
          lastSeen: serverTimestamp() 
        });
      }
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return { user, loading, signInWithGoogle, logout };
};
