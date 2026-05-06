import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center py-16 px-4">
      <motion.div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="text-center mb-8">
          <FaSignInAlt className="text-5xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-500">Login to access your dashboard and continue learning</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2"><FaEnvelope className="inline mr-2 text-blue-600" /> Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors" placeholder="Enter your email" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2"><FaLock className="inline mr-2 text-blue-600" /> Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors" placeholder="Enter your password" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-lg disabled:opacity-60">
            <FaSignInAlt className="inline mr-2" />{loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600">Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Sign up here</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
