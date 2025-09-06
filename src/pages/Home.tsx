import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Zap, Shield, Globe, CheckCircle, Menu, X, Plus, Minus } from 'lucide-react';

// FAQ Item Component
const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
      >
        <h3 className="text-lg font-medium text-gray-900 pr-4">
          {question}
        </h3>
        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          {isOpen ? (
            <Minus className="h-4 w-4 text-gray-600" />
          ) : (
            <Plus className="h-4 w-4 text-gray-600" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2">
          <p className="text-gray-600 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold">
                <span className="text-black">Synergy</span> <span className="text-blue-900">Sphere</span>
              </span>
            </div>


            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-600 hover:text-gray-900 font-medium">
                Home
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium">
                About Us
              </a>
              <a href="#solutions" className="text-gray-600 hover:text-gray-900 font-medium">
                Features
              </a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 font-medium">
                FAQ
              </a>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
              >
                Try it free
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
                <a
                  href="#home"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About Us
                </a>
                <a
                  href="#solutions"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#faq"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </a>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 mt-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Try it free
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-white py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight handwritten">
              <span className="block">All your team's work on</span>
              <span className="block relative">
                <span className="highlight-yellow">one platform.</span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 handwritten">
              <span>Simple, efficient, and </span>
              <span className="highlight-blue">completely free!</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                to="/signup"
                className="btn bg-gray-900 text-white hover:bg-gray-800 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start now - It's free
              </Link>
              <a
                href="#demo"
                className="btn bg-gray-100 text-gray-900 hover:bg-gray-200 text-lg px-8 py-4 flex items-center gap-2 transition-all duration-200"
              >
                Watch Demo
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>

            {/* Pricing Annotation */}
            <div className="relative inline-block curved-arrow">
              <div className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transform rotate-2 shadow-lg handwritten">
                Free forever - No credit card required
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="solutions" className="bg-white py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Centralized
                <br />
                workspace.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Keep every project, file, discussion, and update in one simple, 
                searchable hub—no more scattered info.
              </p>
            </div>
            <div className="bg-gray-100 rounded-2xl p-12 h-80 flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-xl shadow-sm"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Live task boards.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Track tasks by status, due date, and assignee with fast, 
                mobile-friendly workflows and smooth drag-and-drop.
              </p>
            </div>
            <div className="lg:order-1 bg-gray-100 rounded-2xl p-12 h-80 flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Instant project chat.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Built-in threaded messaging so teams never miss an update—skip 
                the email chaos and stay aligned.
              </p>
            </div>
            <div className="bg-gray-100 rounded-2xl p-12 h-80 flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-sm shadow-sm transform rotate-45"></div>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section id="faq" className="bg-white py-8 md:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <FAQItem 
              question="How do I get started?"
              answer="Getting started is simple! Just sign up for a free account, create your first project, and invite your team members. You can start with our guided setup wizard or jump right in and explore the features. We also provide comprehensive tutorials and 24/7 support to help you get the most out of SynergySphere."
            />
            
            <FAQItem 
              question="Is SynergySphere really free to use?"
              answer="Yes! SynergySphere is completely free forever with no hidden costs, credit card requirements, or time limits. You get access to all core features including project management, task tracking, team collaboration, and communication tools at no cost."
            />
            
            <FAQItem 
              question="What makes SynergySphere different from other tools?"
              answer="SynergySphere goes beyond traditional project management by providing intelligent automation, real-time collaboration, and proactive issue detection. Unlike other tools that simply organize tasks, SynergySphere acts as your team's central nervous system, helping you stay ahead of problems and work more efficiently together."
            />
            
            <FAQItem 
              question="Is SynergySphere mobile friendly?"
              answer="Absolutely! SynergySphere is built mobile-first and works seamlessly across all devices. You can manage projects, assign tasks, track progress, and communicate with your team from anywhere using our responsive web app that adapts perfectly to your phone, tablet, or desktop."
            />
            
            <FAQItem 
              question="Can I integrate with other tools I'm already using?"
              answer="Yes! SynergySphere integrates with popular tools like Slack, Google Workspace, Microsoft Teams, and many others. Our API also allows for custom integrations with your existing workflow tools, ensuring a smooth transition without disrupting your current processes."
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-white py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Decorative Elements */}
            <div className="relative mb-8">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div className="w-3 h-3 bg-orange-300 rounded-full transform rotate-12"></div>
                <div className="w-3 h-3 bg-orange-300 rounded-full transform -rotate-12"></div>
                <div className="w-3 h-3 bg-orange-300 rounded-full transform rotate-12"></div>
              </div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-x-16 flex space-x-1">
                <div className="w-2 h-0.5 bg-orange-300 transform rotate-45"></div>
                <div className="w-2 h-0.5 bg-orange-300 transform -rotate-45"></div>
              </div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 translate-x-16 flex space-x-1">
                <div className="w-2 h-0.5 bg-orange-300 transform rotate-45"></div>
                <div className="w-2 h-0.5 bg-orange-300 transform -rotate-45"></div>
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="text-5xl md:text-7xl font-bold mb-8 handwritten">
              <span className="block text-gray-900">Unleash</span>
              <span className="block text-blue-600">your team's potential</span>
            </h2>

            {/* CTA Button */}
            <div className="mb-8">
              <Link
                to="/signup"
                className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Start now - It's free
              </Link>
            </div>

            {/* Supporting Information */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-6 text-blue-600">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-gray-600 text-sm space-y-1">
                <p>No credit card required</p>
                <p>Instant access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start">
            {/* Company Info */}
            <div className="mb-4 lg:mb-0 lg:mr-16">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold">
                  <span className="text-black">Synergy</span> <span className="text-blue-900">Sphere</span>
                </span>
              </div>
            </div>

            {/* Vertical Line */}
            <div className="hidden lg:block w-px h-24 bg-gray-200 mr-16"></div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/signup" className="text-gray-600 hover:text-gray-900 text-sm">
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/#work" className="text-gray-600 hover:text-gray-900 text-sm">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <a href="#faq" className="text-gray-600 hover:text-gray-900 text-sm">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/#about" className="text-gray-600 hover:text-gray-900 text-sm">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <a href="mailto:hello@synergysphere.com" className="text-gray-600 hover:text-gray-900 text-sm">
                      hello@synergysphere.com
                    </a>
                  </li>
                  <li>
                    <a href="tel:+1-555-0123" className="text-gray-600 hover:text-gray-900 text-sm">
                      +1 (555) 012-3456
                    </a>
                  </li>
                </ul>
              </div>

              {/* Connect with us */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Connect with us</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                      Discord
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                      YouTube
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                      Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
