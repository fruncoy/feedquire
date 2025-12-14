import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/">
              <Logo className="h-8 w-auto" />
            </Link>
            <Link 
              to="/" 
              className="text-[#000150] hover:text-gray-600 font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-[#000150] mb-8">Privacy Policy</h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> December 4, 2024<br />
            <strong>Last Updated:</strong> December 4, 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Feedquire Inc. ("we," "our," or "us") operates the Feedquire platform located at feedquire.com (the "Service"). 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using our Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-[#000150] mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect the following personal information when you register and use our Service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Full name and email address</li>
              <li>Payment verification information (processed through third-party services)</li>
              <li>Account preferences and settings</li>
              <li>Communication records (support tickets, feedback)</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">2.2 Usage Information</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Task completion data and feedback submissions</li>
              <li>Platform interaction logs and timestamps</li>
              <li>Device information and IP addresses</li>
              <li>Browser type and operating system</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">2.3 Financial Information</h3>
            <p className="text-gray-700 leading-relaxed">
              We do not store payment card information. All payment processing is handled securely by 
              our third-party payment processor, in compliance with PCI DSS standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-700">
              <li>To provide, operate, and maintain our Service</li>
              <li>To process payments and manage your account</li>
              <li>To communicate with you about your account and our services</li>
              <li>To improve our platform and develop new features</li>
              <li>To detect, prevent, and address technical issues and fraud</li>
              <li>To comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">4. Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold text-[#000150] mb-3">4.1 Third-Party Service Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We share information with trusted third-party service providers who assist us in operating our platform:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Payment processing and verification services</li>
              <li>Database hosting and management (US-based servers)</li>
              <li>Website hosting and content delivery services</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">4.2 Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may disclose your information if required by law, court order, or government regulation, 
              or to protect our rights, property, or safety.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">4.3 Business Transfers</h3>
            <p className="text-gray-700 leading-relaxed">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred 
              to the acquiring entity, subject to the same privacy protections.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure database hosting with access controls</li>
              <li>Regular security audits and monitoring</li>
              <li>Employee access restrictions and confidentiality agreements</li>
              <li>Automated backup and disaster recovery systems</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">6. Data Retention and Deletion</h2>
            
            <h3 className="text-xl font-semibold text-[#000150] mb-3">6.1 Account Verification Period</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you register but do not complete payment verification within 48 hours, 
              your account and all associated data will be automatically and permanently deleted from our systems.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">6.2 Active Account Data</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              For verified, active accounts, we retain your information as long as your account remains active 
              and for a reasonable period thereafter to comply with legal obligations.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">6.3 Account Deletion</h3>
            <p className="text-gray-700 leading-relaxed">
              Upon account deletion (voluntary or involuntary), all personal data is permanently removed 
              within 30 days, except as required for legal compliance or dispute resolution.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">7. Your Privacy Rights</h2>
            
            <h3 className="text-xl font-semibold text-[#000150] mb-3">7.1 Access and Correction</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to access, update, or correct your personal information through your account dashboard.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">7.2 Data Portability</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may request a copy of your personal data in a structured, machine-readable format.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">7.3 Account Deletion</h3>
            <p className="text-gray-700 leading-relaxed">
              You may delete your account at any time through your account settings or by contacting support.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">8. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information is processed and stored on servers located in the United States. 
              By using our Service, you consent to the transfer of your information to the United States, 
              which may have different data protection laws than your country of residence.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Service is not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children under 18. If we become aware that we have collected personal 
              information from a child under 18, we will take steps to delete such information immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
              Your continued use of the Service after such modifications constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">11. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p className="text-gray-700">
                <strong>Feedquire Inc.</strong><br />
                130 Sanchez Street<br />
                San Francisco, CA 94114<br />
                United States<br />
                Phone: (415) 555-3200<br />
                Business Hours: Monday-Friday, 9:00 AM - 6:00 PM PST
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}