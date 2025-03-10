import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DateDisplay from './components/DateDisplay';
import ClockDisplay from './components/ClockDisplay';
import PrayerCountdown from './components/PrayerCountdown';
import LocationInput from './components/LocationInput';
import PrayerTimesDisplay from './components/PrayerTimesDisplay';
import SettingsPanel from './components/SettingsPanel';
import Footer from './components/Footer';
import { Prayer, Location, Settings } from './types';
import { fetchPrayerTimes, getUserLocation } from './utils/prayerTimes';

function App() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [settings, setSettings] = useState<Settings>({
    calculationMethod: 2, // ISNA by default
    school: 'standard',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Get user location on initial load
  useEffect(() => {
    const getLocation = async () => {
      try {
        const userLocation = await getUserLocation();
        setLocation(userLocation);
      } catch (error) {
        console.error('Error getting user location:', error);
        setError('Unable to get your location. Please enter it manually.');
        setIsLoading(false);
      }
    };

    getLocation();
  }, []);

  // Fetch prayer times when location or settings change
  useEffect(() => {
    const getPrayerTimes = async () => {
      if (!location) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const prayerTimes = await fetchPrayerTimes(location, settings);
        setPrayers(prayerTimes);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        setError('Unable to fetch prayer times. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    getPrayerTimes();
  }, [location, settings]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Header />
        
        <div className="relative mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateDisplay />
            <ClockDisplay />
          </div>
          <SettingsPanel 
            settings={settings}
            onSettingsChange={setSettings}
            isOpen={isSettingsOpen}
            onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
          />
        </div>
        
        <LocationInput 
          location={location} 
          onLocationChange={setLocation}
          isLoading={isLoading}
        />
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {!isLoading && prayers.length > 0 && (
          <PrayerCountdown prayers={prayers} />
        )}
        
        <PrayerTimesDisplay prayers={prayers} isLoading={isLoading} />
        
        <div className="bg-white rounded-lg p-4 shadow-md mb-4 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5 bg-prayer-pattern bg-cover bg-center"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Prayer Guidance</h2>
            <p className="text-gray-600 mb-3">
              "Indeed, prayer has been decreed upon the believers a decree of specified times." (Quran 4:103)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-3 rounded-lg">
                <h3 className="font-medium text-indigo-800 mb-1">Prayer Importance</h3>
                <p className="text-sm text-gray-700">
                  Prayer (Salah) is one of the Five Pillars of Islam and an obligation upon every Muslim. It's a direct connection with Allah.
                </p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <h3 className="font-medium text-emerald-800 mb-1">Prayer Times</h3>
                <p className="text-sm text-gray-700">
                  The five daily prayers are performed at dawn (Fajr), noon (Dhuhr), afternoon (Asr), sunset (Maghrib), and night (Isha).
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;
