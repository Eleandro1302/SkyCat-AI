import React, { useState } from 'react';
import { Mail, Send, MessageSquare, User } from 'lucide-react';
import { motion } from 'motion/react';
import { t } from '../utils/i18n';

const Contact: React.FC = () => {
  const trans = t();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {trans.contactTitle || 'Contact Us'}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {trans.contactSub || 'Have questions or feedback? We would love to hear from you. Our team is dedicated to providing the best weather experience.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Email</h3>
                  <a 
                    href="mailto:eleandro1302@gmail.com" 
                    className="text-slate-400 text-sm hover:text-sky-400 transition-colors"
                  >
                    eleandro1302@gmail.com
                  </a>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                For general inquiries, technical support, or partnership opportunities, please reach out via email.
              </p>
            </div>

            <a 
              href="https://www.linkedin.com/in/eleandro-mangrich" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-slate-900/50 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-md hover:border-sky-500/30 transition-colors group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center group-hover:bg-sky-500/10 transition-colors">
                  <MessageSquare className="w-6 h-6 text-indigo-400 group-hover:text-sky-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Community</h3>
                  <p className="text-slate-400 text-sm">Join our weather enthusiasts</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Follow us on LinkedIn for daily weather updates, climate insights, and community highlights.
              </p>
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 border border-slate-800/50 p-8 rounded-[2.5rem] backdrop-blur-md"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-400 text-sm">Thank you for reaching out. We will get back to you as soon as possible.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-sky-400 text-sm font-bold uppercase tracking-widest hover:text-sky-300 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form 
                action="https://formspree.io/eleandro1302@gmail.com" 
                method="POST"
                onSubmit={(e) => {
                  // We still want to show the success state in the UI
                  // Formspree can handle AJAX submissions if we use fetch, 
                  // but for simplicity we can just let it redirect or use fetch.
                  // Let's use fetch to keep the SPA feel.
                  e.preventDefault();
                  setIsSubmitting(true);
                  const form = e.target as HTMLFormElement;
                  const data = new FormData(form);
                  fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                      'Accept': 'application/json'
                    }
                  }).then(response => {
                    setIsSubmitting(false);
                    if (response.ok) {
                      setSubmitted(true);
                      form.reset();
                    } else {
                      alert("Oops! There was a problem submitting your form. Please try again later.");
                    }
                  }).catch(() => {
                    setIsSubmitting(false);
                    alert("Oops! There was a problem submitting your form. Please check your connection.");
                  });
                }} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <User className="w-3 h-3" /> Name
                  </label>
                  <input 
                    required
                    name="name"
                    type="text" 
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <input 
                    required
                    name="email"
                    type="email" 
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> Message
                  </label>
                  <textarea 
                    required
                    name="message"
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50 transition-colors resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
