import React from 'react';
import { Users, Utensils, TrendingUp, ArrowRight } from 'lucide-react';
import loginBg from '../../assets/login-bg.jpg';

interface MobileOnboardingViewProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

export const MobileOnboardingView: React.FC<MobileOnboardingViewProps> = ({
  onGetStarted,
  onSkip,
}) => {
  return (
    <div className="min-h-screen bg-[#FBF8F5] text-stone-800 flex flex-col justify-between p-6 max-w-md mx-auto select-none">
      {/* Top Bar: Brand Logo & Skip Button */}
      <header className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#7E1522] flex items-center justify-center text-white shadow-md shadow-[#7E1522]/20">
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C8.69 2 6 4.69 6 8C4.34 8 3 9.34 3 11C3 12.39 3.95 13.56 5.25 13.89C5.09 14.24 5 14.61 5 15C5 17.21 6.79 19 9 19H15C17.21 19 19 17.21 19 15C19 14.61 18.91 14.24 18.75 13.89C20.05 13.56 21 12.39 21 11C21 9.34 19.66 8 18 8C18 4.69 15.31 2 12 2ZM6 20H18V22H6V20Z" />
            </svg>
          </div>
          <div>
            <span className="font-black text-lg text-[#7E1522] tracking-tight">Karama Mess</span>
            <p className="text-[10px] text-stone-500 font-semibold leading-none">DUBAI • UAE</p>
          </div>
        </div>

        <button
          onClick={onSkip}
          className="text-stone-500 hover:text-stone-800 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-stone-200/50 transition-colors"
        >
          Skip
        </button>
      </header>

      {/* Hero Typography & Mission Statement */}
      <div className="my-auto py-4 space-y-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#5C101A] tracking-tight leading-[1.15]">
            Good Food,<br />
            Happier People
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 font-medium leading-relaxed max-w-xs">
            Manage meals, customers, and payments effortlessly in one place.
          </p>
        </div>

        {/* 3 Value Proposition Pills */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="bg-white rounded-2xl p-3 border border-[#EFE8DE] shadow-sm flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-1.5">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-stone-700 leading-tight">
              Manage Customers
            </span>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-[#EFE8DE] shadow-sm flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#7E1522] flex items-center justify-center mb-1.5">
              <Utensils className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-stone-700 leading-tight">
              Plan Meals
            </span>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-[#EFE8DE] shadow-sm flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-stone-700 leading-tight">
              Track Payments
            </span>
          </div>
        </div>

        {/* Hero Food Visual */}
        <div className="relative pt-3 flex justify-center">
          <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white">
            <img
              src={loginBg}
              alt="Karama Mess Catering"
              className="w-full h-full object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5C101A]/30 to-transparent" />
          </div>

          {/* Badge over image */}
          <div className="absolute -bottom-2 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full border border-[#EFE8DE] shadow-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-stone-700 font-mono">100% Live Cloud Synced</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls: Pagination Dots & Action Button */}
      <footer className="space-y-4 pb-2">
        <div className="flex items-center justify-center gap-2">
          <span className="w-6 h-2 rounded-full bg-[#7E1522]" />
          <span className="w-2 h-2 rounded-full bg-stone-300" />
          <span className="w-2 h-2 rounded-full bg-stone-300" />
        </div>

        <button
          onClick={onGetStarted}
          className="w-full py-4 px-6 rounded-2xl bg-[#7E1522] hover:bg-[#68111B] active:scale-[0.98] text-white font-bold text-sm shadow-xl shadow-[#7E1522]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
