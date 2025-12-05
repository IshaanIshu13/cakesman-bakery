import React, { useState } from "react";
import "../styles/animations.css";

function LoginModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    birthDate: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // TODO: Implement login logic
      setMessage("✅ Login verification email sent!");
    } else {
      // TODO: Implement sign up logic
      setMessage("✅ Sign up successful! Please check your email.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-md w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-500">
          <div className="text-center">
            <h2 className="mt-2 text-center text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Welcome to Cakesman Bakery
            </h2>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isLogin
                    ? "bg-pink-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-pink-50"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  !isLogin
                    ? "bg-pink-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-pink-50"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <>
                  <div className="transform transition-all duration-500">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="transform transition-all duration-500">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required={!isLogin}
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="transform transition-all duration-500">
                    <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                    <input
                      type="date"
                      name="birthDate"
                      required={!isLogin}
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="mt-1 appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                    />
                  </div>
                </>
              )}
              <div className="transform transition-all duration-500">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {isLogin ? "Send Verification Email" : "Create Account"}
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-4 text-center text-sm font-medium text-green-600 animate-fadeIn">
              {message}
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-pink-200 rounded-full opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-200 rounded-full opacity-50 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
}

export default LoginModal;