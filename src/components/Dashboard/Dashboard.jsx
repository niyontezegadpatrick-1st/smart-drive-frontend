import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { FaGraduationCap, FaCheckCircle, FaStar, FaBook, FaClock, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API = 'https://smart-driving-site.onrender.com/api';

const Dashboard = () => {
  const { currentUser, token } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollRes, quizRes] = await Promise.all([
          fetch(`${API}/enrollments/my`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/quiz/my/results`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const enrollData = await enrollRes.json();
        const quizData = await quizRes.json();
        if (enrollRes.ok) setEnrollments(enrollData);
        if (quizRes.ok) setQuizResults(quizData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const completedCourses = enrollments.filter(e => e.status === 'completed').length;
  const activeCourses = enrollments.filter(e => e.status === 'active').length;
  const avgScore = quizResults.length > 0 ? Math.round(quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length) : 0;
  const passedQuizzes = quizResults.filter(r => r.passed).length;

  const stats = [
    { icon: <FaGraduationCap className="text-3xl text-blue-600 mb-2" />, label: 'Completed Courses', value: completedCourses },
    { icon: <FaBook className="text-3xl text-blue-600 mb-2" />, label: 'Active Courses', value: activeCourses },
    { icon: <FaCheckCircle className="text-3xl text-blue-600 mb-2" />, label: 'Quizzes Passed', value: passedQuizzes },
    { icon: <FaStar className="text-3xl text-blue-600 mb-2" />, label: 'Average Score', value: `${avgScore}%` },
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-bold mb-2">Welcome back, {currentUser?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-gray-600">Track your progress and continue where you left off</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={i} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              {stat.icon}
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-gray-600 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaBook className="text-blue-600" /> My Enrollments</h3>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You are not enrolled in any courses yet.</p>
                <button onClick={() => navigate('/courses')} className="btn-primary">Browse Courses</button>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((e, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="text-2xl">📚</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{e.Course?.title || 'Course'}</h4>
                      <p className="text-sm text-gray-500">Stage {e.currentStage} of 3 • {e.status}</p>
                      <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(Number(e.currentStage) / 3) * 100}%` }}></div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${e.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {e.isPaid ? 'Paid' : 'Free'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaClock className="text-blue-600" /> Recent Quiz Results</h3>
              {quizResults.length === 0 ? (
                <p className="text-gray-500 text-sm">No quiz results yet. Enroll in a course and take a quiz!</p>
              ) : (
                <div className="space-y-3">
                  {quizResults.slice(0, 5).map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Stage {r.stage} Quiz</p>
                        <p className="text-xs text-gray-500">Score: {r.score}%</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${r.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.passed ? '✓ Pass' : '✗ Fail'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Ready to learn?</h3>
              <p className="text-sm text-blue-100 mb-4">Browse available courses and start your journey</p>
              <button onClick={() => navigate('/courses')} className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors w-full">
                Browse Courses
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
