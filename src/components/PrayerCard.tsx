import React from 'react';
import { Prayer } from '../types';
import { Clock } from 'lucide-react';

interface PrayerCardProps {
  prayer: Prayer;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ prayer }) => {
  return (
    <div 
      className={`rounded-lg p-4 shadow-md transition-all duration-300 ${
        prayer.isActive 
          ? 'bg-emerald-50 border-l-4 border-emerald-500 shadow-emerald-100' 
          : 'bg-white hover:shadow-lg'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{prayer.name}</h3>
          <p className="text-sm font-medium text-gray-500 font-arabic">{prayer.arabicName}</p>
        </div>
        {prayer.isActive && (
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">
            Current
          </span>
        )}
      </div>
      
      <div className="flex items-center mt-3 text-gray-700">
        <Clock size={16} className="mr-2 text-gray-500" />
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-sm font-medium">Start:</span>
            <span className="ml-2 text-sm">{prayer.startTime}</span>
          </div>
          {prayer.endTime && (
            <div className="flex items-center mt-1">
              <span className="text-sm font-medium">End:</span>
              <span className="ml-2 text-sm">{prayer.endTime}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayerCard;
