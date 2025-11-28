import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartEarning = () => {
    navigate('/signup');
  };

  const handleHowItWorks = () => {
    // Scroll to how it works section or navigate to info page
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Header */}
      <header className="w-full px-8 py-8 lg:px-16 lg:py-12">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/src/assets/logo.png" 
              alt="Feedquire" 
              className="h-8 lg:h-10 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12">
            <a href="#how-it-works" className="text-gray-500 hover:text-brand transition-colors font-light">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-500 hover:text-brand transition-colors font-light">
              Pricing
            </a>
            <button 
              onClick={handleStartEarning}
              className="bg-brand text-white px-5 py-2.5 rounded-lg font-normal hover:bg-opacity-90 transition-all"
            >
              Start Earning
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4 pt-4">
              <a href="#how-it-works" className="text-gray-700 hover:text-brand transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-brand transition-colors">
                Pricing
              </a>
              <button 
                onClick={handleStartEarning}
                className="bg-brand text-white px-5 py-2.5 rounded-lg font-normal hover:bg-opacity-90 transition-all w-full"
              >
                Start Earning
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            <div className="bg-white rounded-2xl shadow-sm shadow-gray-50 p-12 space-y-10 relative overflow-hidden">
              {/* Hero Visual */}
              <div className="flex justify-center -mt-6 -mb-4">
                <img 
                  src="/src/assets/wave.png" 
                  alt="AI Wave" 
                  className="w-full max-w-md h-auto drop-shadow-lg scale-110"
                />
              </div>

              {/* Hero Text */}
              <div className="text-center space-y-8">
                <h1 className="text-3xl font-semibold text-gray-900 leading-snug">
                  Test AI. Give Feedback.<br />
                  Earn Up to <span className="text-brand">$14</span><br />
                  Per Task.
                </h1>
                
                <p className="text-gray-500 text-lg leading-loose font-light">
                  Power smarter decisions. Tell users if the software is reliable, shows investors the if product worth backing, and gives developers a roadmap for improvements.
                </p>

                {/* CTA Buttons */}
                <div className="space-y-6 pt-6">
                  <button 
                    onClick={handleStartEarning}
                    className="w-full bg-brand text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-opacity-90 transition-all"
                  >
                    Start Earning
                  </button>
                  <button 
                    onClick={handleHowItWorks}
                    className="text-gray-600 hover:text-brand transition-colors font-light text-lg"
                  >
                    How It Works
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-16">
              <div className="grid grid-cols-2 gap-16 items-center">
                {/* Left Side - Text & Buttons */}
                <div className="space-y-8">
                  <h1 className="text-6xl font-bold text-brand leading-tight">
                    Test AI. Give Feedback. Earn Up to $14 Per Task.
                  </h1>
                  
                  <p className="text-gray-600 text-xl leading-relaxed">
                    Power smarter decisions. Tell users if the software is reliable, shows investors the if product worth backing, and gives developers a roadmap for improvements.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex space-x-6 pt-4">
                    <button 
                      onClick={handleStartEarning}
                      className="bg-brand text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg"
                    >
                      Start Earning
                    </button>
                    <button 
                      onClick={handleHowItWorks}
                      className="text-brand border-2 border-brand px-10 py-4 rounded-full text-lg font-medium hover:bg-brand hover:text-white transition-all"
                    >
                      How It Works
                    </button>
                  </div>
                </div>

                {/* Right Side - Hero Visual */}
                <div className="flex justify-center">
                  <img 
                    src="/src/assets/wave.png" 
                    alt="AI Wave" 
                    className="w-full max-w-lg h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;