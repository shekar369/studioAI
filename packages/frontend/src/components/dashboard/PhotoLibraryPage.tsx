import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  Download,
  Trash2,
  Heart,
  MoreVertical,
  Images,
  Wand2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type ViewMode = 'grid' | 'list';

// Placeholder for when we implement the actual photo fetching
const mockPhotos: {
  id: string;
  originalUrl: string;
  generatedUrl: string;
  prompt: string;
  createdAt: string;
  isFavorite: boolean;
}[] = [];

export function PhotoLibraryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPhotos = mockPhotos.filter((photo) =>
    photo.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Photo Library</h1>
        <p className="text-white/60">
          Browse and manage all your generated photos.
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search by prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {/* Filter */}
        <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-all">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </motion.div>

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-16 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
            <Images className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No photos yet</h3>
          <p className="text-white/50 mb-6 max-w-sm text-center">
            Your photo library is empty. Start generating photos to build your collection.
          </p>
          <Link
            to="/app/generator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all"
          >
            <Wand2 className="w-5 h-5" />
            Generate Photos
          </Link>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10"
            >
              <img
                src={photo.generatedUrl || photo.originalUrl}
                alt={photo.prompt}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm line-clamp-2 mb-3">{photo.prompt}</p>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-2 rounded-lg transition-all ${
                        photo.isFavorite
                          ? 'bg-pink-500/20 text-pink-400'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={photo.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <img
                src={photo.generatedUrl || photo.originalUrl}
                alt={photo.prompt}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{photo.prompt}</p>
                <p className="text-white/40 text-sm">
                  {new Date(photo.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                  <Download className="w-4 h-4" />
                </button>
                <button
                  className={`p-2 rounded-lg transition-all ${
                    photo.isFavorite
                      ? 'bg-pink-500/10 text-pink-400'
                      : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={photo.isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default PhotoLibraryPage;
