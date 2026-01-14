import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { OccasionSelectorProps } from '../types/ui.types';

export const OccasionSelector: React.FC<OccasionSelectorProps> = ({
  occasions,
  selectedOccasion,
  onSelectOccasion,
  category
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(occasions.map(o => o.category));
    return ['all', ...Array.from(cats)];
  }, [occasions]);

  // Filter occasions
  const filteredOccasions = useMemo(() => {
    let filtered = occasions;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(o => o.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.name.toLowerCase().includes(query) ||
        o.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [occasions, selectedCategory, searchQuery]);

  // Category labels
  const categoryLabels: Record<string, string> = {
    all: 'All',
    celebration: 'Celebrations',
    professional: 'Professional',
    lifestyle: 'Lifestyle',
    seasonal: 'Seasonal',
    artistic: 'Artistic'
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Choose Occasion or Style</h3>
        <span className="text-xs text-gray-500">
          {filteredOccasions.length} templates
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search occasions..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === cat
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Occasions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
        {filteredOccasions.map((occasion) => {
          const isSelected = selectedOccasion === occasion.id;

          return (
            <button
              key={occasion.id}
              onClick={() => onSelectOccasion(occasion.id)}
              className={`
                relative p-4 rounded-lg border-2 text-left transition-all group
                ${isSelected
                  ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg scale-[1.02]'
                  : 'border-gray-200 hover:border-primary-300 hover:shadow-md hover:scale-[1.01] bg-white'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`text-5xl transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {occasion.icon}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name */}
                  <h4 className={`font-semibold text-base mb-1 line-clamp-1 ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                    {occasion.name}
                  </h4>

                  {/* Description */}
                  <p className={`text-xs mb-2 line-clamp-2 ${isSelected ? 'text-primary-700' : 'text-gray-500'}`}>
                    {occasion.description}
                  </p>

                  {/* Category Badge */}
                  <span className={`
                    inline-block text-xs px-2 py-1 rounded-full font-medium
                    ${occasion.category === 'celebration' ? 'bg-pink-100 text-pink-700' :
                      occasion.category === 'professional' ? 'bg-blue-100 text-blue-700' :
                      occasion.category === 'lifestyle' ? 'bg-green-100 text-green-700' :
                      occasion.category === 'seasonal' ? 'bg-orange-100 text-orange-700' :
                      'bg-purple-100 text-purple-700'
                    }
                  `}>
                    {occasion.category}
                  </span>
                </div>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                  <svg
                    className="w-4 h-4 text-white"
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
            </button>
          );
        })}
      </div>

      {/* No Results */}
      {filteredOccasions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No occasions found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};
