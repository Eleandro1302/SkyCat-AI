import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in slide-in-from-bottom-10">
      <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-white font-bold mb-2">We value your privacy</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our <Link to="/privacy" className="text-sky-400 hover:underline">Privacy Policy</Link> for more information.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none bg-sky-500 hover:bg-sky-400 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Accept All
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
