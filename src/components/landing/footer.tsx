'use client';

import Link from 'next/link';
import { Github, Twitter, Youtube, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Footer() {
  const [isMounted, setIsMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <footer className="relative bg-zinc-950/95 border-t border-zinc-800/50">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:14px_24px] opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-zinc-500 to-zinc-900 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-indigo-300">
                ConvoX-Org
              </span>
            </div>
            <p className="text-zinc-400 text-base leading-relaxed max-w-md mb-8">
              The lightweight video calling app that runs seamlessly in the background. 
              Connect with friends while gaming or working without interruption.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Github, href: '#', label: 'GitHub' },
               
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="group p-2 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:bg-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 relative">
              Product
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-zinc-500 to-indigo-200 rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Features', href: '#features' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'Roadmap', href: '#roadmap' },
                { name: 'Security', href: '#security' },
                { name: 'API Docs', href: '#api' },
              ].map(({ name, href }) => (
                <li key={name}>
                  <Link 
                    href={href} 
                    className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 relative">
              Support
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-zinc-500 to-indigo-200 rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Help Center', href: '#help' },
                { name: 'Community', href: '#community' },
                { name: 'Contact Us', href: '#contact' },
                { name: 'System Status', href: '#status' },
                { name: 'Bug Reports', href: '#bugs' },
              ].map(({ name, href }) => (
                <li key={name}>
                  <Link 
                    href={href} 
                    className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 relative">
              Company
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-zinc-500 to-indigo-200 rounded-full"></div>
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'About Us', href: '#about' },
                { name: 'Blog', href: '#blog' },
                { name: 'Careers', href: '#careers' },
                { name: 'Privacy Policy', href: '#privacy' },
                { name: 'Terms of Service', href: '#terms' },
              ].map(({ name, href }) => (
                <li key={name}>
                  <Link 
                    href={href} 
                    className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-800/50 mt-16 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-zinc-400 text-sm">
              <p>© {currentYear} ConvoX. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                <Link href="#privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
                <span className="text-zinc-600">•</span>
                <Link href="#terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
                <span className="text-zinc-600">•</span>
                <Link href="#cookies" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50 transition-all">
                <Mail className="w-4 h-4 text-zinc-400 mr-2" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-500 w-48"
                />
              </div>
              <button className="bg-gradient-to-r from-zinc-600 to-zinc-900 hover:from-zinc-700 hover:to-zinc-950 text-white text-sm font-medium px-6 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-32 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent"></div>
    </footer>
  );
}
