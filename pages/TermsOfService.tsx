import React from 'react';
import { Navigation, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing or using SkyCast AI ("the Application"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="mb-4">
                SkyCast AI provides users with access to weather forecasts, meteorological data, AI-generated insights, and related information. The service is provided "as is" and "as available". We reserve the right to modify, suspend, or discontinue the service at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Use of the Application</h2>
              <p className="mb-4">You agree to use the Application only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-400">
                <li>Use the Application in any way that violates any applicable federal, state, local, or international law or regulation.</li>
                <li>Attempt to interfere with the proper working of the Application.</li>
                <li>Use any robot, spider, or other automatic device, process, or means to access the Application for any purpose.</li>
                <li>Introduce any viruses, trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. User Contributions and Conduct</h2>
              <p className="mb-4">
                Users may have the opportunity to provide feedback or suggestions. By submitting such content, you grant SkyCast AI a non-exclusive, royalty-free, perpetual, and irrevocable right to use, reproduce, and modify such content.
              </p>
              <p className="mb-4">
                You agree not to use the service to transmit any content that is unlawful, harmful, threatening, or otherwise objectionable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Third-Party Links</h2>
              <p className="mb-4">
                Our Application may contain links to third-party websites or services that are not owned or controlled by SkyCast AI. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Intellectual Property Rights</h2>
              <p className="mb-4">
                The Application and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by SkyCast AI, its licensors, or other providers of such material and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Disclaimer of Warranties</h2>
              <p className="mb-4">
                Your use of the Application, its content, and any services or items obtained through the Application is at your own risk. The Application, its content, and any services or items obtained through the Application are provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied.
              </p>
              <p className="mb-4">
                Neither SkyCast AI nor any person associated with SkyCast AI makes any warranty or representation with respect to the completeness, security, reliability, quality, accuracy, or availability of the Application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Limitation on Liability</h2>
              <p className="mb-4">
                In no event will SkyCast AI, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the Application, any websites linked to it, any content on the Application or such other websites, including any direct, indirect, special, incidental, consequential, or punitive damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Changes to Terms of Service</h2>
              <p className="mb-4">
                We may revise and update these Terms of Service from time to time in our sole discretion. All changes are effective immediately when we post them. Your continued use of the Application following the posting of revised Terms of Service means that you accept and agree to the changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us at <a href="mailto:eleandro1302@gmail.com" className="text-sky-400 hover:underline">eleandro1302@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
