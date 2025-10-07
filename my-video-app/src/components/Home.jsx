import React, { useState } from 'react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const features = [
    {
      id: 1,
      name: "Create Classroom",
      description: "Teachers can create virtual classrooms with unique codes. Generate classroom codes automatically and manage multiple classes efficiently.",
      image: "/img2.png"
    },
    {
      id: 2,
      name: "Join Classroom",
      description: "Students can join classrooms using unique classroom codes. Simple and secure access to virtual learning environments.",
      image: "/img2.png"
    },
    {
      id: 3,
      name: "Post Management",
      description: "Create and share posts with content, files, links, and YouTube videos. Schedule posts and manage classroom announcements.",
      image: "/img2.png"
    },
    {
      id: 4,
      name: "Assignment System",
      description: "Create assignments with file uploads, set deadlines, and track submissions. Automated grading and feedback system.",
      image: "/img2.png"
    },
    {
      id: 5,
      name: "Material Sharing",
      description: "Upload and share study materials, documents, and resources. Organize materials by subject and schedule releases.",
      image: "/img2.png"
    },
    {
      id: 6,
      name: "Test Generator",
      description: "Create interactive tests with multiple question types including MCQs, file uploads, and rating scales. Automated scoring.",
      image: "/img2.png"
    },
    {
      id: 7,
      name: "Live Video Classes",
      description: "Conduct HD video classes with multiple participants, screen sharing, and real-time interaction capabilities.",
      image: "/img2.png"
    },
    {
      id: 8,
      name: "Attendance Tracking",
      description: "Automatic attendance marking during live classes. Generate detailed attendance reports and analytics for teachers.",
      image: "/img2.png"
    },
    {
      id: 9,
      name: "Chat & Communication",
      description: "Real-time messaging system with emoji reactions, file sharing, and group discussions for enhanced collaboration.",
      image: "/img2.png"
    },
    {
      id: 10,
      name: "Recording & Playback",
      description: "Record live sessions for later review. Students can access recorded classes anytime for revision and study.",
      image: "/img2.png"
    },
    {
      id: 11,
      name: "User Management",
      description: "Comprehensive user profiles for teachers and students. Track classroom participation and academic progress.",
      image: "/img2.png"
    },
    {
      id: 12,
      name: "File Management",
      description: "Upload, store and manage files in Base64 format. Support for multiple file types including documents and media.",
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
      {/* Header */}
      <div className="border-2 border-[#356AC3] bg-[#F8F8F8] h-[60px] flex items-center justify-between px-6 mb-4">
        <div className='flex items-center gap-3'>
          <div className="w-12 h-12 rounded-full bg-[#356AC3] flex items-center justify-center">
            <h4 className="text-white font-bold text-lg">CM</h4>
          </div>
          <h4 className="text-[#356AC3] font-semibold text-xl">Classroom Mitra</h4>
        </div>
        <div className="flex gap-3">
          <a href="/login" className="px-4 py-2 border border-[#356AC3] text-[#356AC3] rounded-lg hover:bg-[#356AC3] hover:text-white transition duration-200 text-decoration-none">Login</a>
          <a href="/Singup" className="px-4 py-2 bg-[#356AC3] text-white rounded-lg hover:bg-blue-700 transition duration-200 text-decoration-none">Start Teaching</a>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Welcome to <span className="text-[#356AC3]">Classroom Mitra</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your teaching experience with our innovative digital classroom platform.
            </p>
            <button className="px-8 py-4 bg-[#356AC3] text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-200">
              Get Started
            </button>
          </div>
          <div> 
            <img src="/img2.png" alt="Classroom" className="w-full h-auto rounded-lg shadow-lg"/>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Our Features</h2>
          <p className="text-center text-gray-600 mb-12">Everything you need for modern digital teaching</p>
          
          {/* Features Carousel */}
          <div className="relative">
            {/* Navigation Arrows */}
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

            {/* Cards Container */}
            <div className="mx-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getCurrentFeatures().map((feature) => (
                  <div 
                    key={feature.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    {/* Card Image */}
                    <div className="w-full h-48 bg-gray-100">
                      <img 
                        src={feature.image} 
                        alt={feature.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Card Body */}
                    <div className="p-6">
                      {/* Card Title */}
                      <h5 className="text-lg font-semibold text-gray-900 mb-3">
                        {feature.name}
                      </h5>
                      
                      {/* Card Text */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      
                      {/* Card Button */}
                      <button className="px-4 py-2 bg-[#356AC3] text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-200">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Indicators */}
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

      {/* Why Choose Us Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Classroom Mitra?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Experience the future of digital education with our innovative platform</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#356AC3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy to Use</h3>
              <p className="text-gray-600 text-sm">Intuitive interface that anyone can master in minutes</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600 text-sm">End-to-end encryption keeps your data safe</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">Optimized performance for smooth video calls</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Feature Rich</h3>
              <p className="text-gray-600 text-sm">Everything you need for effective online teaching</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Video Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">See It In Action</h2>
            <p className="text-xl text-gray-600">Watch how Classroom Mitra transforms online education</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              <video 
                className="w-full h-auto"
                controls
                poster="/img2.png"
              >
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Feedback Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What others have to say</h2>
            <p className="text-lg text-gray-600">Participate in these exceptional opportunities curated for the exceptional you!</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feedback Card 1 */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src="/img2.png" 
                    alt="Priya Sharma"
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Priya Sharma</h4>
                    <p className="text-sm text-gray-500">Mathematics Teacher</p>
                  </div>
                </div>
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  "Classroom Mitra has revolutionized my teaching. The interactive features keep my students engaged throughout the class."
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">24</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">2</span>
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">2 days ago</span>
                </div>
              </div>
            </div>

            {/* Feedback Card 2 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div className="flex items-start space-x-4">
                <img 
                  src="/img2.png" 
                  alt="Rajesh Kumar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">Rajesh Kumar</h4>
                    <div className="flex text-yellow-400">
                      <span>⭐⭐⭐⭐⭐</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">Science Teacher</p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 font-normal">
                    "The assignment management system saves me hours of work. Everything is automated and efficient."
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>18</span>
                      </button>
                      <button className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>1</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Card 3 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div className="flex items-start space-x-4">
                <img 
                  src="/img2.png" 
                  alt="Anita Patel"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">Anita Patel</h4>
                    <div className="flex text-yellow-400">
                      <span>⭐⭐⭐⭐⭐</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">English Teacher</p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 font-normal">
                    "My students love the interactive whiteboard and chat features. It makes learning fun and collaborative."
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>31</span>
                      </button>
                      <button className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>0</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Get answers to common questions</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border border-gray-200 rounded-lg">
              <button className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50">
                <span className="font-semibold text-gray-800">How do I create a classroom?</span>
                <span className="text-[#356AC3]">+</span>
              </button>
              <div className="px-6 pb-4 text-gray-600">
                Simply click on "Start Teaching" button, sign up for an account, and you'll get a unique classroom code to share with your students.
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <button className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50">
                <span className="font-semibold text-gray-800">Is Classroom Mitra free to use?</span>
                <span className="text-[#356AC3]">+</span>
              </button>
              <div className="px-6 pb-4 text-gray-600">
                Yes! We offer a free plan with basic features. Premium plans are available for advanced features and larger classrooms.
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <button className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50">
                <span className="font-semibold text-gray-800">What devices are supported?</span>
                <span className="text-[#356AC3]">+</span>
              </button>
              <div className="px-6 pb-4 text-gray-600">
                Classroom Mitra works on all devices - computers, tablets, and smartphones. No app download required, just use your web browser.
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <button className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50">
                <span className="font-semibold text-gray-800">How do students join my classroom?</span>
                <span className="text-[#356AC3]">+</span>
              </button>
              <div className="px-6 pb-4 text-gray-600">
                Share your unique classroom code with students. They can enter this code on our homepage to join your virtual classroom instantly.
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <button className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50">
                <span className="font-semibold text-gray-800">Can I record my classes?</span>
                <span className="text-[#356AC3]">+</span>
              </button>
              <div className="px-6 pb-4 text-gray-600">
                Yes! All live classes can be recorded and saved for later viewing. Students can access recordings anytime for revision.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#356AC3] text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 Classroom Mitra. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;