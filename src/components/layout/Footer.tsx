import Link from "next/link";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

function Footer() {
  return (
    <>
      <footer className="bg-background/50 text-gray-200 py-8">
        <div className="px-4 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Company Branding */}
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h1 className="text-2xl font-bold">FinX</h1>
              <p className="text-sm mt-2">© 2025 FinX All rights reserved.</p>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <FaTwitter size={20} />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <FaFacebookF size={20} />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <FaInstagram size={20} />
              </Link>
              <Link
                href="https://linkedin.com/in/wasifur-rahman-efaz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <FaLinkedinIn size={20} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
