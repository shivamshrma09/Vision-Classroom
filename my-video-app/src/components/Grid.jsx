import React, { useState, useEffect } from 'react'

function Grid({ students = [], onSaveAttendance, classData }) {
  const studentNames = students.map(student => student.studentName || 'Unknown');
  const studentsrollnumber = students.map(student => student.studnetsrollnumber || student.rollNumber || 'N/A');
  
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [savedStudents, setSavedStudents] = useState([]);

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

  const saveAttendance = async () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    
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
    

    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/fetures/save-attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          attendanceData: attendanceList,
          CRcode: classData?.CRcode || 'unknown'
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Attendance saved successfully!');
        loadAttendance(selectedDate);
      } else {
        alert(result.msg || 'Failed to save attendance');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  useEffect(() => {
    if (selectedDate) {
      loadAttendance(selectedDate);
    }
  }, [selectedDate]);

  const getSelectStyle = (status) => ({
    backgroundColor: status === 'present' ? '#dcfce7' : status === 'late' ? '#fef3c7' : '#fecaca',
    color: status === 'present' ? '#166534' : status === 'late' ? '#92400e' : '#991b1b'
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
                const currentStatus = attendanceData[studentId] || 'absent';
                
                return (
                  <tr key={`${studentId}-${index}`}>
                    <td className="h-12 w-40 bg-white border border-gray-500 text-center">
                      {studentsrollnumber[index] || `Roll-${index + 1}`}
                    </td>
                    <td className="h-12 w-40 bg-white border border-gray-500 text-center">
                      {name}
                    </td>
                    <td className="h-12 w-40 border border-gray-500 text-center p-0">
                      <select 
                        className="w-full h-full border-none focus:outline-none cursor-pointer text-center font-medium"
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(studentId, e.target.value)}
                        style={getSelectStyle(currentStatus)}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                      </select>
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
          onClick={saveAttendance}
          className="bg-[#356AC3] text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Save Attendance
        </button>
      </div>
    </div>
  )
}

export default Grid