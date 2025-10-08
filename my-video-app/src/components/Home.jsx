import React, { useState } from 'react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const features = [
    {
      id: 1,
      name: "Create & Join Classrooms",
      description: "Teachers can create virtual classrooms with unique codes. Students join easily using classroom codes for secure access.",
      image: "/img2.png"
    },
    {
      id: 2,
      name: "Assignments & Tests",
      description: "Create assignments with file uploads, interactive tests with multiple question types, and automated grading system.",
      image: "/img2.png"
    },
    {
      id: 3,
      name: "Live Video Classes",
      description: "Conduct HD video classes with screen sharing, real-time chat, and automatic attendance tracking for students.",
      image: "/img2.png"
    },
    {
      id: 4,
      name: "Material Sharing",
      description: "Upload and share study materials, documents, and resources. Schedule material releases for organized learning.",
      image: "/img2.png"
    },
    {
      id: 5,
      name: "Attendance Tracking",
      description: "Smart attendance marking during live classes. Generate detailed attendance reports and analytics for teachers.",
      image: "/img2.png"
    },
    {
      id: 6,
      name: "Feedback System",
      description: "Students can submit feedback with ratings and suggestions. Teachers get valuable insights for improvement.",
      image: "/img2.png"
    },
    {
      id: 7,
      name: "Post Management",
      description: "Create and share posts with content, files, links, and YouTube videos. Schedule posts and manage announcements.",
      image: "/img2.png"
    },
    {
      id: 8,
      name: "Recording & Playback",
      description: "Record live sessions for later review. Students can access recorded classes anytime for revision and study.",
      image: "/img2.png"
    },
    {
      id: 9,
      name: "Chat & Communication",
      description: "Real-time messaging system with file sharing and group discussions for enhanced classroom collaboration.",
      image: "/img2.png"
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
    <div className="min-h-screen bg-[#F8F8F8]">

      <div className="border-2 border-[#356AC3] bg-[#F8F8F8] h-[60px] flex items-center justify-between px-6 mb-4">
        <div className='flex items-center gap-3'>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
            <img src="/LOGO.png" alt="Vision Classroom" className="w-8 h-8 object-contain" />
          </div>
          <h4 className="text-[#356AC3] font-semibold text-xl">Vision Classroom</h4>
        </div>
        <div className="flex gap-3">
          <a href="/login" className="px-4 py-2 border border-[#356AC3] text-[#356AC3] rounded-lg hover:bg-[#356AC3] hover:text-white transition duration-200 text-decoration-none">Login</a>
          <a href="/singup" className="px-4 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-blue-700 transition duration-200 text-decoration-none">Start Teaching</a>
        </div>
      </div>


      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Welcome to <span className="text-[#356AC3]">Vision Classroom</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your teaching experience with our innovative digital classroom platform.
            </p>
            <a href="/singup" className="inline-block px-8 py-4 bg-[#356AC3] text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-200">
              Get Started
            </a>
          </div>
          <div> 
            <img src="/img2.png" alt="Classroom" className="w-full h-auto rounded-lg shadow-lg"/>
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


      <div className="bg-[#356AC3] text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4">
            <p>Made by Shivam Kumar</p>
            <a href="https://www.linkedin.com/in/shivam-kumar-321810324/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition duration-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;