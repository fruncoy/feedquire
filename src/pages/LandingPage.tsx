import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

      <footer id="support" className="bg-[#000150] text-white py-16 rounded-t-3xl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-between items-center mb-8">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-white mb-2">Feedquire</h2>
              <p className="text-gray-300 text-sm">
                Powered by <a href="https://neuralink.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Neuralink</a>
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-300 mb-2">Email: support@feedquire.com</p>
              <p className="text-gray-300">Response time: 24-48 hours</p>
            </div>
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