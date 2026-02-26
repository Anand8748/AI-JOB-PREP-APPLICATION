import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuth } from "../slices/generalInfo.slice";
import { useApi } from "../utils/api.js";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const payload = isSignup 
        ? { userName: formData.userName, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await api.post(endpoint, payload);

      if (response.data.success) {
        dispatch(
          setAuth({
            userId: response.data.userId,
            token: response.data.token,
            userName: response.data.userName,
          })
        );
        toast.success(isSignup ? "Account created successfully!" : "Login successful!");
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || `${isSignup ? "Signup" : "Login"} failed. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0B0F19] to-[#0F172A]">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center text-white mr-3 shadow-lg shadow-[#38BDF8]/25">
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  fill="currentColor"
                >
                  <path d="M96 96V256c0 53 43 96 96 96s96-43 96-96H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V192H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V128H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80c0-53-43-96-96-96S96 43 96 96zM320 240v16c0 70.7-57.3 128-128 128s-128-57.3-128-128V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v24z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-[#E5E7EB]">Interview AI</span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center space-x-8">
              <a
                href="/"
                className="text-[#9CA3AF] hover:text-[#E5E7EB] font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="/login"
                className="px-5 py-2.5 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-medium rounded-full transition-all duration-200 shadow-lg shadow-[#38BDF8]/25 hover:shadow-xl hover:shadow-[#38BDF8]/30"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#38BDF8]/10 to-[#0EA5E9]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[#38BDF8]/8 to-[#0EA5E9]/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#38BDF8]/5 via-[#0EA5E9]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen relative">
        <div className={`max-w-md w-full transform transition-all duration-700 ease-out ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-98'}`}>
          <div className="backdrop-blur-xl rounded-2xl shadow-2xl border border-white/8 p-8 relative overflow-hidden" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)' }}>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/5 via-transparent to-[#0EA5E9]/5 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#E5E7EB] mb-3 tracking-tight">
                  {isSignup ? "Create your account" : "Sign in to your account"}
                </h2>
                <p className="text-[#9CA3AF] text-base leading-relaxed">
                  Practice AI-powered interviews and get real-time feedback
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-5">
                  {isSignup && (
                    <div className="relative">
                      <label htmlFor="userName" className="block text-sm font-medium text-[#E5E7EB] mb-2">
                        User name
                      </label>
                      <div className="relative">
                        <input
                          id="userName"
                          name="userName"
                          type="text"
                          autoComplete="username"
                          required
                          className={`w-full pl-11 pr-4 py-3.5 bg-[#0F172A] border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder-[#6B7280] text-[#E5E7EB] ${
                            focusedField === 'userName' 
                              ? 'border-[#38BDF8] ring-[#38BDF8]/20 shadow-lg shadow-[#38BDF8]/10' 
                              : 'border-white/8 hover:border-white/12'
                          }`}
                          placeholder="Enter your full name"
                          value={formData.userName}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('userName')}
                          onBlur={() => setFocusedField(null)}
                        />
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-[#E5E7EB] mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className={`w-full pl-11 pr-4 py-3.5 bg-[#0F172A] border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder-[#6B7280] text-[#E5E7EB] ${
                          focusedField === 'email' 
                            ? 'border-[#38BDF8] ring-[#38BDF8]/20 shadow-lg shadow-[#38BDF8]/10' 
                            : 'border-white/8 hover:border-white/12'
                        }`}
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-[#E5E7EB] mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete={isSignup ? "new-password" : "current-password"}
                        required
                        className={`w-full pl-11 pr-4 py-3.5 bg-[#0F172A] border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder-[#6B7280] text-[#E5E7EB] ${
                          focusedField === 'password' 
                            ? 'border-[#38BDF8] ring-[#38BDF8]/20 shadow-lg shadow-[#38BDF8]/10' 
                            : 'border-white/8 hover:border-white/12'
                        }`}
                        placeholder={isSignup ? "Create a strong password" : "Enter your password"}
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 flex items-center justify-center px-6 border border-transparent text-base font-medium rounded-full text-white bg-[#38BDF8] hover:bg-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:ring-offset-2 focus:ring-offset-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-[#38BDF8]/25 hover:shadow-xl hover:shadow-[#38BDF8]/30 hover:-translate-y-0.5 active:scale-95"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isSignup ? "Creating account..." : "Signing in..."}
                      </span>
                    ) : (
                      <span>{isSignup ? "Create account" : "Sign In"}</span>
                    )}
                  </button>
                </div>

                <div className="text-center pt-6 border-t border-white/8 space-y-3">
                  <a
                    href="/"
                    className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors duration-200"
                  >
                    Continue as guest
                  </a>
                  <div className="text-sm text-[#9CA3AF]">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignup(!isSignup)}
                      className="font-medium text-[#38BDF8] hover:text-[#0EA5E9] transition-colors duration-200"
                    >
                      {isSignup ? "Sign in" : "Create a new account"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
