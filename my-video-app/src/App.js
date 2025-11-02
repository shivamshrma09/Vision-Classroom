import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import { initGA, trackPageView } from "./utils/analytics";
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

import Home from "./components/Home";
import Login from "./components/Login";
import Singup from "./components/Singup";
import OAuthCallback from "./components/OAuthCallback";

import MainFile from "./components/MainFile";
import Classroomenter from "./components/Classroomenter";
import ProtectedRoute from "./components/ProtectedRoute";
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





export default function App() {
  useEffect(() => {
    // Initialize Google Analytics
    initGA();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Singup" element={<Singup />} />
        <Route path="/auth/google/callback" element={<OAuthCallback />} />
        <Route path="/auth/linkedin/callback" element={<OAuthCallback />} />


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
   

      </Routes>
    </Router>
  );
}


