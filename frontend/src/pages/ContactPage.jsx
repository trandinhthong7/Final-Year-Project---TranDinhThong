import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaClock } from "react-icons/fa";




const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call backend API to send email
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/contact`,
        formData
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again later.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#001e1d] mb-4">Contact Us</h1>
          <p className="text-lg text-[#004643]">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-[#004643] rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-[#fffffe] mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#fffffe] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border bg-[#abd1c6] border-[#abd1c6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#abd1c6] focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#fffffe] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border bg-[#abd1c6] border-[#abd1c6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#abd1c6] focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#fffffe] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border bg-[#abd1c6] border-[#abd1c6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#abd1c6] focus:border-transparent"
                  placeholder="+84 123 456 789"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#fffffe] mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border bg-[#abd1c6] border-[#abd1c6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#abd1c6] focus:border-transparent resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#f9bc60] text-[#001e1d] font-semibold py-3 px-6 rounded-md hover:scale-105 transition-transform disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Store Information */}
            <div className="bg-[#004643] rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#fffffe] mb-6">Store Information</h2>
              
              {/* Address */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="w-6 h-6 text-[#fffffe] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#fffffe] mb-1">Address</h3>
                    <p className="text-[#abd1c6]">
                      74 Định Công, Phường Định Công<br />
                      Quận Hoàng Mai, Thành phố Hà Nội<br />
                      Vietnam
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <FaPhoneAlt className="w-6 h-6 text-[#fffffe] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#fffffe] mb-1">Phone</h3>
                    <p className="text-[#abd1c6]">+84 123 456 789</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <IoIosMail className="w-6 h-6 text-[#fffffe] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#fffffe] mb-1">Email</h3>
                    <p className="text-[#abd1c6]">contact@tdtstadium.com</p>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div>
                <div className="flex items-start gap-3">
                  <FaClock className="w-6 h-6 text-[#fffffe] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#fffffe] mb-1">Operating Hours</h3>
                    <p className="text-[#abd1c6]">
                      Daily: 06:00 - 23:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-[#004643] rounded-lg shadow-md p-4">
              <div className="w-full h-64 bg-[#001e1d] rounded-md flex items-center justify-center">
                <p className="text-[#fffffe]">Map Location</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
