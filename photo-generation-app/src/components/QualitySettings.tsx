import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import type { QualitySettingsProps } from '../types/ui.types';

export const QualitySettings: React.FC<QualitySettingsProps> = ({
  presets,
  selectedPreset,
  onSelectPreset
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Quality Preset</h3>

      <div className="space-y-2">
        {presets.map((preset) => {
          const isSelected = selectedPreset === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all
                ${isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{preset.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {preset.steps} steps • {preset.samplerMethod}
                  </p>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{preset.estimatedTime}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3" />
                  <span>{preset.costMultiplier}×</span>
                </div>
              </div>

              {/* Quality indicator bars */}
              <div className="mt-3 flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded ${
                      i < Math.ceil((preset.steps / 75) * 5)
                        ? 'bg-primary-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
        <p className="font-medium mb-1">Quality Presets</p>
        <ul className="list-disc list-inside space-y-1 text-blue-600">
          <li>Draft: Fast preview for testing</li>
          <li>Standard: Balanced quality and speed</li>
          <li>High: Better details and accuracy</li>
          <li>Ultra/Maximum: Best quality, slower</li>
        </ul>
      </div>
    </div>
  );
};
