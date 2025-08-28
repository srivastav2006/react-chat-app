import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Shield, Users, Zap, AlertCircle } from 'lucide-react';
import { Button } from '../UI/Button';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Real-time Messaging",
      description: "Chat instantly with colleagues and friends worldwide"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your conversations are protected with enterprise-grade security"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with your team members"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Experience blazing fast message delivery and notifications"
    }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <div className="min-h-screen flex">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">ChatPro</h1>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Professional Chat Platform
              </h2>
              <p className="text-slate-300 text-lg mb-12">
                Connect, collaborate, and communicate with your team in a secure, 
                professional environment designed for modern workplaces.
              </p>
            </div>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div className="bg-navy-500 p-2 rounded-lg text-white flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md backdrop-blur-sm"
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-navy-600 to-navy-700 p-4 rounded-2xl shadow-lg">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-600">Sign in to continue to your workspace</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}
            
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              loading={loading}
              className="w-full bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-lg"
              size="lg"
            >
              {!loading && (
                <img 
                  src="https://developers.google.com/identity/images/g-logo.png" 
                  alt="Google" 
                  className="w-5 h-5" 
                />
              )}
              Continue with Google
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-navy-600 hover:text-navy-700 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-navy-600 hover:text-navy-700 font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Mobile Features */}
            <div className="lg:hidden mt-8 pt-6 border-t border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Why choose ChatPro?</h3>
              <div className="space-y-2">
                {features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="text-navy-600">
                      {feature.icon}
                    </div>
                    <span className="text-sm text-slate-600">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
