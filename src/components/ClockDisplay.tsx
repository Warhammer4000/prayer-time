import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';
import moment from 'moment';

const ClockDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
      <div className="flex items-center mb-2">
        <ClockIcon size={18} className="mr-2 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-800">Current Time</h3>
      </div>
      
      <div className="flex justify-center">
        <div className="text-4xl font-bold text-indigo-700 font-mono tracking-wider">
          {currentTime.format('HH:mm:ss')}
        </div>
      </div>
      
      <div className="text-center mt-2 text-gray-500 text-sm">
        {currentTime.format('dddd, MMMM D, YYYY')}
      </div>
    </div>
  );
};

export default ClockDisplay;
