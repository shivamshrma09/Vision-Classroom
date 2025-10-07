import React, { useState } from 'react'
import { Calendar, Users, Save, Download, Check, X, Mail, AlertTriangle } from 'lucide-react'

function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState({})

  // Mock student data
  const students = [
    { id: 1, name: 'Rahul Sharma', rollNo: '001' },
    { id: 2, name: 'Priya Singh', rollNo: '002' },
    { id: 3, name: 'Amit Kumar', rollNo: '003' },
    { id: 4, name: 'Sneha Patel', rollNo: '004' },
    { id: 5, name: 'Ravi Gupta', rollNo: '005' },
    { id: 6, name: 'Anita Sharma', rollNo: '006' },
    { id: 7, name: 'Vikash Singh', rollNo: '007' },
    { id: 8, name: 'Pooja Kumari', rollNo: '008' },
    { id: 9, name: 'Suresh Yadav', rollNo: '009' },
    { id: 10, name: 'Kavita Devi', rollNo: '010' },
    { id: 11, name: 'Manoj Kumar', rollNo: '011' },
    { id: 12, name: 'Sunita Singh', rollNo: '012' },
    { id: 13, name: 'Deepak Sharma', rollNo: '013' },
    { id: 14, name: 'Rekha Patel', rollNo: '014' },
    { id: 15, name: 'Ajay Gupta', rollNo: '015' },
    { id: 16, name: 'Meera Kumari', rollNo: '016' },
    { id: 17, name: 'Sanjay Singh', rollNo: '017' },
    { id: 18, name: 'Geeta Sharma', rollNo: '018' },
    { id: 19, name: 'Ramesh Kumar', rollNo: '019' },
    { id: 20, name: 'Nisha Patel', rollNo: '020' }
  ]

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'P' ? 'A' : 'P'
    }))
  }

  const markAllPresent = () => {
    const allPresent = {}
    students.forEach(student => {
      allPresent[student.id] = 'P'
    })
    setAttendance(allPresent)
  }

  const markAllAbsent = () => {
    const allAbsent = {}
    students.forEach(student => {
      allAbsent[student.id] = 'A'
    })
    setAttendance(allAbsent)
  }

  const saveAttendance = () => {
    console.log('Attendance saved for date:', selectedDate, attendance)
    alert('Attendance saved successfully!')
  }

  // Mock attendance data for calculating percentage
  const getAttendancePercentage = (studentId) => {
    // Mock: Random percentage between 60-95% for demo
    const percentages = {
      1: 85, 2: 92, 3: 68, 4: 78, 5: 95, 6: 72, 7: 88, 8: 65, 9: 90, 10: 82,
      11: 70, 12: 87, 13: 63, 14: 89, 15: 74, 16: 91, 17: 67, 18: 86, 19: 71, 20: 93
    }
    return percentages[studentId] || 75
  }

  const lowAttendanceStudents = students.filter(student => getAttendancePercentage(student.id) < 75)

  const sendEmailToLowAttendance = () => {
    const studentNames = lowAttendanceStudents.map(s => s.name).join(', ')
    alert(`Email sent to students with low attendance: ${studentNames}`)
    console.log('Sending emails to:', lowAttendanceStudents)
  }

  const presentCount = Object.values(attendance).filter(status => status === 'P').length
  const absentCount = Object.values(attendance).filter(status => status === 'A').length
  const totalStudents = students.length

  return (
    <div style={{ marginLeft: '270px', marginTop: '80px', flex: 1, padding: '20px', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#356AC3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>Attendance Sheet</h1>
              <p style={{ color: '#6b7280', margin: '0' }}>Mark student attendance - Click on cells to toggle P/A</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar style={{ width: '20px', height: '20px', color: '#6b7280' }} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb', margin: '0' }}>{totalStudents}</p>
            <p style={{ fontSize: '12px', color: '#2563eb', margin: '0' }}>Total</p>
          </div>
          <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a', margin: '0' }}>{presentCount}</p>
            <p style={{ fontSize: '12px', color: '#16a34a', margin: '0' }}>Present</p>
          </div>
          <div style={{ backgroundColor: '#fef2f2', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626', margin: '0' }}>{absentCount}</p>
            <p style={{ fontSize: '12px', color: '#dc2626', margin: '0' }}>Absent</p>
          </div>
          <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '6px', textAlign: 'center' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#6b7280', margin: '0' }}>{totalStudents - presentCount - absentCount}</p>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>Unmarked</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={markAllPresent}
              style={{ padding: '8px 16px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
            >
              Mark All Present
            </button>
            <button
              onClick={markAllAbsent}
              style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
            >
              Mark All Absent
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
              <Download style={{ width: '16px', height: '16px' }} />
              Export
            </button>
            <button
              onClick={saveAttendance}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 24px', backgroundColor: '#356AC3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
            >
              <Save style={{ width: '16px', height: '16px' }} />
              Save Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Excel-like Attendance Table */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0' }}>Attendance Sheet - {new Date(selectedDate).toLocaleDateString()}</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', borderRight: '1px solid #e5e7eb', fontWeight: '600', color: '#374151', fontSize: '14px' }}>S.No</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', borderRight: '1px solid #e5e7eb', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Roll No</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', borderRight: '1px solid #e5e7eb', fontWeight: '600', color: '#374151', fontSize: '14px', minWidth: '200px' }}>Student Name</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e5e7eb', fontWeight: '600', color: '#374151', fontSize: '14px', width: '120px' }}>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', borderRight: '1px solid #e5e7eb', fontSize: '14px', color: '#374151' }}>{index + 1}</td>
                  <td style={{ padding: '12px', borderRight: '1px solid #e5e7eb', fontSize: '14px', color: '#374151', fontWeight: '500' }}>{student.rollNo}</td>
                  <td style={{ padding: '12px', borderRight: '1px solid #e5e7eb', fontSize: '14px', color: '#374151' }}>{student.name}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <button
                      onClick={() => toggleAttendance(student.id)}
                      style={{
                        width: '60px',
                        height: '36px',
                        border: '2px solid',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        backgroundColor: attendance[student.id] === 'P' ? '#dcfce7' : attendance[student.id] === 'A' ? '#fef2f2' : '#f9fafb',
                        borderColor: attendance[student.id] === 'P' ? '#16a34a' : attendance[student.id] === 'A' ? '#dc2626' : '#d1d5db',
                        color: attendance[student.id] === 'P' ? '#16a34a' : attendance[student.id] === 'A' ? '#dc2626' : '#6b7280'
                      }}
                    >
                      {attendance[student.id] === 'P' && <Check style={{ width: '16px', height: '16px' }} />}
                      {attendance[student.id] === 'A' && <X style={{ width: '16px', height: '16px' }} />}
                      {attendance[student.id] || '-'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Attendance Alert */}
      {lowAttendanceStudents.length > 0 && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fef2f2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle style={{ width: '20px', height: '20px', color: '#dc2626' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626', margin: '0' }}>Low Attendance Alert (Below 75%)</h3>
              </div>
              <button
                onClick={sendEmailToLowAttendance}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
              >
                <Mail style={{ width: '16px', height: '16px' }} />
                Send Email Alert
              </button>
            </div>
          </div>
          
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              {lowAttendanceStudents.map(student => (
                <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: '0' }}>{student.name}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>Roll No: {student.rollNo}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#dc2626', margin: '0' }}>{getAttendancePercentage(student.id)}%</p>
                    <p style={{ fontSize: '11px', color: '#dc2626', margin: '0' }}>Attendance</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Attendance