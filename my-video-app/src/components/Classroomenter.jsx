import React, { useState , useEffect } from "react";
import ClassroomCard from "./creathoe";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useUser } from "../hooks/useUser";

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_BASE_URL || "http://localhost:4000",
});

function Classroomenter() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'create' or 'join'
  const [cRcode, setCRcode] = useState("");
  const [classroomsdata, setClassroomsdata] = useState("");
  const [cRName, setCRName] = useState("");
  const [cRDescription, setCRDescription] = useState("");
  const [cRsubject, setCRsubject] = useState("");
const [userollnumber , setUserollnumber] = useState("");
  const { user, loading } = useUser();

  const handleCreateClass = () => {
    setModalType("create");
    setShowModal(true);
  };

  const handleJoinClass = () => {
    setModalType("join");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Pleaswe login first");
        return;
      }

      if (!user) {
        alert("Please login first");
        return;
      }

      const response = await axiosInstance.post("/classroom/creat-classroom", {
        adminname: user.name,
        adminId:   user._id,
        CRName: cRName,
        CRDescription: cRDescription,
        CRsubject: cRsubject,
      });
       console.log( user.id || user._id)
      console.log("classroom created  successfully:", response.data);
      alert("created  successful!");
      setShowModal(false);
      setCRName('');
      setCRDescription('');
      setCRsubject('');
      classroomdata(); // Refresh classroom data
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login failed!");
    }
  };

  const classroomdata = async () => {
    try {
      const response = await axiosInstance.post("/classroom/classroom-data", {
        userid: user.id || user._id,
      });
      const classroomData = response.data;
      setClassroomsdata(classroomData);
      console.log("Classroom data fetched:", response.data);
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      alert("Failed to fetch classroom data!");
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Pleaswe login first");
        return;
      }

      if (!user) {
        alert("Please login first");
        return;
      }



       
      
      const response = await axiosInstance.post("/classroom/join-classroom", {
        adminId: user._id,
        CRcode: cRcode,
        userollnumber:userollnumber
      });

      console.log("classroom join  successfully:", response.data);
      alert("join  successful!");
      setShowModal(false);
      setCRcode('');
      classroomdata(); // Refresh classroom data
    } catch (error) {
      console.error(" error:", error.response?.data || error.message);
      alert("join failed!");
    }
  };




useEffect(() => {
  if (user && !loading) {
    classroomdata();
  }
}, [user, loading]);




  return (
    <div>
      <Sidebar />
      <div
        style={{
          flex: 1,
          padding: "30px",
          backgroundColor: "#f8f9fa",
          marginLeft: 300,
          marginTop: -700,
        }}
      >

        {/* <button onClick={classroomdata} style={{marginBottom:20, padding: "10px 20px", backgroundColor: "#356AC3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"}}></button> */}
        {/* Plus Button */}
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            zIndex: 1000,
          }}
        >
          

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowModal(!showModal)}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#356AC3",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <span
                style={{ fontSize: "24px", color: "white", fontWeight: "bold" }}
              >
                +
              </span>
            </button>

            {showModal && (
              <div
                style={{
                  position: "absolute",
                  bottom: "70px",
                  right: "0",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  padding: "8px",
                  minWidth: "150px",
                }}
              >
                <button
                  onClick={handleCreateClass}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    backgroundColor: "transparent",
                    textAlign: "left",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#f5f5f5")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  Create Class
                </button>
                <button
                  onClick={handleJoinClass}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    backgroundColor: "transparent",
                    textAlign: "left",
                    cursor: "pointer",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#f5f5f5")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  Join Class
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: "24px",
            justifyItems: "center",
          }}
        >
          {/* <ClassroomCard classData={{
            name: "English Literature",
            createdDate: "December 8, 2024",
            studentCount: 22,
            classCode: "ENG12A",
            description: "Advanced English literature course focusing on classic and contemporary works for 12th grade students."
          }} /> */}

{classroomsdata?.classrooms?.map((classroom) => (
  <ClassroomCard
    key={classroom._id}
    classData={{
      _id: classroom._id,
      name: classroom.CRName,
      createdDate: new Date(classroom.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
      }),
      studentCount: classroom.students?.length || 0,
      classCode: classroom.CRcode,
      description: classroom.CRDescription,
      subject: classroom.CRsubject,
      adminName: classroom.adminname,
      adminId: classroom.adminId
    }}
  />
)) || []}

        </div>
      </div>

      {/* Modal */}
      {(modalType === "create" || modalType === "join") && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
                {modalType === "create" ? "Create Class" : "Join Class"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>×</span>
              </button>
            </div>

            <form onSubmit={modalType === 'create' ? handleSubmit : handleSubmit2}>
              {modalType === "create" ? (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}
                    >
                      Class Name
                    </label>
                    <input
                      type="text"
                      value={cRName}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                      placeholder="Enter class name"
                      required
                      onChange={(e) => setCRName(e.target.value)}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}
                    >
                      Description
                    </label>
                    <textarea
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                        minHeight: "80px",
                        resize: "vertical",
                      }}
                      placeholder="Enter class description"
                      required
                      value={cRDescription}
                      onChange={(e) => setCRDescription(e.target.value)}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      value={cRsubject}
                      onChange={(e) => setCRsubject(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                      placeholder="Enter subject"
                      required
                    />
                  </div>
                </>
              ) : (
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
          
                    Class Code
                  </label>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                    placeholder="Enter class code"
                    required
                    value={cRcode}
                    onChange={(e) => setCRcode(e.target.value)}
                  />













                   <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Enter yout  classroom rollnumber
                  </label>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                    placeholder="Enter class roll number"
                    required
                    value={userollnumber}
                    onChange={(e) => setUserollnumber(e.target.value)}
                  />




                </div>
              )}

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#356AC3",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                {modalType === "create" ? "Create Class" : "Join Class"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classroomenter;
