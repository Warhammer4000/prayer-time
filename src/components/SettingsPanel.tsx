import React from 'react';
import { Settings } from 'lucide-react';
import { Settings as SettingsType } from '../types';
import { getCalculationMethods } from '../utils/prayerTimes';

interface SettingsPanelProps {
  settings: SettingsType;
  onSettingsChange: (settings: SettingsType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  isOpen,
  onToggle,
}) => {
  const calculationMethods = getCalculationMethods();

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({
      ...settings,
      calculationMethod: parseInt(e.target.value),
    });
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({
      ...settings,
      school: e.target.value as 'standard' | 'hanafi',
    });
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors absolute top-0 right-0"
        aria-label="Settings"
      >
        <Settings size={20} className="text-indigo-600" />
      </button>

      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg p-4 mt-12 absolute right-0 w-72 z-10 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Prayer Settings</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calculation Method
            </label>
            <select
              value={settings.calculationMethod}
              onChange={handleMethodChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              {calculationMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Different regions use different calculation methods
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Juristic Method (Asr)
            </label>
            <select
              value={settings.school}
              onChange={handleSchoolChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="standard">Standard (Shafi, Maliki, Hanbali)</option>
              <option value="hanafi">Hanafi</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Affects Asr prayer time calculation
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
