import React from 'react';
import { Navigation, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 relative overflow-x-hidden">
      <header className="fixed top-0 w-full bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50 z-50 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 bg-slate-800 group-hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
             <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Back to App</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
             <Navigation className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">SkyCast AI</span>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-32 pb-20 max-w-3xl relative z-10">
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-8 md:p-12 backdrop-blur-md">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                SkyCast AI ("we", "our", or "us") respects your privacy. When you use our service, we may collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-400">
                <li><strong>Location Data:</strong> With your explicit permission, we collect your device's location to provide hyper-local weather forecasts.</li>
                <li><strong>Usage Data:</strong> We may collect anonymous data about how you interact with our application to improve our services.</li>
                <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our service and hold certain information, including for advertising purposes via Google AdSense.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the collected data for various purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-400">
                <li>To provide and maintain our weather forecasting service</li>
                <li>To personalize your experience and deliver location-specific content</li>
                <li>To analyze usage patterns and improve our application</li>
                <li>To serve relevant advertisements through our advertising partners (e.g., Google AdSense)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Third-Party Services and Advertising</h2>
              <p className="mb-4">
                We use third-party services, including Google AdSense, to serve ads when you visit our application. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
              </p>
              <p className="mb-4">
                Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
              </p>
              <p>
                Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">Google Ads Settings</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
              <p>
                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through our official channels.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
