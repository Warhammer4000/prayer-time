import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/ar';
import 'moment-hijri';

const DateDisplay: React.FC = () => {
  const [date, setDate] = useState({
    gregorian: '',
    hijri: '',
  });

  useEffect(() => {
    const updateDate = () => {
      const now = moment();
      // @ts-ignore - moment-hijri types are not included
      const hijri = now.format('iD iMMMM iYYYY');
      
      setDate({
        gregorian: now.format('D MMMM YYYY'),
        hijri: hijri,
      });
    };
    
    updateDate();
    
    // Update date at midnight
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        updateDate();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
      <div className="flex items-center mb-2">
        <Calendar size={18} className="mr-2 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-800">Today's Date</h3>
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="mb-2 md:mb-0">
          <p className="text-sm text-gray-500">Gregorian</p>
          <p className="text-lg font-medium text-gray-800">{date.gregorian}</p>
        </div>
        
        <div className="md:text-right">
          <p className="text-sm text-gray-500">Hijri</p>
          <p className="text-lg font-medium text-gray-800 font-arabic">{date.hijri}</p>
        </div>
      </div>
    </div>
  );
};

export default DateDisplay;
