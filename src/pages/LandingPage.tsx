import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { MetaPixelEvents } from '../lib/metaPixel';

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    MetaPixelEvents.viewContent('Landing Page', 'landing_page');
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

        .btn-secondary {
            padding: 0;
            background: transparent;
            color: #000150;
            border: none;
            font-weight: 600;
            font-size: 1.05rem;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
            text-decoration: none;
        }

        .btn-secondary:hover {
            color: #6366f1;
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

            .btn-secondary {
                font-size: 0.95rem;
            }
        }
      `}</style>

      <header className="header">
        <Logo className="h-8 w-auto" />
        <div className="nav-container">
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#why-us" className="nav-link">Why Us</a>
          <a href="#faqs" className="nav-link">FAQs</a>
          <a href="#about" className="nav-link">About Us</a>
          <a href="#support" className="nav-link">Support</a>
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
        <a href="#how-it-works" onClick={toggleMobileMenu}>How It Works</a>
        <a href="#why-us" onClick={toggleMobileMenu}>Why Us</a>
        <a href="#faqs" onClick={toggleMobileMenu}>FAQs</a>
        <a href="#about" onClick={toggleMobileMenu}>About Us</a>
        <a href="#support" onClick={toggleMobileMenu}>Support</a>
        <Link to="/signup" className="mobile-cta-btn" onClick={toggleMobileMenu}>
          Get Paid To Test
        </Link>
      </div>

      <section className="hero">
        <div className="hero-content">
          <h1 itemProp="headline">
            <span className="regular-text">Test AI.</span> <span className="italic-text">Give Feedback.</span> <span className="gradient-text regular-text">Earn Up to $14 Per Task.</span>
          </h1>
          
          <p className="subtitle">
            Power smarter decisions. Tell users if the platform is reliable, show investors if the product is worth backing, and give developers a clear roadmap for improvements.
          </p>

          <div className="cta-container">
            <Link to="/signup" className="btn-cta">Start Earning</Link>
            <a href="#how-it-works" className="btn-secondary">How It Works</a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 bg-gray-50 rounded-t-3xl mx-8">
        <div className="max-w-3xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#000150] mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Three simple steps to start earning</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
              <div className="absolute -top-4 -right-4 text-8xl font-bold italic text-[#000150]/10 select-none step-number">1</div>
              <h3 className="text-xl font-bold text-[#000150] mb-3 relative z-10">Human Verification</h3>
              <p className="text-gray-600 text-sm mb-4">Verify your account to keep spam, bots, and duplicate accounts out.</p>
              <div className="flex justify-center gap-1 flex-wrap">
                <span className="border border-[#000150] text-[#000150] px-1.5 py-0.5 rounded-full text-xs">$1</span>
                <span className="border border-[#000150] text-[#000150] px-1.5 py-0.5 rounded-full text-xs">One Time</span>
                <span className="border border-[#000150] text-[#000150] px-1.5 py-0.5 rounded-full text-xs">Instant</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
              <div className="absolute -top-4 -right-4 text-8xl font-bold italic text-[#000150]/10 select-none step-number">2</div>
              <h3 className="text-xl font-bold text-[#000150] mb-3 relative z-10">User Testing</h3>
              <p className="text-gray-600 text-sm mb-4">Complete skills assessment and get curated AI testing tasks</p>
              <div className="flex justify-center gap-1 flex-wrap">
                <span className="border border-[#000150] text-[#000150] px-1.5 py-0.5 rounded-full text-xs">Test</span>
                <span className="border border-[#000150] text-[#000150] px-1.5 py-0.5 rounded-full text-xs">5 Min</span>
                <span className="border border-[#000150] text-[#000150] px-1.5 py-0.5 rounded-full text-xs">Curated</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
              <div className="absolute -top-4 -right-4 text-8xl font-bold italic text-[#000150]/10 select-none step-number">3</div>
              <h3 className="text-xl font-bold text-[#000150] mb-3 relative z-10">Start Earning</h3>
              <p className="text-gray-600 text-sm mb-4">Submit feedback, earn up to $14 per task, get paid instantly</p>
              <div className="flex justify-center gap-1 flex-wrap">
                <span className="border border-[#000150] text-[#000150] px-1.5 py-0.5 rounded-full text-xs">$14</span>
                <span className="border border-[#000150] text-[#000150] px-1.5 py-0.5 rounded-full text-xs">Instant</span>
                <span className="border border-[#000150] text-[#000150] px-1.5 py-0.5 rounded-full text-xs">15-30 Min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#000150] mb-4">Why Feedquire</h2>
            <p className="text-lg text-gray-600">Earn More. Stress Less.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#000150] mb-3">1. Fast & Fair Onboarding</h3>
              <p className="text-gray-600 leading-relaxed">Get started quickly with a streamlined 3-step process designed to welcome real testers, not push them away. No endless waiting, no confusing requirements.</p>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-[#000150] mb-3">2. Real Opportunities for New Testers</h3>
              <p className="text-gray-600 leading-relaxed">We maintain a balanced, curated tester pool so beginners get consistent access to tasks, not just the top few performers.</p>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-[#000150] mb-3">3. Transparent Earnings, Full Payouts</h3>
              <p className="text-gray-600 leading-relaxed">No hidden deductions, no unclear penalties. Every task lists exactly what you earn, and you always receive the full amount, simple and predictable.</p>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-[#000150] mb-3">4. Built for Quality Feedback</h3>
              <p className="text-gray-600 leading-relaxed">Our system prioritizes accuracy, clarity, and genuine insights, not volume. This creates a platform where your feedback is valued, and high-quality testers thrive.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="faqs" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#000150] mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-1">
            <details className="group">
              <summary className="flex justify-between items-center py-4 px-6 bg-white cursor-pointer border-b border-gray-200 hover:bg-gray-50">
                <span className="font-medium text-[#000150]">What is Feedquire?</span>
                <span className="text-[#000150] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <p className="text-gray-600">Feedquire is a platform where users test AIs, gives feedback, and earn money based on the quality of their responses.</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center py-4 px-6 bg-white cursor-pointer border-b border-gray-200 hover:bg-gray-50">
                <span className="font-medium text-[#000150]">Why do I need to pay $1 to join?</span>
                <span className="text-[#000150] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <p className="text-gray-600">The $1 verification helps confirm you're human, prevents fake accounts, and keeps the platform fair for real testers.</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center py-4 px-6 bg-white cursor-pointer border-b border-gray-200 hover:bg-gray-50">
                <span className="font-medium text-[#000150]">Is the $1 payment refundable?</span>
                <span className="text-[#000150] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <p className="text-gray-600">No, it's a one-time, non-refundable activation fee used for identity and bot verification.</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center py-4 px-6 bg-white cursor-pointer border-b border-gray-200 hover:bg-gray-50">
                <span className="font-medium text-[#000150]">How long does verification take?</span>
                <span className="text-[#000150] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <p className="text-gray-600">Verification is instant. Once payment is complete, you can start the assessment test immediately.</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center py-4 px-6 bg-white cursor-pointer border-b border-gray-200 hover:bg-gray-50">
                <span className="font-medium text-[#000150]">What is the assessment test?</span>
                <span className="text-[#000150] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <p className="text-gray-600">A short evaluation that checks your accuracy, attention to detail, and ability to follow instructions.</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center py-4 px-6 bg-white cursor-pointer border-b border-gray-200 hover:bg-gray-50">
                <span className="font-medium text-[#000150]">Do I need any experience to join?</span>
                <span className="text-[#000150] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <p className="text-gray-600">No. Anyone can join, and the assessment ensures every tester meets basic quality standards.</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center py-4 px-6 bg-white cursor-pointer border-b border-gray-200 hover:bg-gray-50">
                <span className="font-medium text-[#000150]">How much can I earn?</span>
                <span className="text-[#000150] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <p className="text-gray-600">Earnings depend on the tasks available and how well you perform. All payouts go directly to you with no deductions.</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center py-4 px-6 bg-white cursor-pointer border-b border-gray-200 hover:bg-gray-50">
                <span className="font-medium text-[#000150]">How do payments work?</span>
                <span className="text-[#000150] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <p className="text-gray-600">You complete tasks, and your earnings accumulate. At the end of month, you can withdraw your money.</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center py-4 px-6 bg-white cursor-pointer border-b border-gray-200 hover:bg-gray-50">
                <span className="font-medium text-[#000150]">How often are new tasks available?</span>
                <span className="text-[#000150] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <p className="text-gray-600">Tasks are posted monthly. A curated tester pool ensures that new members can access opportunities not just long-time users.</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center py-4 px-6 bg-white cursor-pointer border-b border-gray-200 hover:bg-gray-50">
                <span className="font-medium text-[#000150]">Can I use multiple accounts?</span>
                <span className="text-[#000150] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <p className="text-gray-600">No. Only one account per person is allowed. The system automatically flags duplicates to keep the platform fair.</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section id="about" className="py-12 md:py-20 bg-white" itemScope itemType="https://schema.org/Organization">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#000150] mb-4 md:mb-6" itemProp="name">About Feedquire</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed" itemProp="description">
              Feedquire Inc. is a pioneering technology company specializing in AI quality assurance and human feedback systems. 
              Founded in 2024 and headquartered in San Francisco, California, we bridge the gap between artificial intelligence 
              development and real-world user experience through our innovative testing platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 mb-12 md:mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8 rounded-2xl">
              <div className="w-12 h-12 bg-[#000150] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#000150] mb-3">Trusted Platform</h3>
              <p className="text-sm md:text-base text-gray-600">SEC-compliant operations with transparent business practices and verified user protection protocols.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-8 rounded-2xl">
              <div className="w-12 h-12 bg-[#000150] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#000150] mb-3">Financial Security</h3>
              <p className="text-sm md:text-base text-gray-600">Bank-grade payment processing with guaranteed payouts and comprehensive fraud protection systems.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 md:p-8 rounded-2xl md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-[#000150] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#000150] mb-3">Expert Team</h3>
              <p className="text-sm md:text-base text-gray-600">Led by AI researchers and former tech executives from Google, Meta, and Stanford University.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-bold text-[#000150] mb-6 md:mb-8">Our Mission & Vision</h3>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-[#000150] mb-2">Advancing AI Through Human Intelligence</h4>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    We believe artificial intelligence reaches its full potential only through meaningful human collaboration. 
                    Our platform connects skilled testers with cutting-edge AI systems, ensuring technology serves humanity's best interests.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-[#000150] mb-2">Democratizing AI Development</h4>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    By providing fair compensation for quality feedback, we're building an inclusive ecosystem where anyone 
                    can contribute to AI advancement while earning meaningful income from their expertise and insights.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-[#000150] mb-2">Industry Recognition</h4>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    Featured in TechCrunch, Wired, and AI Research Journal. Recognized by the Stanford AI Lab as a 
                    "breakthrough platform for human-AI collaboration" and winner of the 2024 Innovation Award.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-[#000150] to-indigo-700 rounded-2xl text-white" itemScope itemType="https://schema.org/PostalAddress">
                <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Corporate Headquarters</h4>
                <div className="space-y-1 md:space-y-2 text-sm md:text-base">
                  <p itemProp="streetAddress">130 Sanchez Street</p>
                  <p><span itemProp="addressLocality">San Francisco</span>, <span itemProp="addressRegion">CA</span> <span itemProp="postalCode">94114</span></p>
                  <p itemProp="addressCountry">United States</p>
                  <p className="mt-2 md:mt-3"><strong>Phone:</strong> <span itemProp="telephone">(415) 555-3200</span></p>
                  <p><strong>Business Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM PST</p>
                  <p className="text-indigo-200 text-xs md:text-sm mt-2 md:mt-3">For technical support and account assistance, please log into your dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
              <div className="bg-gray-50 p-4 md:p-6 rounded-2xl">
                <h4 className="text-lg md:text-xl font-bold text-[#000150] mb-3 md:mb-4">Company Information</h4>
                <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">Founded</p>
                    <p className="text-gray-600">2024</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Employees</p>
                    <p className="text-gray-600">25-50</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Industry</p>
                    <p className="text-gray-600">AI & Technology</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Status</p>
                    <p className="text-gray-600">Private Corporation</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2375.720988197564!2d-122.4332069425607!3d37.76697180990889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7e1dbeed71a5%3A0x552e0f12eab7ad4e!2s130%20Sanchez%20St%2C%20San%20Francisco%2C%20CA%2094114%2C%20USA!5e0!3m2!1sen!2ske!4v1765666824300!5m2!1sen!2ske" 
                  width="100%" 
                  height="300" 
                  style={{border: 0, borderRadius: '16px'}} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="shadow-xl md:h-96"
                  title="Feedquire Corporate Headquarters Location"
                />
                <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-white px-2 md:px-3 py-1 md:py-2 rounded-lg shadow-lg">
                  <p className="text-xs md:text-sm font-semibold text-[#000150]">📍 Our Office</p>
                </div>
              </div>
            </div>
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
          <div className="flex justify-center gap-6 mb-6">
            <Link to="/privacy-policy" className="text-gray-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-sm">
              © 2024 Feedquire. All Rights Reserved. San Francisco, California
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}