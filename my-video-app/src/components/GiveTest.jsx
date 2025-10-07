import React, { useState, useEffect } from 'react'
import { Clock, User, BookOpen, Shield, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'
import TestInterface from './TestInterface'

function GiveTest({ testId }) {
  const [test, setTest] = useState(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const [showTestInterface, setShowTestInterface] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Mock test data - replace with actual API call
  useEffect(() => {
    const mockTest = {
      id: testId,
      title: "Mathematics Quiz - Chapter 5",
      description: "This test covers topics from Chapter 5: Algebra and Linear Equations. Please read all questions carefully before answering.",
      timeLimit: 60,
      totalQuestions: 15,
      maxMarks: 100,
      passingMarks: 40,
      instructions: [
        "Read each question carefully before selecting your answer",
        "You can navigate between questions using the question panel",
        "Make sure to submit your test before the time runs out",
        "Once submitted, you cannot change your answers",
        "Do not refresh the page during the test"
      ],
      questions: [
        {
          questiontitle: "What is the value of x in the equation 2x + 5 = 15?",
          type: "single_choice",
          options: ["x = 5", "x = 10", "x = 7.5", "x = 2.5"]
        },
        {
          questiontitle: "Which of the following are prime numbers?",
          type: "multiple_choice", 
          options: ["2", "4", "7", "9", "11"]
        }
      ]
    }
    setTest(mockTest)
  }, [testId])

  const startTest = () => {
    if (!studentName.trim() || !studentId.trim() || !agreedToTerms) {
      alert('Please fill all required fields and agree to the terms')
      return
    }
    setShowInstructions(false)
    setShowTestInterface(true)
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#356AC3] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    )
  }

  if (showTestInterface) {
    return (
      <TestInterface 
        test={test}
        studentName={studentName}
        studentId={studentId}
        onSubmit={(answers) => {
          console.log('Test submitted:', { studentName, studentId, answers })
          // Handle test submission
        }}
        onExit={() => {
          setShowTestInterface(false)
          setShowInstructions(true)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#356AC3] rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{test.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Test Information */}
            <div className="md:col-span-2 space-y-6">
              {/* Test Details Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-[#356AC3]" />
                  Test Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-900">Duration</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{test.timeLimit} min</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <BookOpen className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-900">Questions</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{test.totalQuestions || test.questions.length}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-purple-900">Total Marks</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{test.maxMarks}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                      <span className="text-sm font-medium text-orange-900">Passing Marks</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{test.passingMarks}</p>
                  </div>
                </div>
              </div>

              {/* Instructions Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                  Important Instructions
                </h2>
                <div className="space-y-3">
                  {test.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#356AC3] text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Student Information & Start Test */}
            <div className="space-y-6">
              {/* Student Info Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-[#356AC3]" />
                  Student Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID *
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#356AC3] focus:border-transparent"
                      placeholder="Enter your student ID"
                    />
                  </div>
                </div>
              </div>

              {/* Terms & Start Test */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-6">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#356AC3] focus:ring-[#356AC3] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      I have read and understood all the instructions. I agree to the terms and conditions of this test.
                    </span>
                  </label>
                </div>
                
                <button
                  onClick={startTest}
                  disabled={!studentName.trim() || !studentId.trim() || !agreedToTerms}
                  className="w-full bg-gradient-to-r from-[#356AC3] to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-[#2d5aa0] hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Start Test</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Make sure you have a stable internet connection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GiveTest