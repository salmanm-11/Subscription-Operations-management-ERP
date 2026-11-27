import React from 'react';
import { CheckCircle2, Mail } from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Help &amp; Operational Manual</h2>
        <p className="text-xs text-slate-400 mt-0.5">Quick guide to running daily mess operations with Karama Mess Software</p>
      </div>

      {/* Official Developer & Technical Support Card */}
      <div className="bg-[#16181d] border border-amber-500/40 rounded-2xl p-6 shadow-lg space-y-4">
        <div>
          <div className="text-xs text-slate-400 font-medium">Developer</div>
          <div className="text-lg font-bold text-amber-400 mt-0.5 tracking-wide">
            Hiro Axis Technologies
          </div>
        </div>

        <div className="flex items-center gap-3.5 pt-3 border-t border-slate-800">
          <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shrink-0 shadow-md shadow-amber-500/20">
            <Mail className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              OFFICIAL SUPPORT EMAIL
            </div>
            <a 
              href="mailto:hiroaxistechnologies@gmail.com" 
              className="text-white hover:text-amber-400 font-bold text-sm sm:text-base tracking-wide transition-colors select-text"
            >
              hiroaxistechnologies@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="bg-[#16181d] border border-[#242730] rounded-2xl p-6 shadow-lg space-y-4 text-xs text-slate-300">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>Core Daily Workflow</span>
        </h3>

        <div className="space-y-2.5 pl-6 border-l border-slate-700/60">
          <div>
            <div className="font-bold text-white">1. Register New Customers</div>
            <p className="text-slate-400 mt-0.5">
              Go to <b>Customers &gt; Add Customer</b>. Enter customer name, mobile number, assigned building, room number, dietary customizations (e.g. Barik rice, No fish curry), and monthly subscription rate in AED.
            </p>
          </div>

          <div>
            <div className="font-bold text-white">2. Daily Kitchen &amp; Attendance Tracking</div>
            <p className="text-slate-400 mt-0.5">
              Open <b>Meal Attendance</b>. Select the meal slot (Breakfast, Lunch, or Dinner). Toggle customers Present or Absent. Use <b>Mark All Present</b> for rapid batch verification.
            </p>
          </div>

          <div>
            <div className="font-bold text-white">3. Monthly Invoicing</div>
            <p className="text-slate-400 mt-0.5">
              Open <b>Billing &amp; Invoices &gt; Generate Invoice</b>. Invoices are calculated accurately in AED and can be printed or exported as PDF receipts.
            </p>
          </div>

          <div>
            <div className="font-bold text-white">4. Manual Payment Recording</div>
            <p className="text-slate-400 mt-0.5">
              When customers settle their dues via Cash, Bank Transfer, or Card, navigate to <b>Payments &gt; Record Payment</b>. The customer's overdue balance is automatically reduced.
            </p>
          </div>

          <div>
            <div className="font-bold text-white">5. Overdue Follow-ups via WhatsApp</div>
            <p className="text-slate-400 mt-0.5">
              In <b>Overdue Accounts</b>, click the WhatsApp button to generate a pre-formatted UAE dirhams payment reminder directly to the customer's phone!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
