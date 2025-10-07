import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  StreamTheme,
  SpeakerLayout,
  CallControls,
  PaginatedGridLayout,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./index.css";
import HomePage from "./components/HomePage";
import MeetingRoom from "./components/MeetingRoom";
import Home from "./components/Home";
import Login from "./components/Login";
import Singup from "./components/Singup";

import Sidebar from "./components/Sidebar";
import ClassroomCard from "./components/creathoe";
import MainFile from "./components/MainFile";
import Post from "./components/Post";
import Assignment from "./components/Assignment";
import Test from "./components/Test";
import Classroomenter from "./components/Classroomenter";
import ProtectedRoute from "./components/ProtectedRoute";
import Grid from "./components/Grid";
import ClassroomAccessGuard from "./components/ClassroomAccessGuard";

const apiKey = "vr4rvjh8nsed";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcjEifQ.ynOjs1qTtIEw7Tkn6NW3E7QJy9PsQ4wxi-GsNG49dXE";
const userId = "user1";

const user = {
  id: userId,
  name: "Shivam Kumar",
  image: `https://getstream.io/random_svg/?id=${userId}&name=Shivam`,
};

const client = new StreamVideoClient({ apiKey, user, token });

// Video Meeting Page Component
function VideoMeetingPage() {
  const navigate = useNavigate();

  const createMeeting = async () => {
    const newCallId = `meeting-${Date.now()}`;
    navigate(`/meeting/${newCallId}`);
  };

  const joinMeeting = async (meetingId) => {
    if (meetingId.trim()) {
      navigate(`/meeting/${meetingId}`);
    }
  };

  return (
    <HomePage
      onCreateMeeting={createMeeting}
      onJoinMeeting={joinMeeting}
      onScheduleMeeting={() => console.log("Schedule meeting")}
    />
  );
}

// Meeting Component
function Meeting({ meetingId }) {
  const [call, setCall] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const joinCall = async () => {
      try {
        const newCall = client.call("default", meetingId);
        await newCall.join({ create: true });
        setCall(newCall);
        setIsInCall(true);
      } catch (error) {
        alert("Unable to join meeting");
        navigate("/");
      }
    };
    joinCall();
  }, [meetingId, navigate]);

  const leaveMeeting = () => {
    call?.leave();
    setCall(null);
    setIsInCall(false);
    navigate("/");
  };

  if (!isInCall || !call) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
          color: "white",
        }}
      >
        <div>Joining meeting...</div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MeetingRoom callId={meetingId} onLeaveMeeting={leaveMeeting} />
      </StreamCall>
    </StreamVideo>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Singup" element={<Singup />} />

        <Route path="/Post" element={<Post />} />
        {/* <Route path="/Assignment" element={<Assignment />} />
        <Route path="/Test" element={<Test />} />

        <Route path="/Sidebar" element={<Sidebar />} /> */}
        <Route path="/classroom"     element={
            <ProtectedRoute>
              <Classroomenter />
            </ProtectedRoute>
          } />
        <Route path="/classrooms/:classroomId"  element={
            <ProtectedRoute>
              <ClassroomAccessGuard>
                <MainFile />
              </ClassroomAccessGuard>
            </ProtectedRoute>
          }  />
   
        <Route path="/video-meeting" element={<VideoMeetingPage />} />
                <Route path="grid" element={<Grid />} />

        <Route path="/meeting/:meetingId" element={<MeetingWrapper />} />
      </Routes>
    </Router>
  );
}

// Wrapper to get meetingId from URL params
function MeetingWrapper() {
  const { meetingId } = useParams();
  return <Meeting meetingId={meetingId} />;
}
