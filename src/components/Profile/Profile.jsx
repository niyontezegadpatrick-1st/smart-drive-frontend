import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { FaUserCircle, FaCalendarAlt, FaGraduationCap, FaCheckCircle, FaStar, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Profile = () => {
  const { currentUser, logout, updateProgress } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentUser?.fullname || '');
  const [editedPhone, setEditedPhone] = useState(currentUser?.phone || '');

  const handleSaveProfile = () => {
    // Update user info in localStorage
    const users = JSON.parse(localStorage.getItem('smartDrivingUsers') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].fullname = editedName;
      users[userIndex].phone = editedPhone;
      localStorage.setItem('smartDrivingUsers', JSON.stringify(users));
      
      const updatedUser = { ...currentUser, fullname: editedName, phone: editedPhone };
      localStorage.setItem('smartDrivingUser', JSON.stringify(updatedUser));
      
      // Update context
      window.location.reload(); // Simple refresh to update context
    }
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const stats = [
    { icon: <FaGraduationCap className="text-3xl" />, label: 'Courses Completed', value: `${currentUser?.progress?.coursesCompleted || 0}%`, color: 'from-blue-500 to-blue-600' },
    { icon: <FaCheckCircle className="text-3xl" />, label: 'Questions Solved', value: `${currentUser?.progress?.questionsSolved || 0}/200`, color: 'from-green-500 to-green-600' },
    { icon: <FaStar className="text-3xl" />, label: 'Average Score', value: `${currentUser?.progress?.averageScore || 0}%`, color: 'from-yellow-500 to-yellow-600' }
  ];

  const recentActivity = [
    { action: 'Completed Module: Traffic Signs', date: '2 days ago', type: 'success' },
    { action: 'Scored 85% on Practice Test', date: '3 days ago', type: 'info' },
    { action: 'Started Course: Defensive Driving', date: '5 days ago', type: 'warning' },
    { action: 'Earned "Quick Learner" Badge', date: '1 week ago', type: 'success' }
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <FaUserCircle className="text-6xl text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-2xl font-bold bg-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 w-full"
                        placeholder="Full Name"
                      />
                      <input
                        type="tel"
                        value={editedPhone}
                        onChange={(e) => setEditedPhone(e.target.value)}
                        className="text-lg bg-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 w-full"
                        placeholder="Phone Number"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold mb-1">{currentUser?.fullname}</h3>
                      <p className="text-blue-100 mb-2">{currentUser?.email}</p>
                      <p className="text-blue-100 text-sm flex items-center gap-2 justify-center md:justify-start">
                        <FaCalendarAlt /> Member since: {new Date(currentUser?.createdAt).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={handleSaveProfile} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
                        <FaSave /> Save
                      </button>
                      <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors">
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/30 transition-colors">
                      <FaEdit /> Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className={`bg-gradient-to-r ${stat.color} rounded-xl p-6 text-white shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  {stat.icon}
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-white/90">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-gray-700">{activity.action}</span>
                  </div>
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certificate Section */}
          <motion.div 
            className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-bold mb-2">🎓 Ready for Your Certificate?</h3>
            <p className="mb-4">Complete all courses and pass the final exam to earn your certificate</p>
            <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              View Requirements
            </button>
          </motion.div>

          {/* Logout Button */}
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button 
              onClick={logout}
              className="bg-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-lg"
            >
              Logout
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;