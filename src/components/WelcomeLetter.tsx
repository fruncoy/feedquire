import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface WelcomeLetterProps {
  userId: string;
  signupDate: string;
  onClose: () => void;
}

export function WelcomeLetter({ userId, signupDate, onClose }: WelcomeLetterProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleAccept = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ has_seen_welcome: true })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating welcome status:', error);
        throw error;
      }
      onClose();
    } catch (err) {
      console.error('Error updating welcome status:', err);
      alert('Failed to update. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        <div className="p-6 sm:p-8 md:p-12">
          <div className="space-y-4 mb-8" style={{ fontFamily: 'Georgia, serif' }}>
            <div className="text-sm text-gray-600">
              <p className="font-semibold">Feedquire LTD</p>
              <p>{formatDate(signupDate)}</p>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-8 mb-6">
              Welcome to Feedquire
            </h1>

            <p className="text-gray-700 leading-relaxed">
              Welcome to Feedquire, a subsidized platform connecting real users with AI companies seeking authentic feedback. We've built this community to help improve AI products while providing you with genuine earning opportunities. Your insights will directly shape the future of AI technology, and we're excited to have you as part of this journey.
            </p>

            <p className="text-gray-700 leading-relaxed">
              To get started, you'll complete a $1 verification to confirm you're human and protect our community from bots. Next, you'll take our assessment test to demonstrate your ability to provide valuable feedback. Once approved, you'll access paid tasks where you test AI platforms and share your honest opinions. Submit your work before the 30th of each month, and payments are processed automatically on the 30th via PayPal. New tasks are added on the 1st of every month.
            </p>

            <p className="text-gray-700 leading-relaxed">
              We maintain high standards because quality matters to both our users and partner companies. Take your time with each task, follow the guidelines carefully, and provide thoughtful feedback. Your success is our success, and we're here to support you every step of the way. Good luck, and happy testing!
            </p>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-700">From,</p>
              <p className="text-gray-900 font-semibold mt-1">The Feedquire Team</p>
            </div>
          </div>

          <button
            onClick={handleAccept}
            disabled={isUpdating}
            className="w-full bg-[#000150] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#000130] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Loading...' : "I'm In"}
          </button>
        </div>
      </div>
    </div>
  );
}
