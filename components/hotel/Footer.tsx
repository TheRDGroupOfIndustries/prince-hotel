
"use client";

import React from "react";
import { FooterContent } from "./FooterContent";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        {/* Footer Columns */}
        <FooterContent />

        {/* Bottom Text */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            © 2025 Hotel Prince Diamond. All rights reserved. |
            <a
              href="#"
              className="ml-1 text-blue-400 hover:text-blue-300 transition"
            >
              Website Builder
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
