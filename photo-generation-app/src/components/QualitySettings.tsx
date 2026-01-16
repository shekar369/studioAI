import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, DollarSign, Zap, Star, Check, Sparkles, Info } from 'lucide-react';
import type { QualitySettingsProps } from '../types/ui.types';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

export const QualitySettings: React.FC<QualitySettingsProps> = ({
  presets,
  selectedPreset,
  onSelectPreset
}) => {
  // Get quality level icon based on preset
  const getQualityIcon = (presetId: string) => {
    switch(presetId) {
      case 'draft': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'standard': return <Star className="w-4 h-4 text-green-400" />;
      case 'high': return <Star className="w-4 h-4 text-electric-purple-400" />;
      case 'ultra': return <Sparkles className="w-4 h-4 text-pink-400" />;
      case 'maximum': return <Sparkles className="w-4 h-4 text-red-400" />;
      default: return <Star className="w-4 h-4 text-studio-400" />;
    }
  };

  // Get recommendation badge - Dark Theme
  const getRecommendation = (presetId: string) => {
    switch(presetId) {
      case 'draft': return { text: 'Quick Test', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
      case 'standard': return { text: 'Recommended', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
      case 'high': return { text: 'High Quality', color: 'bg-electric-purple-500/20 text-electric-purple-400 border-electric-purple-500/30' };
      case 'ultra': return { text: 'Professional', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' };
      case 'maximum': return { text: 'Maximum', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
      default: return null;
    }
  };

  // Get gradient color for quality bars
  const getBarGradient = (presetId: string) => {
    switch(presetId) {
      case 'draft': return 'from-yellow-500 to-orange-500';
      case 'standard': return 'from-green-500 to-emerald-500';
      case 'high': return 'from-electric-purple-500 to-electric-blue-500';
      case 'ultra': return 'from-pink-500 to-rose-500';
      case 'maximum': return 'from-red-500 to-orange-500';
      default: return 'from-studio-500 to-studio-400';
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-electric-purple-400" />
          Quality Settings
        </h3>
        <span className="text-xs text-studio-400 bg-studio-800 px-2 py-1 rounded-full">
          {presets.length} presets
        </span>
      </div>

      <motion.div
        className="space-y-2"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {presets.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          const recommendation = getRecommendation(preset.id);
          const barGradient = getBarGradient(preset.id);

          return (
            <motion.button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              variants={staggerItem}
              className={`
                w-full p-4 rounded-xl border-2 text-left transition-all duration-300 group relative overflow-hidden
                ${isSelected
                  ? 'border-electric-purple-500 bg-electric-purple-500/10 shadow-glow'
                  : 'border-studio-700 hover:border-electric-purple-400/50 bg-studio-850 hover:bg-studio-800'
                }
              `}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-electric-purple-500/5 via-transparent to-electric-blue-500/5 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${isSelected
                        ? 'bg-gradient-to-br from-electric-purple-500 to-electric-blue-500 shadow-glow-sm'
                        : 'bg-studio-800 border border-studio-600'
                      }
                    `}>
                      {getQualityIcon(preset.id)}
                    </div>
                    <div>
                      <h4 className={`font-semibold text-base transition-colors ${
                        isSelected ? 'text-white' : 'text-gray-200'
                      }`}>
                        {preset.name}
                      </h4>
                      <p className="text-xs text-studio-400 mt-0.5">
                        {preset.steps} steps • {preset.samplerMethod}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {recommendation && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${recommendation.color}`}>
                        {recommendation.text}
                      </span>
                    )}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="w-6 h-6 bg-gradient-to-br from-electric-purple-500 to-electric-blue-500 rounded-full flex items-center justify-center shadow-glow-sm"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs text-studio-400 mb-3">
                  <div className="flex items-center space-x-1.5 bg-studio-800/50 px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3" />
                    <span className="font-medium text-gray-300">{preset.estimatedTime}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 bg-studio-800/50 px-2 py-1 rounded-md">
                    <DollarSign className="w-3 h-3" />
                    <span className="font-medium text-gray-300">{preset.costMultiplier}× cost</span>
                  </div>
                </div>

                {/* Quality indicator bars with animated gradient */}
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i < Math.ceil((preset.steps / 75) * 5);
                    return (
                      <motion.div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          filled
                            ? `bg-gradient-to-r ${barGradient}`
                            : 'bg-studio-700'
                        }`}
                        initial={false}
                        animate={isSelected && filled ? {
                          boxShadow: ['0 0 0px rgba(124, 58, 237, 0)', '0 0 8px rgba(124, 58, 237, 0.5)', '0 0 0px rgba(124, 58, 237, 0)']
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Info Card - Dark Theme */}
      <motion.div
        className="bg-studio-800/50 border border-studio-700 rounded-xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="font-semibold text-gray-200 mb-3 flex items-center space-x-2">
          <Info className="w-4 h-4 text-electric-blue-400" />
          <span>Quality Guide</span>
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex items-start space-x-3 p-2 rounded-lg bg-studio-900/50 border border-studio-700/50">
            <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-studio-300">
              <span className="font-semibold text-yellow-400">Draft:</span> Fast preview for testing ideas
            </p>
          </div>
          <div className="flex items-start space-x-3 p-2 rounded-lg bg-studio-900/50 border border-green-500/20">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-studio-300">
              <span className="font-semibold text-green-400">Standard:</span> Balanced quality and speed (recommended)
            </p>
          </div>
          <div className="flex items-start space-x-3 p-2 rounded-lg bg-studio-900/50 border border-studio-700/50">
            <Star className="w-4 h-4 text-electric-purple-400 flex-shrink-0 mt-0.5" />
            <p className="text-studio-300">
              <span className="font-semibold text-electric-purple-400">High/Ultra:</span> Better details and photorealism
            </p>
          </div>
          <div className="flex items-start space-x-3 p-2 rounded-lg bg-studio-900/50 border border-studio-700/50">
            <Sparkles className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-studio-300">
              <span className="font-semibold text-red-400">Maximum:</span> Best quality, takes longer
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
