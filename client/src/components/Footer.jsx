import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* About Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">About Us</h2>
          <p className="text-gray-400 text-sm">
            Blogs By Dannie shares insights, news, and tips on web development and lifestyle. We aim to inspire and educate our readers with quality content.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Quick Links</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/about" className="hover:text-white">About</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
            <li><a href="/blog" className="hover:text-white">Blog</a></li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Contact</h2>
          <p className="text-gray-400 text-sm">Email: <a href="mailto:info@blogsbydannie.com" className="hover:text-white">info@blogsbydannie.com</a></p>
          <p className="text-gray-400 text-sm">Phone: <a href="tel:+254111292444" className="hover:text-white">+254 111292444</a></p>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="text-gray-400 hover:text-white transition"><Facebook size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><Twitter size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><Instagram size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><Linkedin size={24} /></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center text-gray-500 text-sm py-4">
        &copy; {new Date().getFullYear()} Blogs by Dannie. All rights reserved.
      </div>
    </footer>
  );
}
