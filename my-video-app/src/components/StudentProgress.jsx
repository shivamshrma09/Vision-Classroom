import React, { useState } from 'react'
import { Send, TrendingUp, BookOpen, FileText, Clock, MessageCircle, Calendar, Award } from 'lucide-react'

function StudentProgress() {
  const [selectedStudents, setSelectedStudents] = useState([])

  // Mock student data with detailed progress
  const students = [
    {
      id: 1,
      name: 'Rahul Sharma',
      rollNo: '001',
      assignmentsSubmitted: 12,
      totalAssignments: 15,
      classesAttended: 28,
      totalClasses: 32,
      testsTaken: 8,
      totalTests: 10,
      averageScore: 85,
      attendancePercentage: 87,
      lastActivity: '2 days ago',
      grade: 'A',
      subjects: {
        Math: { score: 88, assignments: 4, tests: 3 },
        Science: { score: 82, assignments: 3, tests: 2 },
        English: { score: 90, assignments: 5, tests: 3 }
      }
    },
    {
      id: 2,
      name: 'Priya Singh',
      rollNo: '002',
      assignmentsSubmitted: 15,
      totalAssignments: 15,
      classesAttended: 30,
      totalClasses: 32,
      testsTaken: 9,
      totalTests: 10,
      averageScore: 92,
      attendancePercentage: 94,
      lastActivity: '1 day ago',
      grade: 'A+',
      subjects: {
        Math: { score: 95, assignments: 5, tests: 3 },
        Science: { score: 89, assignments: 5, tests: 3 },
        English: { score: 92, assignments: 5, tests: 3 }
      }
    },
    {
      id: 3,
      name: 'Amit Kumar',
      rollNo: '003',
      assignmentsSubmitted: 8,
      totalAssignments: 15,
      classesAttended: 22,
      totalClasses: 32,
      testsTaken: 6,
      totalTests: 10,
      averageScore: 68,
      attendancePercentage: 69,
      lastActivity: '5 days ago',
      grade: 'C',
      subjects: {
        Math: { score: 65, assignments: 2, tests: 2 },
        Science: { score: 70, assignments: 3, tests: 2 },
        English: { score: 69, assignments: 3, tests: 2 }
      }
    },
    {
      id: 4,
      name: 'Sneha Patel',
      rollNo: '004',
      assignmentsSubmitted: 11,
      totalAssignments: 15,
      classesAttended: 25,
      totalClasses: 32,
      testsTaken: 7,
      totalTests: 10,
      averageScore: 78,
      attendancePercentage: 78,
      lastActivity: '3 days ago',
      grade: 'B',
      subjects: {
        Math: { score: 75, assignments: 3, tests: 2 },
        Science: { score: 80, assignments: 4, tests: 3 },
        English: { score: 79, assignments: 4, tests: 2 }
      }
    },
    {
      id: 5,
      name: 'Ravi Gupta',
      rollNo: '005',
      assignmentsSubmitted: 16,
      totalAssignments: 15,
      classesAttended: 32,
      totalClasses: 32,
      testsTaken: 10,
      totalTests: 10,
      averageScore: 95,
      attendancePercentage: 100,
      lastActivity: 'Today',
      grade: 'A+',
      subjects: {
        Math: { score: 98, assignments: 5, tests: 4 },
        Science: { score: 94, assignments: 5, tests: 3 },
        English: { score: 93, assignments: 6, tests: 3 }
      }
    }
  ]

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const selectAllStudents = () => {
    setSelectedStudents(students.map(s => s.id))
  }

  const clearSelection = () => {
    setSelectedStudents([])
  }

  const sendProgressReport = () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student')
      return
    }
    
    const selectedNames = students
      .filter(s => selectedStudents.includes(s.id))
      .map(s => s.name)
      .join(', ')
    
    alert(`Progress report sent via email to: ${selectedNames}`)
    setSelectedStudents([])
  }

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+': return '#16a34a'
      case 'A': return '#22c55e'
      case 'B': return '#eab308'
      case 'C': return '#f97316'
      case 'D': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div>
      {/* Header with Send Button */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: '0 0 4px 0' }}>
            Student Progress Reports
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            {selectedStudents.length > 0 
              ? `${selectedStudents.length} student(s) selected`
              : 'Select students to send progress reports'
            }
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {selectedStudents.length > 0 && (
            <button
              onClick={clearSelection}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Clear
            </button>
          )}
          
          <button
            onClick={selectAllStudents}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Select All
          </button>
          
          <button
            onClick={sendProgressReport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              backgroundColor: '#356AC3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Send style={{ width: '16px', height: '16px' }} />
            Send Progress Report
          </button>
        </div>
      </div>

      {/* Student Progress Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
        {students.map(student => (
          <div
            key={student.id}
            onClick={() => toggleStudentSelection(student.id)}
            style={{
              backgroundColor: 'white',
              border: selectedStudents.includes(student.id) ? '2px solid #356AC3' : '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: selectedStudents.includes(student.id) 
                ? '0 4px 12px rgba(53, 106, 195, 0.15)' 
                : '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {/* Student Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#356AC3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 2px 0' }}>
                    {student.name}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    Roll No: {student.rollNo}
                  </p>
                </div>
              </div>
              
              <div style={{
                padding: '4px 12px',
                borderRadius: '20px',
                backgroundColor: `${getGradeColor(student.grade)}20`,
                border: `1px solid ${getGradeColor(student.grade)}40`
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: getGradeColor(student.grade)
                }}>
                  {student.grade}
                </span>
              </div>
            </div>

            {/* Progress Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                <FileText style={{ width: '20px', height: '20px', color: '#0284c7', margin: '0 auto 4px' }} />
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#0284c7', margin: '0 0 2px 0' }}>
                  {student.assignmentsSubmitted}/{student.totalAssignments}
                </p>
                <p style={{ fontSize: '11px', color: '#0284c7', margin: 0 }}>Assignments</p>
              </div>
              
              <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                <BookOpen style={{ width: '20px', height: '20px', color: '#16a34a', margin: '0 auto 4px' }} />
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#16a34a', margin: '0 0 2px 0' }}>
                  {student.classesAttended}/{student.totalClasses}
                </p>
                <p style={{ fontSize: '11px', color: '#16a34a', margin: 0 }}>Classes</p>
              </div>
              
              <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                <Clock style={{ width: '20px', height: '20px', color: '#d97706', margin: '0 auto 4px' }} />
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#d97706', margin: '0 0 2px 0' }}>
                  {student.testsTaken}/{student.totalTests}
                </p>
                <p style={{ fontSize: '11px', color: '#d97706', margin: 0 }}>Tests</p>
              </div>
              
              <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#fdf2f8', borderRadius: '8px' }}>
                <Award style={{ width: '20px', height: '20px', color: '#be185d', margin: '0 auto 4px' }} />
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#be185d', margin: '0 0 2px 0' }}>
                  {student.averageScore}%
                </p>
                <p style={{ fontSize: '11px', color: '#be185d', margin: 0 }}>Avg Score</p>
              </div>
            </div>

            {/* Attendance Bar */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Attendance</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: student.attendancePercentage >= 75 ? '#16a34a' : '#dc2626' }}>
                  {student.attendancePercentage}%
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${student.attendancePercentage}%`,
                  height: '100%',
                  backgroundColor: student.attendancePercentage >= 75 ? '#16a34a' : '#dc2626',
                  borderRadius: '3px'
                }}></div>
              </div>
            </div>

            {/* Last Activity */}
            <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'center' }}>
              Last activity: {student.lastActivity}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudentProgress