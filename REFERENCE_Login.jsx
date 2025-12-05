// ============================================
// FINAL LOGIN.JSX (KEY CHANGES)
// Location: frontend/src/pages/Login.jsx
// ============================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Phone } from "lucide-react";
import { toast } from "sonner";

function Login() {
  const navigate = useNavigate();
  const { login: authLogin, register: authRegister } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isLogin) {
        // Login
        const result = await authLogin(formData.email, formData.password);
        if (result.success) {
          toast.success("✅ Login successful!");
          const user = result.user;
          
          // Redirect based on role
          if (user.isAdmin) {
            setTimeout(() => navigate("/admin"), 500);
          } else {
            setTimeout(() => navigate("/profile"), 500);
          }
        }
      } else {
        // Register
        if (!formData.name || !formData.email || !formData.password) {
          setError("Please fill in all required fields");
          setLoading(false);
          return;
        }
        const result = await authRegister(formData.name, formData.email, formData.password, formData.phone);
        if (result.success) {
          toast.success("✅ Registration successful!");
          const user = result.user;
          
          // Redirect based on role
          if (user.isAdmin) {
            setTimeout(() => navigate("/admin"), 500);
          } else {
            setTimeout(() => navigate("/profile"), 500);
          }
        }
      }
    } catch (err) {
      const errorMsg = err.message || "Something went wrong";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="text-4xl">🎂</span>
          <span className="text-2xl font-bold text-pink-600">Cakesman</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setIsLogin(true);
                setFormData({ email: "", password: "", name: "", phone: "" });
                setError("");
                setMessage("");
              }}
              className={`flex-1 py-3 rounded-full font-semibold transition ${
                isLogin
                  ? "bg-pink-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setFormData({ email: "", password: "", name: "", phone: "" });
                setError("");
                setMessage("");
              }}
              className={`flex-1 py-3 rounded-full font-semibold transition ${
                !isLogin
                  ? "bg-pink-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Register
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Phone Field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ email: "", password: "", name: "", phone: "" });
                setError("");
                setMessage("");
              }}
              className="text-pink-600 font-semibold hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>

        {/* Back to Home */}
        <Link
          to="/"
          className="block text-center mt-6 text-gray-600 hover:text-pink-600 transition font-semibold"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Login;

// ============================================
// KEY CHANGES IN THIS FILE:
// ============================================
// 1. Import useAuth hook instead of api
// 2. Import toast from sonner
// 3. Use authLogin/authRegister from context
// 4. Return { success: true, user } from context methods
// 5. Redirect based on user.isAdmin
// 6. Show success toast on successful login/register
// 7. Navigate to /profile or /admin based on role
