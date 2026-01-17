import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PhotoGenerator from '@/components/PhotoGenerator';

export function GeneratorPage() {
  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <PhotoGenerator />
      </motion.div>
    </div>
  );
}

export default GeneratorPage;
