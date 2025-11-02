import React, { useState, useEffect } from 'react';
import { trackEvent, trackPageView } from '../utils/analytics';

// Add smooth scroll CSS
const smoothScrollStyle = `
  html {
    scroll-behavior: smooth;
  }
  
  .fade-in {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.8s ease-out forwards;
  }
  
  .fade-in-delay-1 {
    animation-delay: 0.2s;
  }
  
  .fade-in-delay-2 {
    animation-delay: 0.4s;
  }
  
  .fade-in-delay-3 {
    animation-delay: 0.6s;
  }
  
  .slide-in-left {
    opacity: 0;
    transform: translateX(-50px);
    animation: slideInLeft 0.8s ease-out forwards;
  }
  
  .slide-in-right {
    opacity: 0;
    transform: translateX(50px);
    animation: slideInRight 0.8s ease-out forwards;
  }
  
  .bounce-in {
    animation: bounceIn 1s ease-out;
  }
  
  .float {
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInLeft {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes bounceIn {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }
    50% {
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .card-hover {
    transition: all 0.3s ease;
  }
  
  .card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }
`;

const SeeInActionDemo = () => {
  const [activeOption, setActiveOption] = useState('posts');
  
  const demoOptions = {
    posts: {
      title: "Smart Posts Management",
      description: "Create and share engaging posts with multimedia content, schedule announcements, and manage classroom communications effectively. AI can write posts for you - just give topic and AI will create engaging content automatically.",
      image: "/demo-posts.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" /></svg>,
      features: ["AI-powered post writing", "Rich text editor with formatting", "File and media attachments", "Scheduled posting"]
    },
    assignments: {
      title: "Assignment Creation & Management",
      description: "Teachers can give assignments to students and students can submit them online. No more paperwork! Complete digital assignment management system for modern classrooms.",
      image: "/demo-assignments.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h4a2 2 0 002-2V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>,
      features: ["Online assignment submission", "File upload support", "No paperwork needed", "Deadline management", "AI grading (Coming Soon)"]
    },
    attendance: {
      title: "Smart Attendance Tracking",
      description: "Teachers can mark student attendance online from their phone or computer. Send short attendance emails to students with low attendance automatically.",
      image: "/demo-attendance.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/></svg>,
      features: ["Online attendance marking", "Mobile-friendly interface", "Email alerts for low attendance", "Student participation tracking", "Date-wise attendance records"]
    },
    tests: {
      title: "Interactive Testing Platform",
      description: "Create engaging tests with multiple choice, short answer, and essay questions. AI can make whole test on behalf of you - just give information about topic and difficulty level.",
      image: "/demo-tests.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
      features: ["AI-powered test generation", "Multiple question formats", "Anti-cheating measures", "Instant results", "Time management"]
    },
    materials: {
      title: "Study Material Storage",
      description: "You can now organize your materials easily. We are giving you a feature to organize and manage all your study materials, documents, and resources in one place.",
      image: "/demo-materials.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z" clipRule="evenodd" /></svg>,
      features: ["Easy material organization", "File categorization", "Advanced search", "Version control"]
    },
    todo: {
      title: "Task & Todo Management",
      description: "Keep track of assignments, deadlines, and important tasks with our integrated todo system. Students and teachers can manage their schedules and never miss important deadlines.",
      image: "/todod.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>,
      features: ["Task prioritization", "Deadline reminders", "Progress tracking", "Calendar integration", "Team collaboration"]
    },
    classes: {
      title: "Live Class Management",
      description: "Conduct interactive live classes with HD video, screen sharing, and real-time collaboration tools. Schedule classes, manage participants, and record sessions for later review.",
      image: "/demo-classes.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/></svg>,
      features: ["HD video streaming", "Screen sharing", "Interactive whiteboard", "Session recording", "Participant management"],
      comingSoon: true
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Options Bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {Object.entries(demoOptions).map(([key, option]) => (
          <button
            key={key}
            onClick={() => setActiveOption(key)}
            className={`px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
              activeOption === key
                ? 'bg-[#356AC3] text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Content Display */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#356AC3] rounded-lg flex items-center justify-center">
              {demoOptions[activeOption].icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {demoOptions[activeOption].title}
              </h3>
              {demoOptions[activeOption].comingSoon && (
                <p className="text-red-500 text-sm font-medium">
                  Coming Soon
                </p>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            {demoOptions[activeOption].description}
          </p>
          
          <div className="space-y-3">
            {demoOptions[activeOption].features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className={`${feature.includes('Coming Soon') ? 'text-red-500' : 'text-gray-700'}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative">
          {/* Decorative Background Shapes */}
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#356AC3] opacity-20"></div>
          <div className="absolute -top-4 -right-8 w-12 h-12 bg-[#356AC3] rounded-full opacity-30"></div>
          <div className="absolute -bottom-8 -left-4 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-[#356AC3] opacity-25"></div>
          <div className="absolute -bottom-6 -right-6 w-14 h-14 bg-[#356AC3] transform rotate-45 opacity-20"></div>
          <div className="absolute top-1/3 -left-10 w-10 h-10 bg-[#356AC3] rounded-full opacity-15"></div>
          <div className="absolute top-2/3 -right-10 w-12 h-12 bg-[#356AC3] opacity-25"></div>
          <div className="absolute top-1/2 -left-12 w-8 h-8 bg-[#356AC3] transform rotate-45 opacity-20"></div>
          
          {/* Image without border */}
          <div className="bg-white rounded-lg shadow-lg p-4 relative z-10">
            <img 
              src={demoOptions[activeOption].image} 
              alt={demoOptions[activeOption].title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Add smooth scroll styles to document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = smoothScrollStyle;
    document.head.appendChild(styleElement);
    
    // Track page view
    trackPageView('/home');
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  const features = [
    {
      id: 1,
      name: "Create & Join Classrooms",
      description: "Teachers can create virtual classrooms with unique codes. Students join easily using classroom codes for secure access.",
      image: "/classroom.png"
    },
    {
      id: 2,
      name: "Assignments & Tests",
      description: "Create assignments with file uploads, interactive tests with multiple question types, and automated grading system.",
      image: "/assignment.png"
    },
    {
      id: 3,
      name: "Live Video Classes",
      description: "Conduct HD video classes with screen sharing, real-time chat, and automatic attendance tracking for students.",
      image: "/video.png",
      comingSoon: true
    },
    {
      id: 4,
      name: "Material Storage",
      description: "Store your study materials, documents, and resources securely. Teachers can organize and manage all educational content in one place.",
      image: "/materials.png"
    },
    {
      id: 5,
      name: "Attendance Tracking",
      description: "Teachers can now mark attendance online from their phone or computer. Generate detailed attendance reports and analytics easily.",
      image: "/attendance.png"
    },
    {
      id: 6,
      name: "Feedback System",
      description: "Students can submit feedback with ratings and suggestions. Teachers get valuable insights for improvement.",
      image: "/feedback.png"
    },
    {
      id: 7,
      name: "Post Management",
      description: "Create and share posts with content, files, links, and YouTube videos. Schedule posts and manage announcements.",
      image: "/posts.png"
    },
    {
      id: 8,
      name: "Recording & Playback",
      description: "Record live sessions for later review. Students can access recorded classes anytime for revision and study.",
      image: "/recording.png"
    },
    {
      id: 9,
      name: "Chat & Communication",
      description: "Real-time messaging system with file sharing and group discussions for enhanced classroom collaboration.",
      image: "/chatsjsj.png"
    }
  ];

  const cardsPerSlide = 3;
  const totalSlides = Math.ceil(features.length / cardsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentFeatures = () => {
    const start = currentSlide * cardsPerSlide;
    return features.slice(start, start + cardsPerSlide);
  };

  return (
    <div className="min-h-screen bg-white pt-16">

      <div className="bg-white h-[60px] flex items-center justify-between px-6 mb-4 shadow-md fixed top-0 left-0 right-0 z-50">
        <div className='flex items-center gap-3'>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
            <img src="/CM.png" alt="Classroom Mitra" className="w-8 h-8 object-contain" />
          </div>
          <h4 className="text-[#356AC3] font-semibold text-xl">Classroom Mitra</h4>
        </div>
        
        <div className="flex gap-2">
          <a href="#faq" className="text-gray-700 hover:text-[#356AC3] transition duration-200 font-medium text-sm">FAQ</a>
          <a href="#features" className="text-gray-700 hover:text-[#356AC3] transition duration-200 font-medium text-sm">Features</a>
          <a href="#demo" className="text-gray-700 hover:text-[#356AC3] transition duration-200 font-medium text-sm">Demo</a>
        </div>
        
        <div className="flex gap-2">
          <a href="/login" className="px-3 py-1.5 text-sm border border-[#356AC3] text-[#356AC3] rounded hover:bg-[#356AC3] hover:text-white transition duration-200 text-decoration-none">Login</a>
          <a href="/singup" className="px-3 py-1.5 text-sm bg-[#356AC3] text-white rounded hover:bg-blue-700 transition duration-200 text-decoration-none">Start Teaching</a>
        </div>
      </div>


      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="slide-in-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 fade-in">
              Manage Your <span className="text-[#356AC3]">Classroom Digitally</span>
            </h1>
            <p className="text-lg text-gray-600 mb-4 fade-in fade-in-delay-1">
              WhatsApp is not for education - Create interactive virtual classrooms, conduct live sessions, manage assignments, and connect with students seamlessly - all in one powerful platform.
            </p>

            <a href="/singup" className="inline-block px-6 py-3 bg-[#356AC3] text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 fade-in fade-in-delay-2" onClick={() => trackEvent('click', 'CTA', 'Hero Start Teaching')}>
              Start Teaching Now
            </a>
          </div>
          <div className="-ml-8 overflow-hidden relative slide-in-right">
            {/* Decorative Shapes */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#356AC3] rounded-full opacity-80 bounce-in float"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-[#356AC3] transform rotate-45 opacity-60 bounce-in float" style={{animationDelay: '0.2s'}}></div>
            <div className="absolute -bottom-3 -left-6 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-[#356AC3] opacity-70 bounce-in float" style={{animationDelay: '0.4s'}}></div>
            <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-[#356AC3] opacity-50 bounce-in float" style={{animationDelay: '0.6s'}}></div>
            <div className="absolute top-1/2 -left-8 w-4 h-4 bg-[#356AC3] rounded-full opacity-40 bounce-in float" style={{animationDelay: '0.8s'}}></div>
            <div className="absolute top-1/4 -right-8 w-6 h-6 bg-[#356AC3] transform rotate-45 opacity-50 bounce-in float" style={{animationDelay: '1s'}}></div>
            
            {/* Image without border */}
            <div className="rounded-lg overflow-hidden fade-in fade-in-delay-3">
              <img src="/banner.png" alt="Classroom" className="w-full h-auto scale-110 hover:scale-115 transition-transform duration-500"/>
            </div>
          </div>
        </div>
        </div>
      </div>


      <div className="bg-white py-16">
        <div className="container mx-auto px-6">

          <h2 className="text-4xl font-bold text-center text-gray-800 mb-2 fade-in">Our Features</h2>
          <p className="text-center text-gray-600 mb-12 fade-in fade-in-delay-1">Everything you need for modern digital teaching - Beyond WhatsApp</p>
          

          <div className="relative">

            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#356AC3] text-white p-3 rounded-full hover:bg-blue-700 transition duration-200 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#356AC3] text-white p-3 rounded-full hover:bg-blue-700 transition duration-200 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>


            <div className="mx-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getCurrentFeatures().map((feature, index) => (
                  <div 
                    key={feature.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm card-hover overflow-hidden fade-in"
                    style={{animationDelay: `${index * 0.2}s`}}
                  >

                    <div className="w-full h-48 bg-gray-100">
                      <img 
                        src={feature.image} 
                        alt={feature.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    

                    <div className="p-6">

                      <h5 className="text-lg font-semibold text-gray-900 mb-3">
                        {feature.name}
                      </h5>
                      
                      {feature.comingSoon && (
                        <p className="text-red-500 text-sm font-medium mb-2">
                          Coming Soon
                        </p>
                      )}

                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      

                      <button className="px-4 py-2 bg-[#356AC3] text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-200">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition duration-200 ${
                    currentSlide === index ? 'bg-[#356AC3]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* See in Action Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2 fade-in">See in Action</h2>
            <p className="text-lg text-gray-600 fade-in fade-in-delay-1">Explore our platform features with interactive demos</p>
          </div>
          
          <SeeInActionDemo />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 fade-in">Frequently Asked Questions</h2>
            <p className="text-base text-gray-600 fade-in fade-in-delay-1">Get answers to common questions about our platform</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 fade-in hover:bg-gray-100 transition-colors duration-200">
                <h3 className="text-base font-semibold text-gray-800 mb-1">How do I create a virtual classroom?</h3>
                <p className="text-sm text-gray-600">Simply sign up as a teacher, click on "Create Classroom" and follow the easy setup process. You'll get a unique classroom code to share with your students.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 fade-in fade-in-delay-1 hover:bg-gray-100 transition-colors duration-200">
                <h3 className="text-base font-semibold text-gray-800 mb-1">Can students join from any device?</h3>
                <p className="text-sm text-gray-600">Yes! Our platform works on computers, tablets, and smartphones. Students can join classes from any device with an internet connection.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 fade-in fade-in-delay-2 hover:bg-gray-100 transition-colors duration-200">
                <h3 className="text-base font-semibold text-gray-800 mb-1">Is there a limit on the number of students?</h3>
                <p className="text-sm text-gray-600">Currently we are free! After January 2026, we will charge around $1 per year for one classroom. No student limits - unlimited students can join your classroom.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 fade-in fade-in-delay-3 hover:bg-gray-100 transition-colors duration-200">
                <h3 className="text-base font-semibold text-gray-800 mb-1">How does the attendance tracking work?</h3>
                <p className="text-sm text-gray-600">Teachers can mark student attendance online from their phone or computer. The system automatically tracks when students join live sessions and allows manual attendance marking for offline classes. Generate detailed attendance reports and send automated email alerts to students with low attendance.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 fade-in fade-in-delay-3 hover:bg-gray-100 transition-colors duration-200">
                <h3 className="text-base font-semibold text-gray-800 mb-1">Can I record my classes?</h3>
                <p className="text-sm text-gray-600">Yes! All live sessions can be recorded and saved for students to review later. Recordings are stored securely in your classroom dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-white py-8 text-center">
        <a href="/singup" className="inline-block px-6 py-2 bg-[#356AC3] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105" style={{boxShadow: '0 0 20px rgba(53, 106, 195, 0.3)'}}>
          Start Your Professional Classroom Today
        </a>
      </div>

      <div className="bg-white py-2 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Name */}
            <div className="flex items-center gap-3">
              <img src="/CM.png" alt="Classroom Mitra" className="w-8 h-8 object-contain" />
              <span className="font-semibold text-lg text-gray-800">Classroom Mitra</span>
            </div>
            
            {/* Center - Navigation Links */}
            <div className="flex items-center gap-6">
              <a href="mailto:classroommitra@gmail.com" className="text-gray-600 hover:text-[#356AC3] transition duration-200">Help</a>
              <a href="#privacy" className="text-gray-600 hover:text-[#356AC3] transition duration-200">Privacy</a>
              <a href="#terms" className="text-gray-600 hover:text-[#356AC3] transition duration-200">Terms</a>
              <a href="mailto:classroommitra@gmail.com" className="text-gray-600 hover:text-[#356AC3] transition duration-200">Contact</a>
            </div>
            
            {/* Right side - Social Links */}
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/in/shivam-kumar-321810324/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#356AC3] transition duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#telegram" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#356AC3] transition duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;