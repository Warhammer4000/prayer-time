import React from 'react';
import { Prayer } from '../types';
import PrayerCard from './PrayerCard';
import { Compass } from 'lucide-react';

interface PrayerTimesDisplayProps {
  prayers: Prayer[];
  isLoading: boolean;
}

const PrayerTimesDisplay: React.FC<PrayerTimesDisplayProps> = ({ prayers, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md mb-4 flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Loading prayer times...</p>
      </div>
    );
  }

  if (!prayers || prayers.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md mb-4 flex flex-col items-center justify-center min-h-[300px]">
        <Compass size={48} className="text-gray-400 mb-4" />
        <p className="text-gray-600 text-center">
          No prayer times available. Please check your location settings.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Prayer Times</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prayers.map((prayer) => (
          <PrayerCard key={prayer.name} prayer={prayer} />
        ))}
      </div>
    </div>
  );
};

export default PrayerTimesDisplay;
