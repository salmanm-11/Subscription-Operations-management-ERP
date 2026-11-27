import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Check,
  Loader2
} from 'lucide-react';
import { AuthService, AppUser } from '../../api/authService';
import { ActivityLogService } from '../../api/activityLogService';
import winterBg from '../../assets/winter-mountain-bg.jpg';

interface LoginViewProps {
  onLoginSuccess: (user: AppUser) => void;
  onOpenCustomerRegister?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onOpenCustomerRegister }) => {
  const [username, setUsername] = useState(() => {
    try {
      return localStorage.getItem('karama_remembered_username') || '';
    } catch {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return localStorage.getItem('karama_remember_me') === 'true';
    } catch {
      return true;
    }
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // Instantly focus window and appropriate input on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.focus();
    }
    const focusTarget = () => {
      if (!username && usernameRef.current) {
        usernameRef.current.focus();
      } else if (passwordRef.current) {
        passwordRef.current.focus();
      }
    };

    focusTarget();
    const raf = requestAnimationFrame(focusTarget);
    const t1 = setTimeout(focusTarget, 50);
    const t2 = setTimeout(focusTarget, 150);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [username]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    const cleanUsername = username.trim();

    try {
      if (rememberMe) {
        localStorage.setItem('karama_remember_me', 'true');
        localStorage.setItem('karama_remembered_username', cleanUsername);
      } else {
        localStorage.removeItem('karama_remember_me');
        localStorage.removeItem('karama_remembered_username');
      }
    } catch {
      // ignore local storage restrictions
    }

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
      passwordRef.current?.focus();
      passwordRef.current?.select();
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-8 relative bg-cover bg-center bg-no-repeat bg-[#0f172a] select-none"
      style={{ backgroundImage: `url(${winterBg})` }}
    >
      {/* Subtle Twilight & Vignette Overlays for Depth & Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 via-black/25 to-slate-950/60 pointer-events-none" />
      <div className="absolute inset-0 bg-black/15 backdrop-brightness-[0.95] pointer-events-none" />

      {/* Main Glassmorphic Login Card */}
      <div className="w-full max-w-[390px] sm:max-w-[410px] relative z-20">
        <div className="relative rounded-[32px] bg-slate-900/35 backdrop-blur-2xl border border-white/25 p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shadow-black/60 transition-all">
          
          {/* Card Header */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-sm font-sans">
              Login
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-normal mt-2 leading-relaxed tracking-normal">
              Welcome back please login to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-2xl bg-rose-500/25 border border-rose-400/40 text-rose-100 text-xs flex items-start gap-2.5 backdrop-blur-md animate-fadeIn shadow-lg shadow-rose-950/40">
                <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                <span className="leading-snug">{loginError}</span>
              </div>
            )}

            {/* User Name Input */}
            <div>
              <div 
                onClick={() => usernameRef.current?.focus()}
                className="relative flex items-center justify-between rounded-2xl border border-white/30 bg-white/[0.07] hover:bg-white/[0.1] focus-within:border-white/70 focus-within:bg-white/[0.14] transition-all px-4 py-3 cursor-text group shadow-inner shadow-black/10"
              >
                <input
                  ref={usernameRef}
                  id="login-username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      passwordRef.current?.focus();
                      passwordRef.current?.select();
                    }
                  }}
                  placeholder="User Name"
                  autoComplete="username"
                  className="w-full pr-3 bg-transparent text-white placeholder-white/50 text-sm font-medium focus:outline-none cursor-text"
                />
                <User className="w-5 h-5 text-white/70 group-focus-within:text-white transition-colors shrink-0 pointer-events-none stroke-[1.7]" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div 
                onClick={() => passwordRef.current?.focus()}
                className="relative flex items-center justify-between rounded-2xl border border-white/30 bg-white/[0.07] hover:bg-white/[0.1] focus-within:border-white/70 focus-within:bg-white/[0.14] transition-all px-4 py-3 cursor-text group shadow-inner shadow-black/10"
              >
                <input
                  ref={passwordRef}
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full pr-3 bg-transparent text-white placeholder-white/50 text-sm font-medium focus:outline-none cursor-text font-mono tracking-wide"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  className="text-white/70 hover:text-white p-1 transition-colors cursor-pointer shrink-0"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5 stroke-[1.7]" />
                  ) : (
                    <EyeOff className="w-5 h-5 stroke-[1.7]" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2.5 pt-0.5 pb-1">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                  rememberMe 
                    ? 'bg-[#5b8ea6] border-[#5b8ea6] text-white shadow-sm shadow-[#5b8ea6]/40' 
                    : 'border-white/40 bg-white/5 hover:border-white/60'
                }`}
                title="Toggle Remember Me"
              >
                {rememberMe && <Check className="w-3 h-3 text-white stroke-[3]" />}
              </button>
              <span 
                onClick={() => setRememberMe(!rememberMe)}
                className="text-xs text-white/85 font-medium cursor-pointer select-none hover:text-white transition-colors"
              >
                Remember me
              </span>
            </div>

            {/* Login Button */}
            <button
              ref={submitRef}
              type="submit"
              disabled={isLoading}
              title="Sign In"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#6292ac] to-[#456e85] hover:from-[#6fa1bc] hover:to-[#507d96] text-white text-base font-bold shadow-lg shadow-black/40 border border-white/20 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Logging In...</span>
                </>
              ) : (
                <span>Login</span>
              )}
              <span className="sr-only">Sign In</span>
            </button>

            {/* Don't have an account? Signup */}
            <div className="text-center pt-2">
              <span className="text-xs text-white/80 font-normal">
                Don't have an account?{' '}
              </span>
              <button
                type="button"
                onClick={onOpenCustomerRegister}
                className="text-xs font-bold text-white hover:underline transition-all cursor-pointer inline-block"
              >
                Signup
              </button>
            </div>

            {/* Footer Attribution */}
            <div className="text-center pt-4">
              <span className="text-[11px] text-white/45 tracking-wider font-medium select-none">
                created by <span className="font-semibold text-white/70">Exnihiloo</span>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
