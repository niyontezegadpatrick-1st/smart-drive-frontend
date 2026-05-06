import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBookOpen, FaQuestionCircle, FaChartLine, FaArrowRight, FaShieldAlt, FaTrophy, FaCar } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaBookOpen className="text-5xl text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Comprehensive Courses',
      description: 'From traffic signs to defensive driving techniques. 3 structured stages of learning.',
    },
    {
      icon: <FaQuestionCircle className="text-5xl text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Stage-based Quizzes',
      description: 'Test your knowledge after each stage. Score 70% or more to advance to the next level.',
    },
    {
      icon: <FaChartLine className="text-5xl text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300" />,
      title: 'Progress Tracking',
      description: 'Interactive dashboard to monitor your improvement and track completed stages.',
    }
  ];

  const stats = [
    { icon: <FaCar className="text-3xl text-blue-400" />, value: '3', label: 'Learning Stages' },
    { icon: <FaShieldAlt className="text-3xl text-blue-400" />, value: '70%', label: 'Pass Score Required' },
    { icon: <FaTrophy className="text-3xl text-blue-400" />, value: '100%', label: 'Online Access' },
    { icon: <FaBookOpen className="text-3xl text-blue-400" />, value: '24/7', label: 'Learn Anytime' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%)'}}></div>
        </div>
        <div className="container-custom relative z-10 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 tracking-widest uppercase">
                Rwanda's #1 Driving Platform
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Master the Road with <span className="text-blue-400">Smart Driving</span>
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Interactive traffic courses, real exam questions, and personalized dashboard to track your progress.
                Get your license with confidence!
              </p>
              <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Start Learning <FaArrowRight />
                </button>
                <button
                  onClick={() => navigate('/courses')}
                  className="border-2 border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:-translate-y-0.5"
                >
                  View Courses
                </button>
              </div>
            </motion.div>

            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Animated card instead of broken image */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl">🚗</div>
                  <div>
                    <p className="font-bold text-white">SmartDrive Learning</p>
                    <p className="text-gray-400 text-sm">3-Stage System</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { stage: 'Stage 1', title: 'Traffic Rules Basics', done: true },
                    { stage: 'Stage 2', title: 'Road Safety Fundamentals', done: false, active: true },
                    { stage: 'Stage 3', title: 'Vehicle Control', done: false },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-4 p-3 rounded-xl ${item.active ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-slate-700/50'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${item.done ? 'bg-green-500' : item.active ? 'bg-blue-500' : 'bg-slate-600'}`}>
                        {item.done ? '✓' : i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{item.title}</p>
                        <p className="text-gray-400 text-xs">{item.stage}</p>
                      </div>
                      {item.done && <span className="text-green-400 text-xs font-semibold">Completed</span>}
                      {item.active && <span className="text-blue-400 text-xs font-semibold">In Progress</span>}
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-slate-700/50 rounded-xl p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-blue-400 font-semibold">33%</span>
                  </div>
                  <div className="bg-slate-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '33%'}}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-t border-slate-700">
          <div className="container-custom py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div key={i} className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4">Why Choose <span className="text-blue-600">Smart Driving</span></h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">We provide everything you need to pass your driving test on the first try</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {feature.icon}
                <h4 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Your Driver's License?</h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of successful students who passed their driving test with Smart Driving
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-lg"
            >
              Get Started Today 🚗
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;