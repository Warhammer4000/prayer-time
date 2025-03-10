import React from 'react';
import { Moon, Sun } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Moon size={28} className="mr-3" />
          <div>
            <h1 className="text-2xl font-bold">Islamic Prayer Times</h1>
            <p className="text-indigo-100 text-sm">Track your daily prayers with ease</p>
          </div>
        </div>
        <div className="hidden md:flex items-center bg-white/10 px-3 py-1.5 rounded-full">
          <Sun size={16} className="text-yellow-300 mr-2" />
          <span className="text-sm font-medium">Blessed day</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
