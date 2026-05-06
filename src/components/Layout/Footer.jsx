import React from 'react';
import { FaCarSide, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 mt-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          {/* About */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
              <FaCarSide className="text-2xl text-blue-500" />
              <h2 className="text-xl font-bold text-white">Smart<span className="text-blue-500">Driving</span></h2>
            </div>
            <p className="text-sm">Your trusted partner for driving education and license preparation.</p>
          </div>
          
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-blue-500 transition-colors">Home</a></li>
              <li><a href="/dashboard" className="hover:text-blue-500 transition-colors">Dashboard</a></li>
              <li><a href="/courses" className="hover:text-blue-500 transition-colors">Courses</a></li>
              <li><a href="/questions" className="hover:text-blue-500 transition-colors">Practice Questions</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-2">
              <p className="flex items-center gap-2 justify-center md:justify-start"><FaEnvelope /> support@smartdriving.com</p>
              <p className="flex items-center gap-2 justify-center md:justify-start"><FaPhone /> +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container-custom text-center py-6 text-sm">
          <p>&copy; 2025 Smart Driving Site. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;