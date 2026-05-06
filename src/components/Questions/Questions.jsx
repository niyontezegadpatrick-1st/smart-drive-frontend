import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaLightbulb } from 'react-icons/fa';

const Questions = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'all', name: 'All Questions', count: 8 },
    { id: 'signs', name: 'Traffic Signs', count: 2 },
    { id: 'rules', name: 'Rules of Road', count: 2 },
    { id: 'safety', name: 'Safe Driving', count: 2 },
    { id: 'emergency', name: 'Emergency', count: 2 }
  ];

  const questions = [
    {
      id: 1,
      text: "What does a solid yellow line on your side of the road indicate?",
      category: "signs",
      options: ["No passing allowed", "Passing is permitted", "You are in a school zone", "Parking allowed"],
      correct: 0,
      explanation: "A solid yellow line means no passing from your side. You may cross only if turning left.",
      difficulty: "Easy"
    },
    {
      id: 2,
      text: "What is the legal blood alcohol concentration (BAC) limit for drivers over 21 in most states?",
      category: "rules",
      options: ["0.02%", "0.05%", "0.08%", "0.10%"],
      correct: 2,
      explanation: "The legal BAC limit is 0.08% for non-commercial drivers over 21.",
      difficulty: "Medium"
    },
    {
      id: 3,
      text: "What is the recommended following distance in normal weather conditions?",
      category: "safety",
      options: ["1 second", "2 seconds", "3 seconds", "5 seconds"],
      correct: 2,
      explanation: "The 3-second rule provides enough time to react in normal conditions.",
      difficulty: "Easy"
    },
    {
      id: 4,
      text: "What shape is a stop sign?",
      category: "signs",
      options: ["Circle", "Triangle", "Rectangle", "Octagon"],
      correct: 3,
      explanation: "Stop signs are always red octagons for universal recognition.",
      difficulty: "Easy"
    },
    {
      id: 5,
      text: "When approaching a school bus with flashing red lights, you must:",
      category: "rules",
      options: [
        "Slow down and proceed with caution",
        "Stop until the lights stop flashing",
        "Honk to alert children",
        "Pass on the left side"
      ],
      correct: 1,
      explanation: "You must stop and remain stopped until the red lights stop flashing and the bus starts moving.",
      difficulty: "Medium"
    },
    {
      id: 6,
      text: "What does a flashing yellow traffic light mean?",
      category: "signs",
      options: [
        "Stop and wait for green",
        "Proceed with caution",
        "Speed up to clear intersection",
        "Pull over immediately"
      ],
      correct: 1,
      explanation: "A flashing yellow light means proceed with caution and be aware of cross traffic.",
      difficulty: "Easy"
    },
    {
      id: 7,
      text: "What is the first thing you should do in case of a tire blowout?",
      category: "emergency",
      options: [
        "Brake hard immediately",
        "Steer away from traffic",
        "Grip steering wheel firmly and ease off gas",
        "Turn on hazard lights"
      ],
      correct: 2,
      explanation: "Grip the steering wheel firmly, ease off the gas, and coast to a stop. Avoid braking hard.",
      difficulty: "Hard"
    },
    {
      id: 8,
      text: "When driving in fog, you should use:",
      category: "safety",
      options: [
        "High beams",
        "Low beams and fog lights",
        "Parking lights only",
        "Emergency flashers"
      ],
      correct: 1,
      explanation: "Low beams and fog lights reduce glare and improve visibility in fog.",
      difficulty: "Medium"
    }
  ];

  const filteredQuestions = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  const checkAnswer = (questionId, selectedOption) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: selectedOption });
  };

  const showExplanation = (questionId) => {
    setShowExplanations({ ...showExplanations, [questionId]: true });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
    
    // Show result message
    const percentage = (correct / questions.length) * 100;
    if (percentage === 100) {
      alert(`🎉 Perfect Score! You got ${correct}/${questions.length} correct!`);
    } else if (percentage >= 70) {
      alert(`👍 Good job! You got ${correct}/${questions.length} correct. Keep practicing!`);
    } else {
      alert(`📚 You got ${correct}/${questions.length} correct. Review the material and try again!`);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowExplanations({});
    setScore(0);
    setSubmitted(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Practice Exam Questions</h2>
          <p className="text-gray-600 text-lg">Test your knowledge with real driving license exam questions</p>
        </motion.div>

        {/* Categories */}
        <motion.div 
          className="flex justify-center gap-4 mb-8 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </motion.div>

        {/* Progress Bar */}
        {Object.keys(selectedAnswers).length > 0 && (
          <motion.div 
            className="max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-blue-600">
                  {Object.keys(selectedAnswers).length}/{filteredQuestions.length} Answered
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(Object.keys(selectedAnswers).length / filteredQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Questions List */}
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence>
            {filteredQuestions.map((q, index) => (
              <motion.div 
                key={q.id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Question Header */}
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <div className="flex gap-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {q.category.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <span className="text-blue-600 font-bold">Question {q.id}</span>
                </div>
                
                {/* Question Text */}
                <p className="text-lg font-semibold mb-4 text-gray-800">{q.text}</p>
                
                {/* Options */}
                <div className="space-y-3 mb-6">
                  {q.options.map((opt, idx) => (
                    <label 
                      key={idx} 
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedAnswers[q.id] === idx 
                          ? 'bg-blue-50 border-2 border-blue-500' 
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name={`q${q.id}`} 
                        onChange={() => checkAnswer(q.id, idx)}
                        className="w-4 h-4 text-blue-600"
                        disabled={showExplanations[q.id]}
                      />
                      <span className="text-gray-700 flex-1">{opt}</span>
                      {selectedAnswers[q.id] === idx && showExplanations[q.id] && (
                        selectedAnswers[q.id] === q.correct 
                          ? <FaCheckCircle className="text-green-500 text-xl" />
                          : <FaTimesCircle className="text-red-500 text-xl" />
                      )}
                    </label>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  {selectedAnswers[q.id] !== undefined && !showExplanations[q.id] && (
                    <button 
                      onClick={() => showExplanation(q.id)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Check Answer
                    </button>
                  )}
                  {showExplanations[q.id] && (
                    <div className="flex-1 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <FaLightbulb className="text-yellow-500 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-800 mb-1">Explanation:</p>
                          <p className="text-green-700 text-sm">{q.explanation}</p>
                          {selectedAnswers[q.id] === q.correct ? (
                            <p className="text-green-600 text-sm mt-2">✅ Correct! Great job!</p>
                          ) : (
                            <p className="text-red-600 text-sm mt-2">
                              ❌ Incorrect. The correct answer is: {q.options[q.correct]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        {Object.keys(selectedAnswers).length === filteredQuestions.length && !submitted && (
          <motion.div 
            className="max-w-3xl mx-auto mt-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button 
              onClick={calculateScore}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300"
            >
              Submit All Answers
            </button>
          </motion.div>
        )}

        {/* Score Display */}
        {submitted && (
          <motion.div 
            className="max-w-3xl mx-auto mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-2xl font-bold mb-2">Your Score</h3>
            <div className="text-5xl font-bold mb-4">{score}/{questions.length}</div>
            <div className="text-lg mb-4">
              {score === questions.length ? '🎉 Perfect Score! You\'re ready for the real exam! 🎉' :
               score >= questions.length * 0.7 ? '👍 Good job! Keep practicing to achieve perfection!' :
               '📚 Keep studying! Review the material and try again.'}
            </div>
            <button 
              onClick={resetQuiz}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Take Quiz Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Questions;