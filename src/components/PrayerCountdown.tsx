import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle } from 'lucide-react';
import { Prayer } from '../types';
import moment from 'moment';

interface PrayerCountdownProps {
  prayers: Prayer[];
}

const PrayerCountdown: React.FC<PrayerCountdownProps> = ({ prayers }) => {
  const [countdown, setCountdown] = useState<string>('');
  const [nextPrayer, setNextPrayer] = useState<Prayer | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<Prayer | null>(null);

  useEffect(() => {
    if (!prayers || prayers.length === 0) return;

    // Find current and next prayers
    const findPrayers = () => {
      const now = moment();
      
      // Find current prayer
      const current = prayers.find(prayer => prayer.isActive);
      setCurrentPrayer(current || null);
      
      // Find next prayer
      let next: Prayer | null = null;
      
      if (current) {
        // If there's a current prayer, find the next one
        const currentIndex = prayers.findIndex(p => p.name === current.name);
        const nextIndex = (currentIndex + 1) % prayers.length;
        next = prayers[nextIndex];
      } else {
        // If no current prayer, find the next upcoming one
        for (const prayer of prayers) {
          const startTime = moment(prayer.startTime, 'h:mm A');
          
          // Handle case where prayer is tomorrow
          if (startTime.isBefore(moment(), 'hour')) {
            startTime.add(1, 'day');
          }
          
          if (startTime.isAfter(now)) {
            if (!next || startTime.isBefore(moment(next.startTime, 'h:mm A'))) {
              next = prayer;
            }
          }
        }
        
        // If no next prayer found, it means the next prayer is tomorrow's first prayer
        if (!next) {
          next = prayers[0];
        }
      }
      
      setNextPrayer(next);
    };
    
    findPrayers();
    
    // Update countdown every second
    const timer = setInterval(() => {
      if (nextPrayer) {
        const now = moment();
        let prayerTime = moment(nextPrayer.startTime, 'h:mm A');
        
        // If prayer time is earlier than current time, it's for tomorrow
        if (prayerTime.isBefore(now, 'hour')) {
          prayerTime.add(1, 'day');
        }
        
        const diff = prayerTime.diff(now);
        const duration = moment.duration(diff);
        
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        
        setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        
        // Check if we need to update current/next prayers
        if (diff <= 0) {
          findPrayers();
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [prayers, nextPrayer]);

  if (!prayers || prayers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
      <div className="flex items-center mb-3">
        <Timer size={18} className="mr-2 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-800">Prayer Countdown</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentPrayer && (
          <div className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-500">
            <div className="flex items-center mb-2">
              <AlertCircle size={16} className="mr-2 text-emerald-600" />
              <h4 className="font-medium text-emerald-800">Current Prayer</h4>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-bold text-gray-800">{currentPrayer.name}</p>
                <p className="text-sm text-gray-600 font-arabic">{currentPrayer.arabicName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Until {currentPrayer.endTime}</p>
              </div>
            </div>
          </div>
        )}
        
        {nextPrayer && (
          <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
            <div className="flex items-center mb-2">
              <Timer size={16} className="mr-2 text-indigo-600" />
              <h4 className="font-medium text-indigo-800">Next Prayer</h4>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-bold text-gray-800">{nextPrayer.name}</p>
                <p className="text-sm text-gray-600 font-arabic">{nextPrayer.arabicName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Starts at {nextPrayer.startTime}</p>
                <p className="text-lg font-mono font-bold text-indigo-700">{countdown}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerCountdown;
