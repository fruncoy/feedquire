
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { MetaPixelEvents } from '../lib/metaPixel';

export function CompanyLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    MetaPixelEvents.viewContent('Company Landing Page', 'company-landing');
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div>
      <style>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=swap');

        .header {
            position: fixed;
            top: 2rem;
            left: 5%;
            right: 5%;
            z-index: 1000;
            padding: 1.5rem 2.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 1, 80, 0.08);
            border-radius: 50px;
            box-shadow: 0 4px 20px rgba(0, 1, 80, 0.05);
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: #000150;
            letter-spacing: -0.5px;
        }

        .nav-container {
            display: flex;
            align-items: center;
            gap: 2.5rem;
        }

        .nav-link {
            background: transparent;
            color: #000150;
            border: none;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
            text-decoration: none;
        }

        .nav-link:hover {
            color: #6366f1;
        }

        .mobile-menu-btn {
            display: none;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            color: #000150;
            transition: all 0.3s ease;
        }

        .mobile-menu-btn:hover {
            opacity: 0.7;
        }

        .mobile-menu-btn svg {
            width: 24px;
            height: 24px;
            transition: transform 0.3s ease;
        }

        .mobile-menu-btn.active svg {
            transform: rotate(90deg);
        }

        .mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            width: 280px;
            height: 100vh;
            background: #ffffff;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            padding: 2rem 1.5rem;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 1001;
        }

        .mobile-menu.active {
            transform: translateX(0);
        }

        .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1000;
        }

        .mobile-menu-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }

        .mobile-menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .mobile-menu-header img {
            filter: none;
            box-shadow: none;
            drop-shadow: none;
        }

        .mobile-menu-close {
            background: #000150;
            border: none;
            color: white;
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s ease;
            font-family: Arial, sans-serif;
            font-size: 18px;
            font-weight: normal;
        }

        .mobile-menu-close:hover {
            background: #000180;
        }

        .mobile-cta-btn {
            position: absolute;
            bottom: 4rem;
            left: 1.5rem;
            right: 1.5rem;
            background: transparent;
            color: #000150;
            border: 2px solid #000150;
            padding: 0.3rem 1rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            text-align: center;
            text-decoration: none;
            transition: all 0.3s ease;
            display: block;
        }

        .mobile-cta-btn:hover {
            background: #000150;
            color: white;
            transform: translateY(-2px);
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .mobile-menu a {
            display: block;
            padding: 1rem 0;
            color: #000150;
            text-decoration: none;
            font-weight: 500;
            font-size: 1.1rem;
            border-bottom: 1px solid rgba(0, 1, 80, 0.1);
            transition: all 0.3s ease;
        }

        .mobile-menu a:hover {
            color: #6366f1;
            padding-left: 0.5rem;
        }

        .hero {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10rem 5% 4rem;
            background: #ffffff;
            overflow: hidden;
        }

        .hero-content {
            position: relative;
            z-index: 1;
            max-width: 1200px;
            text-align: center;
        }

        h1 {
            font-size: 4.5rem;
            font-weight: 800;
            line-height: 1.1;
            color: #000150;
            margin-bottom: 1.5rem;
            letter-spacing: -2px;
            animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        h1 .regular-text {
            font-family: 'Montserrat', sans-serif;
            font-weight: 800;
            color: #000150;
        }

        h1 .italic-text {
            font-family: 'Times New Roman', serif;
            font-style: italic;
            font-weight: 700;
            color: #000150;
        }

        .gradient-text {
            color: #000150;
        }

        .subtitle {
            font-size: 1.35rem;
            line-height: 1.7;
            color: #475569;
            max-width: 800px;
            margin: 0 auto 3rem;
            font-weight: 400;
            animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .cta-container {
            display: flex;
            gap: 1.2rem;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .btn-cta {
            padding: 0.8rem 2.5rem;
            background: #000150;
            color: white;
            border: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.05rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 40px rgba(0, 1, 80, 0.2);
            white-space: nowrap;
            text-decoration: none;
            display: inline-block;
        }

        .btn-cta:hover {
            background: #000180;
            transform: translateY(-2px);
            box-shadow: 0 15px 50px rgba(0, 1, 80, 0.35);
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 968px) {
            .nav-container {
                display: none;
            }

            .mobile-menu-btn {
                display: block;
            }

            .header {
                left: 3%;
                right: 3%;
                padding: 1rem 1.5rem;
            }

            .mobile-menu {
                width: 85vw;
                max-width: 320px;
            }
        }

        .step-number {
            -webkit-text-stroke: 1px rgba(0,1,80,0.15);
            color: transparent;
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 2.8rem;
            }

            .subtitle {
                font-size: 1.1rem;
            }

            .cta-container {
                gap: 1rem;
            }

            .btn-cta {
                padding: 0.9rem 1.8rem;
                font-size: 0.95rem;
            }
        }
      `}</style>

      <header className="header">
        <Logo className="h-8 w-auto" />
        <div className="nav-container">
          <Link to="/" className="nav-link">For Users</Link>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        <button 
          className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1"></rect>
          </svg>
        </button>
      </header>

      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>
      
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <Logo className="h-8 w-auto" />
          <button className="mobile-menu-close" onClick={toggleMobileMenu}>
            ×
          </button>
        </div>
        <Link to="/" onClick={toggleMobileMenu}>For Users</Link>
        <a href="#how-it-works" onClick={toggleMobileMenu}>How It Works</a>
        <a href="#pricing" onClick={toggleMobileMenu}>Pricing</a>
        <a href="#contact" onClick={toggleMobileMenu}>Contact</a>
        <Link to="/company/signup" className="mobile-cta-btn" onClick={toggleMobileMenu}>
          Get Started
        </Link>
      </div>

      <section className="hero">
        <div className="hero-content">
          <h1 itemProp="headline">
            <span className="regular-text">Get Human Feedback</span> <span className="italic-text">for Your Software</span>
          </h1>
          
          <p className="subtitle">
            Connect with real users to test your product, get valuable feedback, and improve your software with human insights.
          </p>

          <div className="cta-container">
            <Link to="/company/signup" className="btn-cta">Get Started</Link>
            <a href="#how-it-works" className="btn-secondary" style={{padding: '0', background: 'transparent', color: '#000150', border: 'none', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.3s ease', textDecoration: 'none'}}>How It Works</a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 bg-gray-50 rounded-t-3xl mx-8">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#000150] mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple steps to get feedback</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
              <div className="absolute -top-4 -right-4 text-8xl font-bold italic text-[#000150]/10 select-none step-number">1</div>
              <h3 className="text-xl font-bold text-[#000150] mb-3 relative z-10">Sign Up</h3>
              <p className="text-gray-600 text-sm mb-4">Create your company account and complete verification.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
              <div className="absolute -top-4 -right-4 text-8xl font-bold italic text-[#000150]/10 select-none step-number">2</div>
              <h3 className="text-xl font-bold text-[#000150] mb-3 relative z-10">Add Software</h3>
              <p className="text-gray-600 text-sm mb-4">Post your software link and set your budget for feedback.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
              <div className="absolute -top-4 -right-4 text-8xl font-bold italic text-[#000150]/10 select-none step-number">3</div>
              <h3 className="text-xl font-bold text-[#000150] mb-3 relative z-10">Get Feedback</h3>
              <p className="text-gray-600 text-sm mb-4">Receive valuable feedback from real users testing your product.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#000150] mb-4">Simple Pricing</h2>
            <p className="text-lg text-gray-600">Transparent and affordable</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-[#000150] mb-2">Starter</h3>
            <p className="text-4xl font-bold text-[#000150] mb-4">$10</p>
            <p className="text-gray-600 mb-6">Verification fee</p>
            <ul className="text-left text-gray-600 mb-8 space-y-3">
              <li>• Unlimited software links</li>
              <li>• Up to 10 responses per link</li>
              <li>• Transparent pricing per feedback</li>
            </ul>
            <Link to="/company/signup" className="w-full bg-[#000150] text-white py-3 rounded-lg font-medium hover:bg-[#000180] transition block">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-gray-50 rounded-b-3xl mx-8">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#000150] mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600">Have questions? We're here to help</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-600 mb-6">Reach out to us for any inquiries about our service</p>
            <p className="text-[#000150] font-semibold">support@feedquire.com</p>
          </div>
        </div>
      </section>

      <footer id="support" className="bg-[#000150] text-white py-16 rounded-t-3xl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Feedquire</h2>
            <p className="text-gray-300 text-sm">
              Powered by <a href="https://neuralink.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Neuralink</a>
            </p>
          </div>
          <div className="flex justify-center gap-6">
            <Link to="/privacy-policy" className="text-gray-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
