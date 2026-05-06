import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { FaBook, FaCheckCircle, FaArrowLeft, FaLock, FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';

const API = 'https://smart-driving-site.onrender.com/api';

const CourseDetail = () => {
  const { id } = useParams();
  const { token, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API}/courses/${id}`);
        const data = await res.json();
        if (res.ok) setCourse(data);
        if (token) {
          const eRes = await fetch(`${API}/enrollments/my`, { headers: { Authorization: `Bearer ${token}` } });
          const eData = await eRes.json();
          if (eRes.ok) {
            const found = eData.find(e => e.courseId === Number(id));
            setEnrollment(found || null);
          }
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, token]);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`${API}/quiz/${id}/stage/${enrollment.currentStage}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setQuiz(data.questions);
        setShowQuiz(true);
      } else {
        alert(data.error || 'No quiz available for this stage');
      }
    } catch (err) { console.error(err); }
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < quiz.length) {
      return alert('Please answer all questions before submitting');
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/quiz/${id}/stage/${enrollment.currentStage}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuizResult(data);
        setShowQuiz(false);
        if (data.passed) {
          const eRes = await fetch(`${API}/enrollments/my`, { headers: { Authorization: `Bearer ${token}` } });
          const eData = await eRes.json();
          if (eRes.ok) {
            const found = eData.find(e => e.courseId === Number(id));
            setEnrollment(found || null);
          }
        }
      }
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading course...</div>;
  if (!course) return <div className="text-center py-20 text-red-500">Course not found</div>;

  const isEnrolled = !!enrollment;
  const isPaid = enrollment?.isPaid;

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom max-w-4xl">
        <button onClick={() => navigate('/courses')} className="flex items-center gap-2 text-blue-600 hover:underline mb-6">
          <FaArrowLeft /> Back to Courses
        </button>

        <motion.div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <FaBook className="text-4xl opacity-80" />
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">Stage {course.stage}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-blue-100">{course.description}</p>
          </div>

          <div className="p-8">
            {!currentUser ? (
              <div className="text-center py-8">
                <FaLock className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Please login to access course content</p>
                <button onClick={() => navigate('/login')} className="btn-primary">Login</button>
              </div>
            ) : !isEnrolled ? (
              <div className="text-center py-8">
                <FaLock className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">You need to enroll in this course to access its content</p>
                <button onClick={() => navigate('/courses')} className="btn-primary">Go Enroll</button>
              </div>
            ) : !isPaid ? (
              <div className="text-center py-8">
                <FaLock className="text-5xl text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Please complete payment to access this course</p>
                <button onClick={() => navigate('/courses')} className="btn-primary">Complete Payment</button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FaBook className="text-blue-600" /> Course Content
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                      {course.content}
                    </pre>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">Your Progress</p>
                    <p className="text-sm text-gray-500">Currently on Stage {enrollment.currentStage} of 3</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map(s => (
                      <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${Number(enrollment.currentStage) > s ? 'bg-green-500 text-white' : Number(enrollment.currentStage) === s ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {Number(enrollment.currentStage) > s ? '✓' : s}
                      </div>
                    ))}
                  </div>
                </div>

                {quizResult && (
                  <motion.div className={`rounded-xl p-6 mb-6 ${quizResult.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <h3 className={`text-xl font-bold mb-2 ${quizResult.passed ? 'text-green-700' : 'text-red-700'}`}>
                      {quizResult.passed ? '🎉 You Passed!' : '❌ You Failed'}
                    </h3>
                    <p className="text-gray-700">Score: <strong>{quizResult.score}%</strong> ({quizResult.correct}/{quizResult.total} correct)</p>
                    {!quizResult.passed && <p className="text-red-600 text-sm mt-2">You need 70% to pass. Please review the content and try again.</p>}
                    {quizResult.passed && enrollment.status === 'completed' && <p className="text-green-600 font-bold mt-2">🏆 Congratulations! You completed the entire course!</p>}
                    <button onClick={() => setQuizResult(null)} className="mt-3 text-sm text-blue-600 hover:underline">Dismiss</button>
                  </motion.div>
                )}

                {!showQuiz && enrollment.status !== 'completed' && (
                  <button onClick={fetchQuiz} className="btn-primary flex items-center gap-2 px-6 py-3">
                    <FaClipboardList /> Take Stage {enrollment.currentStage} Quiz
                  </button>
                )}

                {enrollment.status === 'completed' && (
                  <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                    <FaCheckCircle /> Course Completed! 🏆
                  </div>
                )}

                {showQuiz && (
                  <motion.div className="mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <FaClipboardList className="text-blue-600" /> Stage {enrollment.currentStage} Quiz
                    </h2>
                    <div className="space-y-6">
                      {quiz.map((q, i) => (
                        <div key={q.id} className="bg-gray-50 rounded-xl p-5">
                          <p className="font-semibold text-gray-800 mb-4">{i + 1}. {q.question}</p>
                          <div className="space-y-2">
                            {['A', 'B', 'C', 'D'].map(opt => (
                              <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${answers[q.id] === opt ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border-2 border-gray-200 hover:border-blue-300'}`}>
                                <input type="radio" name={`q${q.id}`} value={opt} checked={answers[q.id] === opt} onChange={() => setAnswers({ ...answers, [q.id]: opt })} className="hidden" />
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${answers[q.id] === opt ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{opt}</span>
                                <span className="text-gray-700">{q[`option${opt}`]}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button onClick={handleSubmitQuiz} disabled={submitting} className="btn-primary px-8 py-3 disabled:opacity-60">
                        {submitting ? 'Submitting...' : 'Submit Quiz'}
                      </button>
                      <button onClick={() => setShowQuiz(false)} className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50">
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetail;