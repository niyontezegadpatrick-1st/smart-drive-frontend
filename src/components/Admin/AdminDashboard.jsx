import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { FaUsers, FaBook, FaClipboardList, FaCheckCircle, FaTimesCircle, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API = 'https://smart-driving-site.onrender.com/api';

const AdminDashboard = () => {
  const { currentUser, token, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [usersRes, coursesRes, enrollRes] = await Promise.all([
          fetch(`${API}/users`, { headers }),
          fetch(`${API}/courses`, { headers }),
          fetch(`${API}/enrollments`, { headers }),
        ]);
        const [usersData, coursesData, enrollData] = await Promise.all([
          usersRes.json(), coursesRes.json(), enrollRes.json()
        ]);
        if (usersRes.ok) setUsers(usersData);
        if (coursesRes.ok) setCourses(coursesData);
        if (enrollRes.ok) setEnrollments(enrollData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token, currentUser]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const stats = [
    { icon: <FaUsers className="text-3xl text-blue-600" />, label: 'Total Users', value: users.length, bg: 'bg-blue-50' },
    { icon: <FaBook className="text-3xl text-green-600" />, label: 'Total Courses', value: courses.length, bg: 'bg-green-50' },
    { icon: <FaClipboardList className="text-3xl text-purple-600" />, label: 'Enrollments', value: enrollments.length, bg: 'bg-purple-50' },
    { icon: <FaCheckCircle className="text-3xl text-orange-600" />, label: 'Completed', value: enrollments.filter(e => e.status === 'completed').length, bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚗</span>
          <div>
            <h1 className="font-bold text-lg">SmartDrive Admin</h1>
            <p className="text-gray-400 text-xs">Control Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">👤 {currentUser?.name}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        <motion.h2 className="text-2xl font-bold mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Admin Dashboard
        </motion.h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <motion.div key={i} className={`${s.bg} rounded-xl p-6 flex items-center gap-4`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              {s.icon}
              <div>
                <p className="text-3xl font-bold text-gray-800">{s.value}</p>
                <p className="text-gray-600 text-sm">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['overview', 'users', 'courses', 'enrollments'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading data...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {activeTab === 'overview' && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4">Recent Enrollments</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-600">Student</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Course</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Stage</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Status</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.slice(0, 10).map((e, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                          <td className="p-3">{e.User?.name || 'N/A'}</td>
                          <td className="p-3">{e.Course?.title || 'N/A'}</td>
                          <td className="p-3">Stage {e.currentStage}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${e.status === 'completed' ? 'bg-green-100 text-green-700' : e.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                              {e.status}
                            </span>
                          </td>
                          <td className="p-3">{e.isPaid ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-gray-400" />}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4">All Users ({users.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-600">ID</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Name</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Email</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Role</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Status</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                          <td className="p-3 text-gray-400">{u.id}</td>
                          <td className="p-3 font-medium">{u.name}</td>
                          <td className="p-3 text-gray-500">{u.email}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3">{u.isActive ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}</td>
                          <td className="p-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4">All Courses ({courses.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((c, i) => (
                    <div key={i} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{c.title}</h4>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Stage {c.stage}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{c.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-green-600">{c.price == 0 ? 'Free' : `$${c.price}`}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'enrollments' && (
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4">All Enrollments ({enrollments.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-600">Student</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Course</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Stage</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Status</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Paid</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Enrolled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map((e, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                          <td className="p-3">{e.User?.name || 'N/A'}</td>
                          <td className="p-3">{e.Course?.title || 'N/A'}</td>
                          <td className="p-3">Stage {e.currentStage}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${e.status === 'completed' ? 'bg-green-100 text-green-700' : e.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                              {e.status}
                            </span>
                          </td>
                          <td className="p-3">{e.isPaid ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-gray-400" />}</td>
                          <td className="p-3 text-gray-500">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
