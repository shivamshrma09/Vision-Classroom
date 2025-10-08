import React, { useState } from 'react'
import { Plus, Trash2, Users, ChevronDown } from 'lucide-react'



function Test({ onCreate, classData }) {
  const [testTitle, setTestTitle] = useState('')
  const [testDescription, setTestDescription] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [timeLimit, setTimeLimit] = useState('')
  const [expireTime, setExpireTime] = useState('')
  const [classroomCode, setClassroomCode] = useState('')
  const [audience, setAudience] = useState('All students')
  const [showAudience, setShowAudience] = useState(false)
  const [questions, setQuestions] = useState([{
    questiontitle: '',
    type: 'multiple_choice',
    options: ['', ''],
    correctAnswer: [],
    scale: null
  }])

  const addQuestion = () => {
    setQuestions([...questions, {
      questiontitle: '',
      type: 'multiple_choice',
      options: ['', ''],
      correctAnswer: [],
      scale: null
    }])
  }

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index][field] = value
    
    if (field === 'type') {
      updatedQuestions[index].correctAnswer = value === 'multiple_choice' ? [] : null
    }
    
    setQuestions(updatedQuestions)
  }

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options.push('')
    setQuestions(updatedQuestions)
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuestions(updatedQuestions)
  }

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions]
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1)
      setQuestions(updatedQuestions)
    }
  }

  const handleCreateTest = () => {
    if (!testTitle.trim() || !testDescription.trim()) {
      alert('Please fill title and description');
      return;
    }
    
    const crCode = classData?.classCode || classData?.CRcode || '';
    if (!crCode) {
      alert('Classroom code not found. Please refresh and try again.');
      return;
    }
    
    const validQuestions = questions.filter(q => q.questiontitle.trim());
    if (validQuestions.length === 0) {
      alert('Please add at least one question with a title');
      return;
    }
    
    const formattedQuestions = validQuestions.map(q => {
      const validOptions = q.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        alert(`Question "${q.questiontitle}" needs at least 2 options`);
        return null;
      }
      let answerString = '';
      if (q.type === 'multiple_choice' && Array.isArray(q.correctAnswer)) {
        answerString = q.correctAnswer.join(',');
      } else if (q.type === 'single_choice') {
        answerString = q.correctAnswer?.toString() || '';
      }
      
      return {
        questiontitle: q.questiontitle.trim(),
        type: q.type,
        options: validOptions,
        answer: answerString
      };
    });
    
    if (formattedQuestions.includes(null)) {
      return;
    }
    
    const newTest = {
      title: testTitle,
      description: testDescription,
      questions: formattedQuestions,
      scheduleTime: scheduleTime || null,
      expireTime: expireTime || null,
      CRcode: crCode
    }
    
    console.log('Creating test with data:', newTest);
    console.log('Questions count:', formattedQuestions.length);
    console.log('First question:', formattedQuestions[0]);
    
    if (onCreate) {
      onCreate(newTest)
    }
    
    setTestTitle('')
    setTestDescription('')
    setScheduleTime('')
    setTimeLimit('')
    setExpireTime('')
    setClassroomCode('')
    setQuestions([{
      questiontitle: '',
      type: 'multiple_choice',
      options: ['', ''],
      correctAnswer: [],
      scale: null
    }])
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#356AC3] flex items-center justify-center">
                <span className="text-white font-medium text-sm">SK</span>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowAudience(!showAudience)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
                >
                  <span>For</span>
                  <Users className="w-4 h-4" />
                  <span>{audience}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showAudience && (
                  <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                    <button 
                      onClick={() => {setAudience('All students'); setShowAudience(false)}}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      All students
                    </button>
                    <button 
                      onClick={() => {setAudience('Specific students'); setShowAudience(false)}}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      Specific students
                    </button>
                  </div>
                )}
              </div>
            </div>
            <span className="px-3 py-1.5 text-xs border border-gray-300 rounded-md bg-gray-50 text-gray-600">
              Test
            </span>
          </div>
        </div>

        <div className="p-4">
          <input
            type="text"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            placeholder="Test title"
            className="w-full p-3 mb-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent text-gray-700"
          />
          <textarea
            value={testDescription}
            onChange={(e) => setTestDescription(e.target.value)}
            placeholder="Test description and instructions"
            className="w-full min-h-20 p-3 mb-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#356AC3] focus:border-transparent text-gray-700"
          />
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Questions</h3>
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Question {qIndex + 1}</span>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <input
                  type="text"
                  value={question.questiontitle}
                  onChange={(e) => updateQuestion(qIndex, 'questiontitle', e.target.value)}
                  placeholder="Enter your question"
                  className="w-full p-2 mb-3 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#356AC3]"
                />
                
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                  className="w-full p-2 mb-3 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#356AC3]"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="single_choice">Single Choice</option>
                </select>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">Options:</label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <input
                        type={question.type === 'multiple_choice' ? 'checkbox' : 'radio'}
                        name={`correct-${qIndex}`}
                        checked={
                          question.type === 'multiple_choice'
                            ? question.correctAnswer.includes(oIndex)
                            : question.correctAnswer === oIndex
                        }
                        onChange={(e) => {
                          const updatedQuestions = [...questions]
                          if (question.type === 'multiple_choice') {
                            if (e.target.checked) {
                              updatedQuestions[qIndex].correctAnswer = [...question.correctAnswer, oIndex]
                            } else {
                              updatedQuestions[qIndex].correctAnswer = question.correctAnswer.filter(a => a !== oIndex)
                            }
                          } else {
                            updatedQuestions[qIndex].correctAnswer = oIndex
                          }
                          setQuestions(updatedQuestions)
                        }}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1 p-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#356AC3]"
                      />
                      {question.options.length > 2 && (
                        <button
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(qIndex)}
                    className="text-[#356AC3] text-sm hover:underline"
                  >
                    + Add Option
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    {question.type === 'multiple_choice' 
                      ? 'Check all correct answers' 
                      : 'Select the correct answer'
                    }
                  </p>
                </div>
              </div>
            ))}
            
            <button
              onClick={addQuestion}
              className="flex items-center space-x-2 text-[#356AC3] hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Question</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Shivam Kumar</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleCreateTest}
              className="px-6 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-[#356AC3]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!testTitle.trim() || !testDescription.trim()}
            >
              Create Test
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-3">
          <h3 className="text-xs font-medium text-gray-700 mb-2">Schedule & Settings</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Schedule Time</label>
              <input 
                type="datetime-local"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#356AC3] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Time Limit (minutes)</label>
              <input 
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="e.g. 60"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#356AC3] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Expire Time (Optional)</label>
              <input 
                type="datetime-local"
                value={expireTime}
                onChange={(e) => setExpireTime(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#356AC3] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Test Link</label>
              <div className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-500">
                Link will be generated after creating test
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Test