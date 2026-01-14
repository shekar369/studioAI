import React from 'react';
import { Clock, DollarSign, Zap, Star } from 'lucide-react';
import type { QualitySettingsProps } from '../types/ui.types';

export const QualitySettings: React.FC<QualitySettingsProps> = ({
  presets,
  selectedPreset,
  onSelectPreset
}) => {
  // Get quality level icon based on preset
  const getQualityIcon = (presetId: string) => {
    switch(presetId) {
      case 'draft': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'standard': return <Star className="w-4 h-4 text-blue-500" />;
      case 'high': return <Star className="w-4 h-4 text-purple-500" />;
      case 'ultra': return <Star className="w-4 h-4 text-pink-500" />;
      case 'maximum': return <Star className="w-4 h-4 text-red-500" />;
      default: return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get recommendation badge
  const getRecommendation = (presetId: string) => {
    switch(presetId) {
      case 'draft': return { text: 'Quick Test', color: 'bg-yellow-100 text-yellow-700' };
      case 'standard': return { text: 'Recommended', color: 'bg-green-100 text-green-700' };
      case 'high': return { text: 'High Quality', color: 'bg-purple-100 text-purple-700' };
      case 'ultra': return { text: 'Professional', color: 'bg-pink-100 text-pink-700' };
      case 'maximum': return { text: 'Maximum', color: 'bg-red-100 text-red-700' };
      default: return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Quality Settings</h3>
        <span className="text-xs text-gray-500">{presets.length} presets</span>
      </div>

      <div className="space-y-2">
        {presets.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          const recommendation = getRecommendation(preset.id);

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all group
                ${isSelected
                  ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg scale-[1.02]'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getQualityIcon(preset.id)}
                  <div>
                    <h4 className={`font-semibold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                      {preset.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {preset.steps} steps • {preset.samplerMethod}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {recommendation && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${recommendation.color}`}>
                      {recommendation.text}
                    </span>
                  )}
                  {isSelected && (
                    <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
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
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span className="font-medium">{preset.estimatedTime}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3" />
                  <span className="font-medium">{preset.costMultiplier}× cost</span>
                </div>
              </div>

              {/* Quality indicator bars with gradient */}
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const filled = i < Math.ceil((preset.steps / 75) * 5);
                  return (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        filled
                          ? isSelected
                            ? 'bg-gradient-to-r from-primary-400 to-primary-600'
                            : 'bg-primary-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 text-xs">
        <p className="font-semibold text-blue-900 mb-2 flex items-center space-x-1">
          <Star className="w-3 h-3" />
          <span>Quality Guide</span>
        </p>
        <div className="space-y-1.5 text-blue-700">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600">⚡</span>
            <p><strong>Draft:</strong> Fast preview for testing ideas</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-600">✓</span>
            <p><strong>Standard:</strong> Balanced quality and speed (recommended)</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-600">★</span>
            <p><strong>High/Ultra:</strong> Better details and photorealism</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-red-600">♦</span>
            <p><strong>Maximum:</strong> Best quality, takes longer</p>
          </div>
        </div>
      </div>
    </div>
  );
};
