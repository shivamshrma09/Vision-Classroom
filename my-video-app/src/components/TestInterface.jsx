import React, { useState, useEffect } from 'react'
import { Clock, User, BookOpen, AlertCircle, CheckCircle2, Circle, Flag, Menu, X } from 'lucide-react'

function TestInterface({ test, onExit, classData }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(test.timeLimit ? test.timeLimit * 60 : 3600)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [flagged, setFlagged] = useState(new Set())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const toggleFlag = (questionIndex) => {
    setFlagged(prev => {
      const newFlagged = new Set(prev)
      if (newFlagged.has(questionIndex)) {
        newFlagged.delete(questionIndex)
      } else {
        newFlagged.add(questionIndex)
      }
      return newFlagged
    })
  }

  const handleSubmit = async () => {
    // Calculate score
    let score = 0;
    const totalQuestions = test.questions?.length || 0;
    
    test.questions?.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswers = question.answer ? question.answer.split(',') : [];
      
      if (question.type === 'single_choice') {
        const correctOptionIndex = parseInt(correctAnswers[0]);
        const correctOption = question.options[correctOptionIndex];
        if (userAnswer === correctOption) {
          score++;
        }
      } else if (question.type === 'multiple_choice') {
        const userAnswerIndex = question.options.indexOf(userAnswer);
        if (correctAnswers.includes(userAnswerIndex.toString())) {
          score++;
        }
      }
    });
    
    // Submit result to backend
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const studentName = user.name || 'Anonymous Student';
      const studentEmail = user.email || 'no-email@example.com';
      const studentId = user.id || user._id || 'anonymous';
      
      const resultData = {
        testId: test._id,
        studentName: studentName,
        studentEmail: studentEmail,
        studentId: studentId,
        answers: Object.values(answers),
        score: score,
        totalQuestions: totalQuestions,
        CRcode: classData?.CRcode
      };
      
      console.log('Submitting test result:', resultData);
      
      const response = await fetch('http://localhost:4000/fetures/submit-test-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resultData)
      });
      
      if (response.ok) {
        console.log('Test result submitted successfully');
      } else {
        const errorData = await response.json();
        if (response.status === 400 && errorData.msg.includes('already submitted')) {
          alert('You have already submitted this test!');
          onExit();
          return;
        }
        console.error('Failed to submit test result:', errorData.msg);
      }
    } catch (error) {
      console.error('Error submitting test result:', error);
    }
    
    setIsSubmitted(true);
    setTimeout(() => {
      onExit();
    }, 3000);
  }

  if (isSubmitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '90%' }}>
          <div style={{ width: '60px', height: '60px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 style={{ width: '30px', height: '30px', color: 'white' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>Test Submitted!</h2>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>Your answers have been recorded successfully.</p>
          <div style={{ padding: '12px', background: '#F3F4F6', borderRadius: '6px' }}>
            <p style={{ fontSize: '13px', color: '#374151' }}>Questions Answered: {Object.keys(answers).length} of {test.questions?.length || 0}</p>
          </div>
        </div>
      </div>
    )
  }

  const questions = test.questions || []
  const question = questions[currentQuestion]
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Top Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
            >
              <Menu style={{ width: '20px', height: '20px' }} />
            </button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', margin: 0 }}>{test.title}</h1>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Question {currentQuestion + 1} of {questions.length}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: timeLeft < 300 ? '#FEF2F2' : '#F0F9FF', borderRadius: '8px', border: `1px solid ${timeLeft < 300 ? '#FECACA' : '#BFDBFE'}` }}>
              <Clock style={{ width: '18px', height: '18px', color: timeLeft < 300 ? '#DC2626' : '#2563EB' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: '600', color: timeLeft < 300 ? '#DC2626' : '#2563EB' }}>
                {formatTime(timeLeft)}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6B7280' }}>
              <User style={{ width: '16px', height: '16px' }} />
              <span>{JSON.parse(localStorage.getItem('user') || '{}').name || 'Student'}</span>
            </div>
            
            <button
              onClick={onExit}
              style={{ padding: '8px 16px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
            >
              Exit Test
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{ marginTop: '16px', maxWidth: '1200px', margin: '16px auto 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Progress</span>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>{answeredCount}/{questions.length} answered</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#10B981', transition: 'width 0.3s ease' }}></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', gap: '24px', padding: '24px' }}>
        {/* Sidebar */}
        {showSidebar && (
          <div style={{ width: '280px', background: 'white', borderRadius: '12px', padding: '20px', height: 'fit-content', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>Questions</h3>
              <button onClick={() => setShowSidebar(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {questions.map((_, index) => {
                const isAnswered = answers[index] !== undefined
                const isFlagged = flagged.has(index)
                const isCurrent = index === currentQuestion
                
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: isCurrent ? '2px solid #356AC3' : '1px solid #E5E7EB',
                      background: isAnswered ? '#10B981' : isCurrent ? '#356AC3' : 'white',
                      color: isAnswered || isCurrent ? 'white' : '#6B7280',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {index + 1}
                    {isFlagged && (
                      <Flag style={{ width: '10px', height: '10px', position: 'absolute', top: '2px', right: '2px', color: '#F59E0B' }} />
                    )}
                  </button>
                )
              })}
            </div>
            
            <div style={{ marginTop: '20px', padding: '16px', background: '#F9FAFB', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Answered ({answeredCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '12px', height: '12px', background: '#6B7280', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Not Answered ({questions.length - answeredCount})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flag style={{ width: '12px', height: '12px', color: '#F59E0B' }} />
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Flagged ({flagged.size})</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            {question && (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ padding: '8px 12px', background: '#F3F4F6', borderRadius: '6px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                        Question {currentQuestion + 1}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B7280' }}>
                        <BookOpen style={{ width: '14px', height: '14px' }} />
                        <span>Multiple Choice</span>
                      </div>
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', lineHeight: '1.4', margin: 0 }}>
                      {question.questiontitle}
                    </h2>
                  </div>
                  
                  <button
                    onClick={() => toggleFlag(currentQuestion)}
                    style={{
                      padding: '8px',
                      background: flagged.has(currentQuestion) ? '#FEF3C7' : '#F9FAFB',
                      border: `1px solid ${flagged.has(currentQuestion) ? '#F59E0B' : '#E5E7EB'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginLeft: '16px'
                    }}
                  >
                    <Flag style={{ width: '16px', height: '16px', color: flagged.has(currentQuestion) ? '#F59E0B' : '#6B7280' }} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {question.options?.map((option, index) => {
                    const isSelected = answers[currentQuestion] === option
                    const optionLetter = String.fromCharCode(65 + index)
                    
                    return (
                      <label
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '16px 20px',
                          border: `2px solid ${isSelected ? '#356AC3' : '#E5E7EB'}`,
                          borderRadius: '12px',
                          background: isSelected ? '#F0F9FF' : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          border: `2px solid ${isSelected ? '#356AC3' : '#D1D5DB'}`,
                          background: isSelected ? '#356AC3' : 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {isSelected && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }}></div>}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#6B7280', minWidth: '20px' }}>{optionLetter}.</span>
                          <span style={{ fontSize: '16px', color: '#374151', lineHeight: '1.5' }}>{option}</span>
                        </div>
                        
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(currentQuestion, option)}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: currentQuestion === 0 ? '#F9FAFB' : 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                color: currentQuestion === 0 ? '#9CA3AF' : '#374151',
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ← Previous
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: '12px 24px',
                    background: '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: '#356AC3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestInterface