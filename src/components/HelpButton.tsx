import { useState } from 'react';
import { HelpCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isHidden, setIsHidden] = useState(() => {
    return sessionStorage.getItem('helpButtonHidden') === 'true';
  });

  const faqs = [
    {
      question: "What is the step-by-step process from signup to payment?",
      answer: "1. Human Verification (instant): Pay $1 to verify you're human. 2. User Testing (3-5 days): Complete assessment test and wait for approval. 3. Start Tasking: Once approved, access and complete available tasks. 4. Admin Review: Admins approve all tasks before the 30th of each month. 5. Payment: Funds are disbursed automatically on the 30th unless communicated otherwise."
    },
    {
      question: "Why do I need to pay $1 for verification?",
      answer: "The $1 verification fee helps us maintain a bot-free platform. This small payment confirms you're a real person committed to quality work. It's a one-time fee that protects the integrity of our community and ensures fair opportunities for genuine users."
    },
    {
      question: "Why are accounts deleted automatically if not verified within 48 hours?",
      answer: "We automatically delete unverified accounts after 48 hours to maintain platform security and prevent bot registrations. This policy ensures only serious users who complete verification remain in our system, protecting the quality of our community and task opportunities."
    },
    {
      question: "How does Feedquire work?",
      answer: "Feedquire connects you with AI companies seeking authentic user feedback. After verification and passing our assessment test, you'll access tasks where you test AI platforms and share your honest opinions. Each completed task earns you money, paid automatically every month."
    },
    {
      question: "When should I submit tasks?",
      answer: "Submit all tasks before the 30th of each month to be included in that month's payment cycle. Payments are processed on the 30th, and new tasks are added on the 1st of each month. Plan accordingly to maximize your monthly earnings."
    },
    {
      question: "Can I redo a task if I make a mistake?",
      answer: "No, there is only 1 submission per task per user. If your task is rejected, you cannot repeat it and will have to wait until the 30th when the admin has assessed all submissions. Take your time and follow guidelines carefully to ensure your submission is approved on the first attempt."
    },
    {
      question: "When and how do I get paid?",
      answer: "Payments are processed automatically on the 30th of each month via PayPal or bank transfer. Once your task is approved by our team, the earnings are added to your account balance. No need to request withdrawals - we handle everything automatically."
    },
    {
      question: "How long does payment take?",
      answer: "After the monthly payout on the 30th, funds typically arrive within 3-5 business days depending on your payment method. PayPal transfers are usually faster (1-2 days) while bank transfers may take 3-5 days."
    },
    {
      question: "What happens after I submit a task?",
      answer: "Our quality team reviews all submissions before the 30th of each month. If approved, the payment is added to your balance and paid out on the 30th. Quality submissions lead to consistent earnings and faster approvals."
    },
    {
      question: "How much can I earn?",
      answer: "Earnings vary by task complexity, typically ranging from $5-$25 per task. Active users completing 4-8 tasks monthly can earn $100-$200. New tasks are added regularly, and top performers get priority access to higher-paying opportunities."
    },
    {
      question: "What if my task is rejected?",
      answer: "Rejections happen if submissions don't meet quality standards. Each task has clear guidelines - follow them carefully. Rejected tasks cannot be resubmitted, so take your time and provide thoughtful, detailed feedback. Quality over speed always wins."
    },
    {
      question: "Why should I join Pro?",
      answer: "Pro members enjoy exclusive benefits: perform revisions on noted feedback from first submission, faster approval times, withdraw funds anytime as long as they're approved, priority access to high-paying tasks, dedicated support, and many more premium features designed to maximize your earnings.",
      bold: true
    },
    {
      question: "How do I join Pro?",
      answer: "Visit our <a href='/account' class='text-blue-600 hover:underline font-semibold'>Pro membership page</a> to get started. After payment, submit all your details and we'll create your Pro account. You'll receive communication within 28 days of progress to get your verified Pro testing account with premium benefits.",
      bold: true,
      html: true
    }
  ];

  return (
    <>
      {!isHidden && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap">
            Do you have a question?
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-[#000150] text-white rounded-full shadow-lg hover:bg-[#000130] transition flex items-center justify-center"
          >
            <HelpCircle size={24} />
          </button>
        </div>
      )}

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="fixed bottom-6 right-6 z-50 w-full max-w-md">
            <div className="bg-white rounded-lg max-h-[70vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">How Feedquire Works</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsHidden(true);
                    sessionStorage.setItem('helpButtonHidden', 'true');
                    setIsOpen(false);
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition"
                >
                  Hide
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className={`border rounded-lg overflow-hidden ${
                  faq.bold ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50' : 'border-gray-200'
                }`}>
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className={`w-full p-4 flex items-center justify-between text-left transition ${
                      faq.bold ? 'hover:bg-yellow-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`font-medium text-gray-900 ${faq.bold ? 'font-bold' : ''}`}>{faq.question}</span>
                    {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {openIndex === index && (
                    <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                      {faq.html ? (
                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      ) : (
                        faq.answer
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
