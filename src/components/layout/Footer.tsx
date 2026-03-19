import React from "react";
import Link from "next/link";
import { FaTelegram, FaInstagram, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                Y
              </div>
              <span className="text-xl font-black text-dark-text tracking-tight">
                Yashil <span className="text-primary">Yo&apos;l</span>
              </span>
            </Link>
            <p className="text-gray-500 leading-relaxed font-medium">
              We make ride-sharing easy, safe, and affordable for everyone in Uzbekistan.
            </p>
          </div>

          <div>
            <h4 className="text-dark-text font-bold text-lg mb-6">Explore</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/rides" className="text-gray-500 hover:text-primary font-medium transition-colors">Find a Ride</Link>
              </li>
              <li>
                <Link href="/" className="text-gray-500 hover:text-primary font-medium transition-colors">How it works</Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-500 hover:text-primary font-medium transition-colors">Become a Driver</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-dark-text font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-primary font-medium transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/" className="text-gray-500 hover:text-primary font-medium transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/" className="text-gray-500 hover:text-primary font-medium transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-dark-text font-bold text-lg mb-6">Connect with us</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-light-bg flex items-center justify-center rounded-xl text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <FaTelegram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-light-bg flex items-center justify-center rounded-xl text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-light-bg flex items-center justify-center rounded-xl text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <FaFacebook size={20} />
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-400 font-medium">
              Available across all 14 regions of Uzbekistan.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm font-medium mb-4 md:mb-0">
            © {new Date().getFullYear()} Yashil Yo&apos;l. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400 font-medium">
            <Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
