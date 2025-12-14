import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function TermsOfServicePage() {
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
          <h1 className="text-4xl font-bold text-[#000150] mb-8">Terms of Service</h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> December 4, 2024<br />
            <strong>Last Updated:</strong> December 4, 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and Feedquire Inc. 
              ("Company," "we," "our," or "us") regarding your use of the Feedquire platform and services (the "Service").
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, 
              you may not access or use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">2. Eligibility and Account Registration</h2>
            
            <h3 className="text-xl font-semibold text-[#000150] mb-3">2.1 Age Requirement</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You must be at least 18 years of age to use this Service. By using the Service, you represent and warrant 
              that you are at least 18 years old and have the legal capacity to enter into these Terms.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">2.2 Account Verification</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access the Service, you must complete account verification by paying a one-time, non-refundable 
              verification fee of $1.00 USD. This fee serves to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Verify your identity and prevent fraudulent accounts</li>
              <li>Confirm your commitment to platform participation</li>
              <li>Maintain platform quality and security</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">2.3 Account Deletion Policy</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>IMPORTANT:</strong> If you do not complete payment verification within 48 hours of registration, 
              your account and all associated data will be automatically and permanently deleted from our systems. 
              This deletion is irreversible and no data recovery will be possible.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">2.4 One Account Policy</h3>
            <p className="text-gray-700 leading-relaxed">
              You may maintain only one account. Creating multiple accounts is strictly prohibited and will result 
              in immediate termination of all associated accounts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">3. Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Feedquire is a platform that connects users with AI testing opportunities. Users complete assessment tests, 
              provide feedback on AI platforms, and earn compensation based on the quality and completeness of their submissions.
            </p>
            
            <h3 className="text-xl font-semibold text-[#000150] mb-3">3.1 Assessment Process</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              After payment verification, you must complete a skills assessment to qualify for paid tasks. 
              The assessment evaluates your ability to provide quality feedback and follow instructions.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">3.2 Task Availability</h3>
            <p className="text-gray-700 leading-relaxed">
              Tasks are posted monthly and distributed among qualified users. Task availability depends on 
              your assessment performance, account standing, and overall platform capacity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">4. Payment Terms</h2>
            
            <h3 className="text-xl font-semibold text-[#000150] mb-3">4.1 Verification Fee</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The $1.00 verification fee is non-refundable under all circumstances. This fee is charged once 
              per account and is required for platform access.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">4.2 Task Compensation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Compensation for completed tasks varies based on task complexity and requirements. 
              Payment amounts are clearly displayed before task acceptance and are paid in full upon approval.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">4.3 Payment Processing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All payments are processed through Paystack, our secure third-party payment processor. 
              We do not store or have access to your payment card information.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">4.4 No Refund Policy</h3>
            <p className="text-gray-700 leading-relaxed">
              All fees and payments are final and non-refundable. We do not provide refunds for verification fees, 
              completed tasks, or any other charges under any circumstances.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">5. User Obligations and Conduct</h2>
            
            <h3 className="text-xl font-semibold text-[#000150] mb-3">5.1 Quality Standards</h3>
            <p className="text-gray-700 leading-relaxed mb-4">You agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide honest, accurate, and original feedback</li>
              <li>Complete tasks according to provided instructions</li>
              <li>Submit work that reflects genuine testing and evaluation</li>
              <li>Use proper grammar and clear communication</li>
              <li>Avoid plagiarism, AI-generated content, or copied responses</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">5.2 Prohibited Activities</h3>
            <p className="text-gray-700 leading-relaxed mb-4">You may not:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Create multiple accounts or share account access</li>
              <li>Submit spam, low-quality, or fraudulent content</li>
              <li>Attempt to manipulate or game the platform systems</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Interfere with other users' ability to use the Service</li>
              <li>Reverse engineer or attempt to access unauthorized areas</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">5.3 Account Security</h3>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and 
              for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">6. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-semibold text-[#000150] mb-3">6.1 User-Generated Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Upon successful completion of the assessment process and qualification as an active user, 
              you grant Feedquire Inc. a perpetual, irrevocable, worldwide, royalty-free license to use, 
              reproduce, modify, distribute, and display any feedback, reviews, or content you submit through the Service.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">6.2 Platform Ownership</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Service, including all software, designs, text, graphics, and other content, is owned by 
              Feedquire Inc. and is protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">6.3 Limited License</h3>
            <p className="text-gray-700 leading-relaxed">
              We grant you a limited, non-exclusive, non-transferable license to access and use the Service 
              for its intended purpose, subject to these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">7. Account Termination</h2>
            
            <h3 className="text-xl font-semibold text-[#000150] mb-3">7.1 Termination by Company</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your account immediately, without prior notice, for any of the following reasons:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Violation of these Terms of Service</li>
              <li>Submission of spam, low-quality, or fraudulent content</li>
              <li>Creation of multiple accounts</li>
              <li>Failure to complete payment verification within 48 hours</li>
              <li>Engaging in prohibited activities or misconduct</li>
              <li>Legal or regulatory requirements</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">7.2 Termination by User</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may terminate your account at any time through your account settings or by contacting support.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">7.3 Effect of Termination</h3>
            <p className="text-gray-700 leading-relaxed">
              Upon termination, your access to the Service will cease immediately. Any pending earnings 
              may be forfeited if termination is due to violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">8. Disclaimers and Limitation of Liability</h2>
            
            <h3 className="text-xl font-semibold text-[#000150] mb-3">8.1 Service Availability</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Service is provided "as is" and "as available." We do not guarantee uninterrupted access, 
              task availability, or specific earning amounts.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">8.2 Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by law, Feedquire Inc. shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to loss of profits, 
              data, or other intangible losses.
            </p>

            <h3 className="text-xl font-semibold text-[#000150] mb-3">8.3 Maximum Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              Our total liability to you for any claims arising from or related to the Service shall not exceed 
              the amount you have paid to us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">9. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Feedquire Inc., its officers, directors, employees, 
              and agents from and against any claims, liabilities, damages, losses, and expenses arising from or 
              related to your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">10. Governing Law and Jurisdiction</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of California, 
              United States, without regard to its conflict of law provisions. Any disputes arising from these Terms 
              or the Service shall be subject to the exclusive jurisdiction of the courts located in San Francisco County, California.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">11. Modifications to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of material changes 
              by posting the updated Terms on our website and updating the "Last Updated" date. 
              Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">12. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be 
              limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain 
              in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#000150] mb-4">13. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
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