import { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { signInWithPopup, googleProvider } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

const FirebaseTest = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log('Signed in successfully!');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const testFirestore = async () => {
    try {
      await addDoc(collection(db, 'test'), {
        message: 'Hello Firebase!',
        timestamp: new Date()
      });
      console.log('Firestore test successful!');
    } catch (error) {
      console.error('Firestore test error:', error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Firebase Test</h2>
      
      {user ? (
        <div>
          <p className="mb-4">Signed in as: {user.displayName}</p>
          <button 
            onClick={testFirestore}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Test Firestore
          </button>
        </div>
      ) : (
        <button 
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In with Google
        </button>
      )}
    </div>
  );
};

export default FirebaseTest;
