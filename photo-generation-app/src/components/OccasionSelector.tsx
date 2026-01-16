import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, Sparkles } from 'lucide-react';
import type { OccasionSelectorProps } from '../types/ui.types';
import { getTemplateImage } from '../config/stockImages';
import { staggerContainer, staggerItem, fadeInUp } from '../utils/animations';

export const OccasionSelector: React.FC<OccasionSelectorProps> = ({
  occasions,
  selectedOccasion,
  onSelectOccasion,
  category
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(occasions.map(o => o.category));
    return ['all', ...Array.from(cats)];
  }, [occasions]);

  // Filter occasions
  const filteredOccasions = useMemo(() => {
    let filtered = occasions;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(o => o.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.name.toLowerCase().includes(query) ||
        o.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [occasions, selectedCategory, searchQuery]);

  // Category labels with icons
  const categoryLabels: Record<string, { label: string; color: string }> = {
    all: { label: 'All', color: 'from-electric-purple-500 to-electric-blue-500' },
    celebration: { label: 'Celebrations', color: 'from-pink-500 to-rose-500' },
    professional: { label: 'Professional', color: 'from-blue-500 to-cyan-500' },
    lifestyle: { label: 'Lifestyle', color: 'from-green-500 to-emerald-500' },
    seasonal: { label: 'Seasonal', color: 'from-orange-500 to-amber-500' },
    artistic: { label: 'Artistic', color: 'from-purple-500 to-violet-500' }
  };

  const handleImageError = (occasionId: string) => {
    setImageLoadErrors(prev => new Set(prev).add(occasionId));
  };

  return (
    <motion.div
      className="space-y-4"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-electric-purple-400" />
          Choose Occasion or Style
        </h3>
        <span className="text-xs text-studio-400 bg-studio-800 px-2 py-1 rounded-full">
          {filteredOccasions.length} templates
        </span>
      </div>

      {/* Search Bar - Dark Theme */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-studio-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search occasions..."
          className="w-full pl-10 pr-4 py-2.5 bg-studio-900 border border-studio-600 rounded-xl text-white placeholder-studio-400 focus:outline-none focus:ring-2 focus:ring-electric-purple-500/50 focus:border-electric-purple-500 transition-all duration-300"
        />
      </div>

      {/* Category Filter - Dark Theme Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const catInfo = categoryLabels[cat] || { label: cat, color: 'from-gray-500 to-gray-600' };

          return (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                ${isActive
                  ? `bg-gradient-to-r ${catInfo.color} text-white shadow-glow-sm`
                  : 'bg-studio-800 text-studio-300 hover:bg-studio-700 hover:text-white border border-studio-600'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {catInfo.label}
            </motion.button>
          );
        })}
      </div>

      {/* Occasions Grid - Dark Theme with Images */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-2 scrollbar-hide"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence mode="popLayout">
          {filteredOccasions.map((occasion) => {
            const isSelected = selectedOccasion === occasion.id;
            const imageUrl = getTemplateImage(occasion.id);
            const hasImageError = imageLoadErrors.has(occasion.id);

            return (
              <motion.button
                key={occasion.id}
                onClick={() => onSelectOccasion(occasion.id)}
                variants={staggerItem}
                layout
                className={`
                  relative p-3 rounded-xl border-2 text-left transition-all duration-300 group overflow-hidden
                  ${isSelected
                    ? 'border-electric-purple-500 bg-electric-purple-500/10 shadow-glow'
                    : 'border-studio-700 hover:border-electric-purple-400/50 bg-studio-850 hover:bg-studio-800'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-3">
                  {/* Template Preview Image */}
                  <div className={`
                    relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0
                    ${isSelected ? 'ring-2 ring-electric-purple-500' : 'ring-1 ring-studio-600'}
                  `}>
                    {!hasImageError ? (
                      <img
                        src={imageUrl}
                        alt={occasion.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => handleImageError(occasion.id)}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-studio-800 flex items-center justify-center">
                        <span className="text-3xl">{occasion.icon}</span>
                      </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-studio-950/60 via-transparent to-transparent" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name */}
                    <h4 className={`font-semibold text-sm mb-1 line-clamp-1 transition-colors ${
                      isSelected ? 'text-white' : 'text-gray-200'
                    }`}>
                      {occasion.name}
                    </h4>

                    {/* Description */}
                    <p className={`text-xs mb-2 line-clamp-2 transition-colors ${
                      isSelected ? 'text-electric-purple-300' : 'text-studio-400'
                    }`}>
                      {occasion.description}
                    </p>

                    {/* Category Badge - Dark Theme */}
                    <span className={`
                      inline-block text-xs px-2 py-0.5 rounded-full font-medium
                      ${occasion.category === 'celebration' ? 'bg-pink-500/20 text-pink-400' :
                        occasion.category === 'professional' ? 'bg-blue-500/20 text-blue-400' :
                        occasion.category === 'lifestyle' ? 'bg-green-500/20 text-green-400' :
                        occasion.category === 'seasonal' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-purple-500/20 text-purple-400'
                      }
                    `}>
                      {occasion.category}
                    </span>
                  </div>
                </div>

                {/* Selected Indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-electric-purple-500 to-electric-blue-500 rounded-full flex items-center justify-center shadow-glow-sm"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hover Glow Effect */}
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                  bg-gradient-to-r from-electric-purple-500/5 via-transparent to-electric-blue-500/5
                `} />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* No Results - Dark Theme */}
      <AnimatePresence>
        {filteredOccasions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-studio-800 flex items-center justify-center">
              <Search className="w-8 h-8 text-studio-500" />
            </div>
            <p className="text-gray-300 font-medium">No occasions found</p>
            <p className="text-sm mt-1 text-studio-400">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
