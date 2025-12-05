import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! 🍰 We'll get back to you soon.");
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <div className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-orange-600 mb-4">
            📞 Contact Us
          </h1>
          <p className="text-gray-600">
            Have a question or special request? We'd love to hear from you!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-colors"
              placeholder="Your phone number"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-colors"
              placeholder="Your email"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-colors"
              placeholder="How can we help you?"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 px-6 rounded-full hover:bg-pink-700 transition-colors"
          >
            Send Message
          </button>
        </form>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-2xl mb-2">📍</div>
            <h3 className="font-semibold mb-2">Location</h3>
            <p className="text-gray-600">123 Cake Street, Bakery Town</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-2xl mb-2">📱</div>
            <h3 className="font-semibold mb-2">Phone</h3>
            <p className="text-gray-600">+1 234 567 8900</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-2xl mb-2">✉️</div>
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-gray-600">hello@cakesman.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;