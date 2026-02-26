import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuth } from "../slices/generalInfo.slice";
import { useApi } from "../utils/api.js";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = useApi();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/signup", {
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
        });

      if (response.data.success) {
        dispatch(
          setAuth({
            userId: response.data.userId,
            token: response.data.token,
            userName: response.data.userName,
          })
        );
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Or{" "}
            <a
              href="/login"
              className="font-medium text-[#38BDF8] hover:text-[#3B82F6]"
            >
              sign in to your existing account
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6 glass-card rounded-3xl p-8" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-200">
                User name
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                autoComplete="username"
                required
                className="mt-1 appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 placeholder-gray-400 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] sm:text-sm"
                placeholder="User name"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 placeholder-gray-400 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 placeholder-gray-400 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] sm:text-sm"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 placeholder-gray-400 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] sm:text-sm"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-[#38BDF8] hover:bg-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#38BDF8] disabled:opacity-50 shadow-lg shadow-[#38BDF8]/30"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/"
              className="text-sm text-gray-400 hover:text-gray-200"
            >
              Continue as guest
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
