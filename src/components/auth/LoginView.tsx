import React, { useState, useRef, useEffect } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle,
  LogIn,
  ChefHat
} from 'lucide-react';
import { AuthService, AppUser } from '../../api/authService';
import { ActivityLogService } from '../../api/activityLogService';
import appIcon from '../../assets/app-icon.png';
import loginBg from '../../assets/login-bg.jpg';

interface LoginViewProps {
  onLoginSuccess: (user: AppUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // Instantly focus window and username on mount with progressive retries
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.focus();
    }
    const focusUsername = () => {
      if (usernameRef.current) {
        usernameRef.current.focus();
      }
    };

    focusUsername();
    const raf = requestAnimationFrame(focusUsername);
    const t1 = setTimeout(focusUsername, 40);
    const t2 = setTimeout(focusUsername, 120);
    const t3 = setTimeout(focusUsername, 300);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    const cleanUsername = username.trim();
    const result = AuthService.login(cleanUsername, password);
    if (result.success && result.user) {
      ActivityLogService.logAction(
        'Authentication',
        'LOGIN',
        'User Login Session',
        `User "${result.user.username}" (${result.user.roleTitle}) logged into application.`,
        { userName: result.user.username, userRole: result.user.roleTitle, status: 'success' }
      );
      onLoginSuccess(result.user);
    } else {
      ActivityLogService.logAction(
        'Authentication',
        'LOGIN',
        'Failed Login Attempt',
        `Failed login attempt for username "${cleanUsername}". Reason: ${result.error || 'Invalid credentials'}.`,
        { userName: cleanUsername, status: 'warning' }
      );
      setLoginError(result.error || 'Invalid username or password. Please try again.');
      setIsLoading(false);
      usernameRef.current?.focus();
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-8 relative bg-cover bg-center bg-no-repeat bg-[#080d16]"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Dark Vignette Overlay for focus and contrast */}
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

      {/* Main Center Container */}
      <div className="w-full max-w-[390px] relative z-20 flex flex-col items-center">
        
        {/* Left Chalk Notes */}
        <div className="hidden lg:flex flex-col items-center absolute -left-40 xl:-left-48 top-12 pointer-events-none select-none text-slate-300/40 font-serif italic text-base lg:text-lg leading-tight tracking-wider text-center rotate-[-4deg]">
          <span>Fresh</span>
          <span>Healthy</span>
          <span>Happier</span>
          <span>Together</span>
          <span className="text-xs mt-1 text-slate-400/50">♡</span>
        </div>

        {/* Right Chalk Notes */}
        <div className="hidden lg:flex flex-col items-center absolute -right-40 xl:-right-48 top-12 pointer-events-none select-none text-slate-300/40 font-serif italic text-base lg:text-lg leading-tight tracking-wider text-center rotate-[4deg]">
          <span>Good</span>
          <span>Food</span>
          <span>Better</span>
          <span>Days</span>
          <span className="text-xs mt-1 text-slate-400/50">♡</span>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-3 pointer-events-none flex flex-col items-center select-none">
          <img 
            src={appIcon} 
            alt="Karama Mess" 
            className="w-16 h-16 rounded-2xl mb-2.5 shadow-2xl shadow-black/80 object-cover border border-emerald-500/30"
          />
          <h1 className="text-2xl font-black text-white tracking-wider font-sans drop-shadow-md">
            KARAMA MESS
          </h1>
          <p className="text-[11px] text-amber-400 font-bold uppercase tracking-widest mt-0.5 drop-shadow">
            Management &amp; Catering Software
          </p>

          {/* Golden Chef Hat Divider */}
          <div className="flex items-center justify-center gap-3 my-2 opacity-90">
            <div className="h-[1px] w-12 bg-amber-500/50" />
            <ChefHat className="w-4 h-4 text-amber-400" />
            <div className="h-[1px] w-12 bg-amber-500/50" />
          </div>
        </div>

        {/* Card Box */}
        <div className="w-full bg-[#131b26]/95 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/95 relative z-20 backdrop-blur-md">
          <div className="pb-2.5 mb-3 text-center border-b border-slate-800">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Sign In
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Access your mess management system
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Username Input Box */}
            <div>
              <label 
                htmlFor="login-username" 
                className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 cursor-pointer"
              >
                Username
              </label>
              <div 
                onClick={() => usernameRef.current?.focus()}
                className="relative cursor-text group"
              >
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-amber-400 transition-colors" />
                <input
                  ref={usernameRef}
                  id="login-username"
                  name="username"
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      passwordRef.current?.focus();
                      passwordRef.current?.select();
                    }
                  }}
                  placeholder="Enter your username"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#17202e] border border-slate-700 hover:border-slate-600 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors cursor-text pointer-events-auto"
                />
              </div>
            </div>

            {/* Password Input Box */}
            <div>
              <label 
                htmlFor="login-password" 
                className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 cursor-pointer"
              >
                Password
              </label>
              <div 
                onClick={() => passwordRef.current?.focus()}
                className="relative cursor-text group"
              >
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-amber-400 transition-colors" />
                <input
                  ref={passwordRef}
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-2.5 bg-[#17202e] border border-slate-700 hover:border-slate-600 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors cursor-text pointer-events-auto font-mono"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1.5 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              ref={submitRef}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99] mt-3 disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
