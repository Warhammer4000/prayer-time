import axios from 'axios';
import { PrayerTimesResponse, Prayer, Location, Settings } from '../types';
import moment from 'moment';

// Convert 24-hour format to 12-hour format
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Get prayer times from API
export const fetchPrayerTimes = async (
  location: Location,
  settings: Settings
): Promise<Prayer[]> => {
  try {
    const date = moment().format('DD-MM-YYYY');
    const url = `https://api.aladhan.com/v1/timings/${date}`;
    
    const response = await axios.get<PrayerTimesResponse>(url, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        method: settings.calculationMethod,
        school: settings.school === 'hanafi' ? 1 : 0,
      },
    });

    const { timings } = response.data.data;
    const currentTime = moment();
    
    // Calculate prayer end times (next prayer's start time)
    const prayers: Prayer[] = [
      {
        name: 'Fajr',
        arabicName: 'الفجر',
        startTime: formatTime(timings.Fajr),
        endTime: formatTime(timings.Sunrise),
        isActive: isCurrentPrayer(timings.Fajr, timings.Sunrise),
      },
      {
        name: 'Dhuhr',
        arabicName: 'الظهر',
        startTime: formatTime(timings.Dhuhr),
        endTime: formatTime(timings.Asr),
        isActive: isCurrentPrayer(timings.Dhuhr, timings.Asr),
      },
      {
        name: 'Asr',
        arabicName: 'العصر',
        startTime: formatTime(timings.Asr),
        endTime: formatTime(timings.Maghrib),
        isActive: isCurrentPrayer(timings.Asr, timings.Maghrib),
      },
      {
        name: 'Maghrib',
        arabicName: 'المغرب',
        startTime: formatTime(timings.Maghrib),
        endTime: formatTime(timings.Isha),
        isActive: isCurrentPrayer(timings.Maghrib, timings.Isha),
      },
      {
        name: 'Isha',
        arabicName: 'العشاء',
        startTime: formatTime(timings.Isha),
        endTime: formatTime(timings.Fajr), // Next day's Fajr
        isActive: isCurrentPrayer(timings.Isha, timings.Fajr, true),
      },
    ];

    return prayers;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};

// Check if a prayer is currently active
const isCurrentPrayer = (
  startTimeStr: string,
  endTimeStr: string,
  isIsha: boolean = false
): boolean => {
  const now = moment();
  const startTime = moment(startTimeStr, 'HH:mm');
  let endTime = moment(endTimeStr, 'HH:mm');
  
  // Handle Isha prayer which spans to next day
  if (isIsha && endTime.isBefore(startTime)) {
    endTime.add(1, 'day');
  }
  
  // If current time is after start and before end
  return now.isAfter(startTime) && now.isBefore(endTime);
};

// Get location from browser
export const getUserLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Try to get city and country from reverse geocoding
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          
          const address = response.data.address;
          resolve({
            latitude,
            longitude,
            city: address.city || address.town || address.village || 'Unknown',
            country: address.country || 'Unknown',
          });
        } catch (error) {
          // If reverse geocoding fails, just return coordinates
          resolve({ latitude, longitude });
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Get calculation methods
export const getCalculationMethods = (): { id: number; name: string }[] => {
  return [
    { id: 1, name: 'University of Islamic Sciences, Karachi' },
    { id: 2, name: 'Islamic Society of North America (ISNA)' },
    { id: 3, name: 'Muslim World League' },
    { id: 4, name: 'Umm al-Qura, Makkah' },
    { id: 5, name: 'Egyptian General Authority of Survey' },
    { id: 7, name: 'Institute of Geophysics, University of Tehran' },
    { id: 8, name: 'Gulf Region' },
    { id: 9, name: 'Kuwait' },
    { id: 10, name: 'Qatar' },
    { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore' },
    { id: 12, name: 'Union Organization Islamic de France' },
    { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey' },
    { id: 14, name: 'Spiritual Administration of Muslims of Russia' },
    { id: 15, name: 'Moonsighting Committee Worldwide (Moonsighting.com)' },
  ];
};
