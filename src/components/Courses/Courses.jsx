import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaBook, FaCheckCircle, FaCreditCard } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API = 'https://smart-driving-site.onrender.com/api';

const Courses = () => {
  const { token, currentUser } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [msg, setMsg] = useState('');
  const [paymentModal, setPaymentModal] = useState(null);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [paying, setPaying] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API}/courses`);
        const data = await res.json();
        if (res.ok) setCourses(data);
        if (token) {
          const eRes = await fetch(`${API}/enrollments/my`, { headers: { Authorization: `Bearer ${token}` } });
          const eData = await eRes.json();
          if (eRes.ok) setEnrollments(eData);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchCourses();
  }, [token]);

  const isEnrolled = (courseId) => enrollments.find(e => e.courseId === courseId);

  const handleEnroll = async (course) => {
    if (!currentUser) return setMsg('Please login to enroll');

    if (course.price > 0) {
      setPaymentModal(course);
      try {
        const res = await fetch(`${API}/payments/create-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ courseId: course.id }),
        });
        const data = await res.json();
        if (res.ok) setPaymentIntentId(data.paymentIntentId);
        else setMsg(data.error || 'Failed to initialize payment');
      } catch (err) { setMsg('Payment initialization failed'); }
      return;
    }

    setEnrolling(course.id);
    try {
      const res = await fetch(`${API}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId: course.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnrollments([...enrollments, data.enrollment]);
        setMsg('Enrolled successfully! ✅');
      } else {
        setMsg(data.error || 'Enrollment failed');
      }
    } catch (err) { setMsg('Error enrolling'); }
    finally { setEnrolling(null); setTimeout(() => setMsg(''), 3000); }
  };

  const handlePayment = async () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
      return setMsg('Please fill in all card details');
    }
    setPaying(true);
    try {
      const confirmRes = await fetch(`${API}/payments/test-confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentIntentId }),
      });
      const confirmData = await confirmRes.json();

      if (!confirmRes.ok || confirmData.status !== 'succeeded') {
        setMsg('Payment failed. Please try again.');
        setPaying(false);
        return;
      }

      const enrollRes = await fetch(`${API}/payments/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentIntentId, courseId: paymentModal.id }),
      });
      const enrollData = await enrollRes.json();

      if (enrollRes.ok) {
        setEnrollments([...enrollments, enrollData.enrollment]);
        setMsg('Payment successful! You are now enrolled ✅');
        setPaymentModal(null);
        setCardDetails({ number: '', expiry: '', cvv: '' });
        setPaymentIntentId(null);
      } else {
        setMsg(enrollData.error || 'Enrollment after payment failed');
      }
    } catch (err) {
      setMsg('Payment error. Try again.');
    }
    finally { setPaying(false); setTimeout(() => setMsg(''), 4000); }
  };

  const stageColors = { '1': 'bg-blue-100 text-blue-700', '2': 'bg-purple-100 text-purple-700', '3': 'bg-orange-100 text-orange-700' };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl font-bold mb-4">Available Courses</h2>
          <p className="text-gray-600 text-lg">Master driving rules through our 3-stage learning system</p>
        </motion.div>

        {msg && (
          <div className={`mb-6 p-4 rounded-xl text-center font-semibold ${msg.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {msg}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading courses...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => {
              const enrolled = isEnrolled(course.id);
              return (
                <motion.div key={course.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <FaBook className="text-3xl opacity-80" />
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${stageColors[course.stage] || 'bg-gray-100 text-gray-700'}`}>
                        Stage {course.stage}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{course.title}</h3>
                    <p className="text-blue-100 text-xs mt-1">Click to view content →</p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 text-sm">{course.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-lg text-green-600">{course.price == 0 ? 'Free' : `$${course.price}`}</span>
                      <span className="text-xs text-gray-500 capitalize">{course.category?.replace('_', ' ')}</span>
                    </div>
                    {enrolled ? (
                      <div
                        className="flex items-center gap-2 justify-center py-2 bg-green-50 rounded-xl text-green-700 font-semibold text-sm cursor-pointer hover:bg-green-100"
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        <FaCheckCircle /> Enrolled — Stage {enrolled.currentStage} — Continue →
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course)}
                        disabled={enrolling === course.id || !currentUser}
                        className="btn-primary w-full py-2 text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {enrolling === course.id ? 'Enrolling...' :
                          !currentUser ? 'Login to Enroll' :
                          course.price > 0 ? <><FaCreditCard /> Pay & Enroll</> : 'Enroll Now'}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentModal && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Complete Payment</h3>
                <button onClick={() => setPaymentModal(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="font-semibold text-gray-800">{paymentModal.title}</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">${paymentModal.price}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input type="text" placeholder="4242 4242 4242 4242" maxLength={19} value={cardDetails.number} onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" maxLength={5} value={cardDetails.expiry} onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input type="text" placeholder="123" maxLength={3} value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-4 text-center">
                🔒 Test mode — use card: 4242 4242 4242 4242 | 12/28 | 123
              </p>

              <button onClick={handlePayment} disabled={paying || !paymentIntentId} className="btn-primary w-full py-3 text-base disabled:opacity-60 flex items-center justify-center gap-2">
                <FaCreditCard />
                {paying ? 'Processing payment...' : `Pay $${paymentModal.price}`}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Courses;