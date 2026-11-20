import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setRole, contactDetails } = useApp();

  return (
    <footer className="no-print bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <Logo size={46} />
              <span className="text-2xl font-extrabold tracking-tight text-white flex items-center">
                A2Z
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Build Skills. Gain Experience. Launch Your Career. A2Z unites forward-thinking students, industry mentors, and hiring companies in one integrated ecosystem.
            </p>
          </div>

          {/* Col 2: For Candidates */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Students
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigateTo('internship-registration')} className="hover:text-blue-400 transition-colors cursor-pointer text-blue-400 font-semibold flex items-center gap-1">
                  <span>Internship Registration</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('career')} className="hover:text-blue-400 transition-colors cursor-pointer text-slate-300 font-medium flex items-center gap-1">
                  <span>Careers & Job Openings</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">Hiring</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-blue-400 transition-colors cursor-pointer text-slate-300 font-medium">
                  Our Services & Training
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('all-programs')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Featured Programs
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('application')} className="hover:text-blue-400 transition-colors cursor-pointer text-slate-300">
                  Apply / Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => { setRole('student'); navigateTo('student-certificates'); }} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Certificates Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Verification & Trust */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Trust & Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigateTo('verify-certificate')} className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Certificate</span>
                </button>
              </li>
              {contactDetails?.phone && (
                <li className="text-xs text-slate-300">
                  <span className="text-slate-500 block">Helpline:</span>
                  <a href={`tel:${contactDetails.phone}`} className="hover:text-blue-400 font-medium">
                    {contactDetails.phone}
                  </a>
                </li>
              )}
              {contactDetails?.email && (
                <li className="text-xs text-slate-300">
                  <span className="text-slate-500 block">Admissions:</span>
                  <a href={`mailto:${contactDetails.email}`} className="hover:text-blue-400 font-medium">
                    {contactDetails.email}
                  </a>
                </li>
              )}
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-blue-400 transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} A2Z Technologies Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
