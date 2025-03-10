import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-4 text-center text-gray-600 text-sm">
      <div className="flex items-center justify-center">
        <span>Made with</span>
        <Heart size={14} className="mx-1 text-red-500 fill-red-500" />
        <span>for the Muslim community</span>
      </div>
      <div className="mt-1">
        <span>&copy; {new Date().getFullYear()} Islamic Prayer Times Dashboard</span>
      </div>
    </footer>
  );
};

export default Footer;
