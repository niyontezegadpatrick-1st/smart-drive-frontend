import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    const result = await signup({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError('Registration failed. Email may already exist.');
  };

  return (
    <div className="min-h-[calc(100vh-400px)] flex items-center justify-center py-16 px-4">
      <motion.div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="text-center mb-8">
          <FaUserPlus className="text-5xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-500">Join SmartDrive and start learning today</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2"><FaUser className="inline mr-2 text-blue-600" /> Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" placeholder="John Doe" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2"><FaEnvelope className="inline mr-2 text-blue-600" /> Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" placeholder="you@example.com" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2"><FaPhone className="inline mr-2 text-blue-600" /> Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" placeholder="078XXXXXXX" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2"><FaLock className="inline mr-2 text-blue-600" /> Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" placeholder="••••••••" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2"><FaLock className="inline mr-2 text-blue-600" /> Confirm Password</label>
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-lg disabled:opacity-60">
            <FaUserPlus className="inline mr-2" />{loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login here</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
