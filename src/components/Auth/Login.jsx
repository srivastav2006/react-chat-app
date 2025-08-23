import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '../UI/Button';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ChatApp</h1>
          <p className="text-gray-600">Connect and chat with people around the world</p>
        </div>
        
        <Button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3"
          size="lg"
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
          Continue with Google
        </Button>
      </motion.div>
    </div>
  );
};
