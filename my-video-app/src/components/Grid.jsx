import React, { useState, useEffect } from 'react'

function Grid({ students = [], onSaveAttendance, classData }) {
  const studentNames = students.map(student => student.studentName || 'Unknown');
  const studentsrollnumber = students.map(student => student.studnetsrollnumber || student.rollNumber || 'N/A');
  
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [savedStudents, setSavedStudents] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');

  const loadAttendance = async (date) => {
    if (!date || !classData?.CRcode) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/fetures/get-attendance?date=${date}&CRcode=${classData.CRcode}`);
      const result = await response.json();
      
      if (response.ok && result.attendance) {
        const attendanceMap = {};
        const studentsWithAttendance = [];
        
        result.attendance.forEach(item => {
          if (item.status !== 'not-in-class') {
            attendanceMap[item.studentId] = item.status;
            const studentIndex = studentNames.indexOf(item.studentName);
            const rollNumber = item.studnetsrollnumber || studentsrollnumber[studentIndex] || 'N/A';
            studentsWithAttendance.push({
              studentId: item.studentId,
              rollNumber: rollNumber,
              name: item.studentName,
              status: item.status
            });
          }
        });
        
        setAttendanceData(attendanceMap);
        setSavedStudents(studentsWithAttendance);
      } else {
        setAttendanceData({});
        setSavedStudents([]);
      }
    } catch (error) {
      setSavedStudents([]);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
    
    if (savedStudents.length > 0) {
      setSavedStudents(prev => prev.map(student => 
        student.studentId === studentId ? { ...student, status } : student
      ));
    }
  };

  const handleSaveClick = () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    setShowPasswordModal(true);
  };

  const saveAttendance = async () => {
    console.log('🚀 Frontend: saveAttendance called');
    console.log('Selected date:', selectedDate);
    console.log('Password:', password);
    console.log('ClassData:', classData);
    
    let attendanceList;
    if (savedStudents.length === 0) {
      attendanceList = studentNames.map((name, index) => {
        const studentId = students[index]?.userId || `student-${index}`;
        return {
          studentId: studentId,
          studnetsrollnumber: studentsrollnumber[index] || `Roll-${index + 1}`,
          studentName: name,
          status: attendanceData[studentId] || 'absent'
        };
      });
    } else {
      attendanceList = savedStudents.map(student => {
        const studentIndex = studentNames.indexOf(student.name);
        const correctRollNumber = studentsrollnumber[studentIndex] || student.rollNumber;
        return {
          studentId: student.studentId,
          studnetsrollnumber: correctRollNumber,
          studentName: student.name,
          status: attendanceData[student.studentId] || student.status
        };
      });
    }
    
    const requestData = {
      date: selectedDate,
      attendanceData: attendanceList,
      CRcode: classData?.CRcode || 'unknown',
      password: password
    };
    
    console.log('📤 Sending request:', requestData);
    
    try {
      const url = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/fetures/save-attendance`;
      console.log('📍 Request URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      console.log('📥 Response status:', response.status);
      
      const result = await response.json();
      console.log('📥 Response data:', result);
      
      if (response.ok) {
        alert('Attendance saved successfully!');
        setShowPasswordModal(false);
        setPassword('');
        loadAttendance(selectedDate);
      } else {
        alert(result.msg || 'Failed to save attendance');
      }
    } catch (error) {
      console.error('❌ Frontend error:', error);
      alert('Network error. Please try again.');
    }
  };

  useEffect(() => {
    if (selectedDate) {
      loadAttendance(selectedDate);
    }
  }, [selectedDate]);

  const getTickBoxStyle = (status, hasData) => ({
    width: '30px',
    height: '30px',
    border: '1px solid #9ca3af',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    backgroundColor: !hasData ? '#ffffff' : status === 'present' ? '#22c55e' : '#ef4444',
    color: !hasData ? '#9ca3af' : '#ffffff'
  });

  return (
    <div>
      <div className="text-2xl font-bold text-center mt-10 text-[#356AC3] text-4xl">Student Attendance</div>
      <div className="text-gray-500 text-center mt-2">Vision Classroom - Take Attendance in smarter way</div>

      <div className="flex items-center gap-4 mt-8 ml-[560px]">
        <label className="text-lg font-medium">Select Date:</label>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#356AC3]"
        />
      </div>

      <div className="flex justify-center mt-[80px]">
        <table className="border-collapse border border-gray-500">
          <thead>
            <tr>
              <th className="h-12 w-40 bg-gray-100 border border-gray-500 text-center font-semibold">Roll Number</th>
              <th className="h-12 w-40 bg-gray-100 border border-gray-500 text-center font-semibold">Student Name</th>
              <th className="h-12 w-40 bg-gray-100 border border-gray-500 text-center font-semibold">Date - ({selectedDate || 'Select Date'})</th>
            </tr>
          </thead>
          <tbody>
            {studentNames.length > 0 ? (
              studentNames.map((name, index) => {
                const studentId = students[index]?.userId || `student-${index}`;
                const hasAttendanceData = attendanceData.hasOwnProperty(studentId);
                const currentStatus = attendanceData[studentId];
                
                return (
                  <tr key={`${studentId}-${index}`}>
                    <td className="h-12 w-40 bg-white border border-gray-500 text-center">
                      {studentsrollnumber[index] || `Roll-${index + 1}`}
                    </td>
                    <td className="h-12 w-40 bg-white border border-gray-500 text-center">
                      {name}
                    </td>
                    <td className="h-12 w-40 border border-gray-500 text-center p-2">
                      <div className="flex justify-center">
                        <div 
                          style={getTickBoxStyle(currentStatus, hasAttendanceData)}
                          onClick={() => {
                            if (!hasAttendanceData || currentStatus !== 'present') {
                              handleStatusChange(studentId, 'present');
                            } else {
                              handleStatusChange(studentId, 'absent');
                            }
                          }}
                        >
                          {hasAttendanceData && currentStatus === 'present' ? '✓' : hasAttendanceData && currentStatus === 'absent' ? '✗' : ''}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="h-12 bg-white border border-gray-500 text-center">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-8">
        <button 
          onClick={handleSaveClick}
          className="bg-[#356AC3] text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Save Attendance
        </button>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-center">Verify Password</h3>
            <p className="text-gray-600 mb-4 text-center">Enter your password to save attendance</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#356AC3] mb-4"
              onKeyPress={(e) => e.key === 'Enter' && saveAttendance()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveAttendance}
                className="flex-1 px-4 py-2 bg-[#356AC3] text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Grid