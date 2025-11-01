import React, { useState } from 'react';

const SeeInActionDemo = () => {
  const [activeOption, setActiveOption] = useState('posts');
  
  const demoOptions = {
    posts: {
      title: "Smart Posts Management",
      description: "Create and share engaging posts with multimedia content, schedule announcements, and manage classroom communications effectively. Share updates, resources, and important information with rich text formatting, file attachments, and scheduled posting capabilities.",
      image: "/demo-posts.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" /></svg>,
      features: ["Rich text editor with formatting", "File and media attachments", "Scheduled posting", "Student engagement tracking"]
    },
    assignments: {
      title: "Assignment Creation & Management",
      description: "Design comprehensive assignments with multiple question types, file uploads, and automated grading. Set deadlines, track submissions, and provide detailed feedback to students with our intuitive assignment management system.",
      image: "/demo-assignments.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h4a2 2 0 002-2V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>,
      features: ["Multiple question types", "File upload support", "Automated grading", "Deadline management", "Plagiarism detection"]
    },
    attendance: {
      title: "Smart Attendance Tracking",
      description: "Automatically track student attendance during live classes with intelligent monitoring. Generate detailed reports, view attendance patterns, and send notifications to parents about student participation.",
      image: "/demo-attendance.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/></svg>,
      features: ["Real-time attendance marking", "Automated reports generation", "Parent notifications", "Attendance analytics", "Absence tracking"]
    },
    tests: {
      title: "Interactive Testing Platform",
      description: "Create engaging tests with multiple choice, short answer, and essay questions. Real-time monitoring, anti-cheating measures, and instant results help maintain academic integrity while providing immediate feedback.",
      image: "/demo-tests.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
      features: ["Multiple question formats", "Anti-cheating measures", "Instant results", "Time management", "Detailed analytics"]
    },
    materials: {
      title: "Study Material Storage",
      description: "Organize and share study materials with cloud storage integration. Upload documents, videos, and resources with categorization and search functionality for easy access by students.",
      image: "/demo-materials.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2z" clipRule="evenodd" /></svg>,
      features: ["Cloud storage integration", "File categorization", "Advanced search", "Version control", "Access permissions"]
    },
    todo: {
      title: "Task & Todo Management",
      description: "Keep track of assignments, deadlines, and important tasks with our integrated todo system. Students and teachers can manage their schedules and never miss important deadlines.",
      image: "/demo-todo.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>,
      features: ["Task prioritization", "Deadline reminders", "Progress tracking", "Calendar integration", "Team collaboration"]
    },
    classes: {
      title: "Live Class Management",
      description: "Conduct interactive live classes with HD video, screen sharing, and real-time collaboration tools. Schedule classes, manage participants, and record sessions for later review.",
      image: "/demo-classes.png",
      icon: <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/></svg>,
      features: ["HD video streaming", "Screen sharing", "Interactive whiteboard", "Session recording", "Participant management"]
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
            <h3 className="text-2xl font-bold text-gray-800">
              {demoOptions[activeOption].title}
            </h3>
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
                <span className="text-gray-700">{feature}</span>
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
      image: "/video.png"
    },
    {
      id: 4,
      name: "Material Sharing",
      description: "Upload and share study materials, documents, and resources. Schedule material releases for organized learning.",
      image: "/materials.png"
    },
    {
      id: 5,
      name: "Attendance Tracking",
      description: "Smart attendance marking during live classes. Generate detailed attendance reports and analytics for teachers.",
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
      image: "/chat.png"
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
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              The Future of <span className="text-[#356AC3]">Digital Learning</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Create interactive virtual classrooms, conduct live sessions, manage assignments, and connect with students seamlessly - all in one powerful platform.
            </p>
            <a href="/singup" className="inline-block px-6 py-3 bg-[#356AC3] text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition duration-200">
              Start Teaching Now
            </a>
          </div>
          <div className="-ml-8 overflow-hidden relative">
            {/* Decorative Shapes */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#356AC3] rounded-full opacity-80"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-[#356AC3] transform rotate-45 opacity-60"></div>
            <div className="absolute -bottom-3 -left-6 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-[#356AC3] opacity-70"></div>
            <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-[#356AC3] opacity-50"></div>
            <div className="absolute top-1/2 -left-8 w-4 h-4 bg-[#356AC3] rounded-full opacity-40"></div>
            <div className="absolute top-1/4 -right-8 w-6 h-6 bg-[#356AC3] transform rotate-45 opacity-50"></div>
            
            {/* Image without border */}
            <div className="rounded-lg overflow-hidden">
              <img src="/banner.png" alt="Classroom" className="w-full h-auto scale-110"/>
            </div>
          </div>
        </div>
        </div>
      </div>


      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Our Features</h2>
          <p className="text-center text-gray-600 mb-12">Everything you need for modern digital teaching</p>
          

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
                {getCurrentFeatures().map((feature) => (
                  <div 
                    key={feature.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
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
            <h2 className="text-4xl font-bold text-gray-800 mb-2">See in Action</h2>
            <p className="text-lg text-gray-600">Explore our platform features with interactive demos</p>
          </div>
          
          <SeeInActionDemo />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h2>
            <p className="text-base text-gray-600">Get answers to common questions about our platform</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-1">How do I create a virtual classroom?</h3>
                <p className="text-sm text-gray-600">Simply sign up as a teacher, click on "Create Classroom" and follow the easy setup process. You'll get a unique classroom code to share with your students.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-1">Can students join from any device?</h3>
                <p className="text-sm text-gray-600">Yes! Our platform works on computers, tablets, and smartphones. Students can join classes from any device with an internet connection.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-1">Is there a limit on the number of students?</h3>
                <p className="text-sm text-gray-600">Our basic plan supports up to 50 students per classroom. For larger classes, we offer premium plans with unlimited student capacity.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-1">How does the attendance tracking work?</h3>
                <p className="text-sm text-gray-600">Attendance is automatically tracked when students join live sessions. Teachers can also manually mark attendance and generate detailed reports.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-1">Can I record my classes?</h3>
                <p className="text-sm text-gray-600">Yes! All live sessions can be recorded and saved for students to review later. Recordings are stored securely in your classroom dashboard.</p>
              </div>
            </div>
          </div>
        </div>
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