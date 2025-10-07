import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import { AssignmentDisplay } from "./Assignment";
import AssignmentForm from "./AssignmentForm";
import PostForm from "./PostForm";
import TestDisplay from "./TestDisplay";
import Post, { PostDisplay } from "./Post";
import Test from "./Test";
import Class from "./Class";
import ClassDisplay from "./ClassDisplay";
import Feedback from "./Feedback";

import Attendance from "./Attendance";
import TestInterface from "./TestInterface";
import StudentProgress from "./StudentProgress";
import Grid from "./Grid";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
});

function MainFile() {
  const { classroomId } = useParams();
  const [classData, setClassData] = useState(null);

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [posts, setPosts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [tests, setTests] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classroomAssignments, setClassroomAssignments] = useState([]);
  const [classroomTests, setClassroomTests] = useState([]);
  const [classroomMaterials, setClassroomMaterials] = useState([]);
  const [classroomsdata, setClassroomsdata] = useState(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [selectedAssignmentSubmissions, setSelectedAssignmentSubmissions] =
    useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsrollnumbers, setStudentsrollnumbers] = useState([]);

  const handleCreatePost = async (postData) => {
    try {
      const response = await axiosInstance.post("/fetures/post", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchClassroomData();
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post!");
    }
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      const response = await axiosInstance.post(
        "/fetures/assignment",
        assignmentData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await fetchClassroomData();
      alert("Assignment created successfully!");
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Failed to create assignment!");
    }
  };

  const handleCreateTest = async (testData) => {
    try {
      console.log("Sending test data:", testData);
      const response = await axiosInstance.post("/fetures/test", testData);

      await fetchClassroomData();
      alert("Test created successfully!");
    } catch (error) {
      console.error("Error creating test:", error);
      const errorMsg = error.response?.data?.msg || "Failed to create test!";
      alert(errorMsg);
    }
  };

  const handleCreateMeeting = async (newMeeting) => {
    try {
      const response = await axiosInstance.post("/classroom/create-meeting", {
        ...newMeeting,
        classroomId: classData._id,
      });
      setMeetings((prev) => [response.data.meeting, ...prev]);
      alert("Meeting scheduled successfully!");
    } catch (error) {
      console.error("Error creating meeting:", error);
      alert("Failed to schedule meeting!");
    }
  };

  const handleCreateFeedback = async (newFeedback) => {
    console.log('Feedback created:', newFeedback);
  };

  const handleSaveAttendance = async () => {
  
  };

  const handleStartTest = (test) => {
    setActiveTest(test);
  };

  const handleExitTest = () => {
    setActiveTest(null);
  };

  const handleAddComment = async () => {
    await fetchClassroomData();
  };

  useEffect(() => {
    if (classroomId) {
      fetchClassroomData();
    }
  }, [classroomId]);














  let studentsrollnumbe = [];



    


  const fetchClassroomData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/classroom/classroomspecific-data",
        {
          classroomid: classroomId,
        }
      );

      const classroom = await  response.data.classroom;
      setClassData(classroom);

     
      const user = JSON.parse(localStorage.getItem("user") );
        console.log("classroom adminId:" ,classroom.adminId )
        console.log("user id:" , user.id || user._id)
        console.log("user object:", user)

     

      // Convert both to strings for comparison
      const adminId = String(classroom.adminId);
      const userId = String(user.id || user._id);
      
      console.log('Comparing adminId:', adminId, 'with userId:', userId);
      
      if(adminId === userId){
        setIsTeacher(true);
        console.log('User is teacher!');
      } else {
        setIsTeacher(false);
        console.log('User is student!');
      }
      
   
      
      setClassroomAssignments(classroom.aassignmets || []);
      setClassroomTests(classroom.tests || []);
      setPosts(classroom.posts || []);
      setClassroomMaterials(classroom.materials || []);

      // Store complete student objects
      if (classroom.students && Array.isArray(classroom.students)) {
        setStudents(classroom.students);
        console.log('Complete student data:', classroom.students);
      } else {
        setStudents([]);
      }

      
    } catch (error) {
      console.error("Error fetching classroom data:", error);
      alert("Failed to load classroom");
    } finally {
      setLoading(false);
    }
  };




  const handleViewSubmissions = async (assignmentId, submissions = null) => {
    if (submissions) {
      // If submissions are passed directly from AssignmentDisplay
      setSelectedAssignmentSubmissions(submissions);
      setSelectedAssignmentId(assignmentId);
      setShowSubmissions(true);
    } else {
      // Fallback API call
      try {
        const response = await axiosInstance.get(
          `/fetures/assignment-submissions/${assignmentId}?CRcode=${classData?.CRcode}`
        );
        if (response.status === 200) {
          setSelectedAssignmentSubmissions(response.data.submissions);
          setSelectedAssignmentId(assignmentId);
          setShowSubmissions(true);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        alert("Failed to fetch submissions");
      }
    }
  };

  // Assignment submit karne ka function
  const handleSubmitAssignment = async (assignmentId, submissionData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        alert('Please login again');
        return;
      }
      
      const formData = new FormData();
      formData.append('assignmentId', assignmentId);
      formData.append('studentId', user.id);
      formData.append('studentName', user.name);
      formData.append('text', submissionData.text || '');
      formData.append('CRcode', classData?.CRcode);
      
      if (submissionData.file) {
        // Convert base64 to blob for FormData
        const byteCharacters = atob(submissionData.file.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: submissionData.file.contentType });
        formData.append('file', blob, submissionData.file.originalName);
      }
      
      const response = await fetch('http://localhost:4000/fetures/submit-assignment', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert("Assignment submitted successfully");
        await fetchClassroomData(); // Refresh data
      } else {
        alert(result.msg || "Failed to submit assignment");
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert("Network error. Please try again.");
    }
  };

  if (activeTest) {
    return (
      <TestInterface
        test={activeTest}
        onExit={handleExitTest}
        classData={classData}
      />
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        onSelectMenu={(menu) => setActiveMenu(menu)}
        isTeacher={isTeacher}
        classData={classData}
        activeMenu={activeMenu}
      />

      {activeMenu === "feedback" ? (
        <div
          style={{
            marginLeft: "270px",
            marginTop: "60px",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "40px",
            backgroundColor: "white",
          }}
        >
          <div style={{ width: "100%", maxWidth: "600px" }}>
            <h3
              style={{
                marginBottom: "30px",
                color: "#374151",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              Submit Feedback
            </h3>
            <Feedback onCreate={handleCreateFeedback} classData={classData} />
          </div>
        </div>
      )  : activeMenu === "attendence" && isTeacher ? (
        <div
          style={{
            marginLeft: "270px",
            marginTop: "60px",
            flex: 1,
            padding: "20px",
            backgroundColor: "#f8f9fa",
          }}
        >
       <Grid students={students} onSaveAttendance={handleSaveAttendance} classData={classData} />

        </div>
      ) : (
        <div
          style={{
            marginLeft: "270px",
            marginTop: "60px",
            flex: 1,
            display: "flex",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div
            style={{
              width: isTeacher ? "50%" : "100%",
              maxWidth: isTeacher ? "none" : "800px",
              margin: isTeacher ? "0" : "0 auto",
              padding: "20px",
              overflowY: "auto",
              backgroundColor: "#f8f9fa",
              borderRight: isTeacher ? "1px solid #e5e7eb" : "none",
            }}
          >
            {activeMenu === "dashboard" && (
              <div>
                <h3 style={{ marginBottom: "20px", color: "#374151" }}>
                  Recent Posts - {classData?.CRName || classData?.name}
                </h3>
                {loading ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#888",
                      marginTop: "50px",
                    }}
                  >
                    <p>Loading posts...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#888",
                      marginTop: "50px",
                    }}
                  >
                    <p>
                      No posts yet.{" "}
                      {isTeacher
                        ? "Create your first post!"
                        : "Check back later for posts."}
                    </p>
                  </div>
                ) : (
                  posts
                    .filter(
                      (post) =>
                        !post.scheduleTime ||
                        new Date() >= new Date(post.scheduleTime)
                    )
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt || b._id) -
                        new Date(a.createdAt || a._id)
                    )
                    .map((post) => (
                      <div
                        key={post._id || post.id}
                        style={{ marginBottom: "16px" }}
                      >
                        <PostDisplay
                          post={post}
                          classData={classData}
                          onCommentAdded={handleAddComment}
                        />
                      </div>
                    ))
                )}
              </div>
            )}

            {activeMenu === "assignments" && (
              <div>
                <h3 style={{ marginBottom: "20px", color: "#374151" }}>
                  Assignments - {classData?.CRName || classData?.name}
                </h3>
                {loading ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#888",
                      marginTop: "50px",
                    }}
                  >
                    <p>Loading assignments...</p>
                  </div>
                ) : classroomAssignments.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#888",
                      marginTop: "50px",
                    }}
                  >
                    <p>
                      No assignments yet.{" "}
                      {isTeacher
                        ? "Create your first assignment!"
                        : "Check back later for assignments."}
                    </p>
                  </div>
                ) : (
                  classroomAssignments
                    .filter(
                      (assignment) =>
                        !assignment.scheduleTime ||
                        new Date() >= new Date(assignment.scheduleTime)
                    )
                    .map((assignment) => (
                      <div
                        key={assignment._id || assignment.id}
                        style={{ marginBottom: "16px" }}
                      >
                        <AssignmentDisplay
                          assignment={assignment}
                          isTeacher={isTeacher}
                          classData={classData}
                          onCommentAdded={handleAddComment}
                          onViewSubmissions={(assignmentId, submissions) =>
                            handleViewSubmissions(assignmentId, submissions)
                          }
                          showSubmissions={showSubmissions}
                          setShowSubmissions={setShowSubmissions}
                          submissions={selectedAssignmentSubmissions}
                          onSubmit={(submissionData) =>
                            handleSubmitAssignment(
                              assignment._id,
                              submissionData
                            )
                          }
                        />
                      </div>
                    ))
                )}
              </div>
            )}

            {activeMenu === "tests" && (
              <div>
                <h3 style={{ marginBottom: "20px", color: "#374151" }}>
                  Tests - {classData?.CRName || classData?.name}
                </h3>
                {loading ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#888",
                      marginTop: "50px",
                    }}
                  >
                    <p>Loading tests...</p>
                  </div>
                ) : classroomTests.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#888",
                      marginTop: "50px",
                    }}
                  >
                    <p>
                      No tests yet.{" "}
                      {isTeacher
                        ? "Create your first test!"
                        : "Check back later for tests."}
                    </p>
                  </div>
                ) : (
                  classroomTests
                    .filter(
                      (test) =>
                        isTeacher ||
                        !test.expireTime ||
                        new Date() <= new Date(test.expireTime)
                    )
                    .map((test) => (
                      <div
                        key={test._id || test.id}
                        style={{ marginBottom: "16px" }}
                      >
                        <TestDisplay
                          test={test}
                          onStartTest={handleStartTest}
                          classData={classData}
                          onCommentAdded={handleAddComment}
                        />
                      </div>
                    ))
                )}
              </div>
            )}

            {activeMenu === "classes" && (
              <div>
                <h3 style={{ marginBottom: "20px", color: "#374151" }}>
                  Class Meetings - {classData?.CRName || classData?.name}
                </h3>
                {loading ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#888",
                      marginTop: "50px",
                    }}
                  >
                    <p>Loading meetings...</p>
                  </div>
                ) : meetings.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#888",
                      marginTop: "50px",
                    }}
                  >
                    <p>
                      No meetings yet.{" "}
                      {isTeacher
                        ? "Schedule your first meeting!"
                        : "Check back later for meetings."}
                    </p>
                  </div>
                ) : (
                  <ClassDisplay meetings={meetings} />
                )}
              </div>
            )}
          </div>

          {isTeacher && (
            <div
              style={{
                width: "50%",
                padding: "20px",
                overflowY: "auto",
                backgroundColor: "white",
              }}
            >
              {activeMenu === "dashboard" && (
                <div>
                  <h3 style={{ marginBottom: "20px", color: "#374151" }}>
                    Create Post
                  </h3>
                  <PostForm onCreate={handleCreatePost} classData={classData} />
                </div>
              )}

              {activeMenu === "assignments" && (
                <div>
                  <h3 style={{ marginBottom: "20px", color: "#374151" }}>
                    Create Assignment
                  </h3>
                  <AssignmentForm
                    onCreate={handleCreateAssignment}
                    classData={classData}
                  />
                </div>
              )}

              {activeMenu === "tests" && (
                <div>
                  <h3 style={{ marginBottom: "20px", color: "#374151" }}>
                    Create Test
                  </h3>
                  <Test onCreate={handleCreateTest} classData={classData} />
                </div>
              )}

              {activeMenu === "classes" && (
                <div>
                  <h3 style={{ marginBottom: "20px", color: "#374151" }}>
                    Schedule Meeting
                  </h3>
                  <Class onCreate={handleCreateMeeting} classData={classData} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MainFile;
