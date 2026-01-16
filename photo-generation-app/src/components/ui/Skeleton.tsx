/**
 * Skeleton Loading Components
 * Premium loading states with shimmer animations
 */

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

/**
 * Base Skeleton component with shimmer effect
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', animate = true }) => {
  return (
    <div
      className={`
        bg-studio-800 rounded-lg relative overflow-hidden
        ${animate ? 'animate-skeleton' : ''}
        ${className}
      `}
    >
      {animate && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-studio-700/50 to-transparent" />
      )}
    </div>
  );
};

/**
 * Image Skeleton with aspect ratio support
 */
interface ImageSkeletonProps extends SkeletonProps {
  aspectRatio?: 'square' | '4/5' | '3/4' | '16/9' | '1/1';
}

export const ImageSkeleton: React.FC<ImageSkeletonProps> = ({
  className = '',
  aspectRatio = 'square',
  animate = true
}) => {
  const aspectClasses = {
    'square': 'aspect-square',
    '4/5': 'aspect-[4/5]',
    '3/4': 'aspect-[3/4]',
    '16/9': 'aspect-video',
    '1/1': 'aspect-square'
  };

  return (
    <motion.div
      className={`
        ${aspectClasses[aspectRatio]}
        bg-studio-800 rounded-xl relative overflow-hidden
        ${className}
      `}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {/* Center icon placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-studio-700 animate-pulse" />
      </div>
      {/* Shimmer effect */}
      {animate && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-studio-600/30 to-transparent" />
      )}
    </motion.div>
  );
};

/**
 * Card Skeleton for template cards
 */
export const CardSkeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`
        bg-studio-850 rounded-2xl border border-studio-700 overflow-hidden
        ${className}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Image area */}
      <div className="aspect-[4/5] bg-studio-800 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-studio-700 animate-pulse" />
        </div>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-studio-600/30 to-transparent" />
      </div>

      {/* Content area */}
      <div className="p-6 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        {/* Description */}
        <Skeleton className="h-4 w-full" />
        {/* Subtitle */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Text Line Skeleton
 */
interface TextSkeletonProps extends SkeletonProps {
  lines?: number;
  lastLineWidth?: 'full' | '3/4' | '1/2' | '1/4';
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  className = '',
  lines = 1,
  lastLineWidth = '3/4'
}) => {
  const widthClasses = {
    'full': 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/4': 'w-1/4'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${index === lines - 1 ? widthClasses[lastLineWidth] : 'w-full'}`}
        />
      ))}
    </div>
  );
};

/**
 * Avatar Skeleton
 */
interface AvatarSkeletonProps extends SkeletonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <Skeleton className={`${sizeClasses[size]} rounded-full ${className}`} />
  );
};

/**
 * Button Skeleton
 */
interface ButtonSkeletonProps extends SkeletonProps {
  size?: 'sm' | 'md' | 'lg';
}

export const ButtonSkeleton: React.FC<ButtonSkeletonProps> = ({
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  };

  return (
    <Skeleton className={`${sizeClasses[size]} rounded-xl ${className}`} />
  );
};

/**
 * Input Skeleton
 */
export const InputSkeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <Skeleton className={`h-12 w-full rounded-xl ${className}`} />
  );
};

/**
 * Grid Skeleton for multiple cards
 */
interface GridSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({
  count = 6,
  columns = 3,
  className = ''
}) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <CardSkeleton />
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Hero Section Skeleton
 */
export const HeroSkeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`grid lg:grid-cols-2 gap-12 items-center ${className}`}>
      {/* Left side - Text content */}
      <div className="space-y-6">
        {/* Badge */}
        <Skeleton className="h-8 w-48 rounded-full" />

        {/* Heading */}
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-12 w-1/2" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <ButtonSkeleton size="lg" className="w-48" />
          <ButtonSkeleton size="lg" className="w-36" />
        </div>

        {/* Trust indicators */}
        <div className="flex gap-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      {/* Right side - Image comparison */}
      <div className="bg-studio-850 rounded-2xl p-8 border border-studio-700">
        <ImageSkeleton aspectRatio="3/4" />
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
};

/**
 * Upload Zone Skeleton
 */
export const UploadSkeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`
        border-2 border-dashed border-studio-600 rounded-2xl p-8
        flex flex-col items-center justify-center
        bg-studio-900/50
        ${className}
      `}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div className="w-16 h-16 rounded-2xl bg-studio-800 mb-4 animate-pulse" />
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-64" />
    </motion.div>
  );
};

/**
 * Settings Card Skeleton
 */
export const SettingsCardSkeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-studio-850 rounded-2xl border border-studio-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <AvatarSkeleton size="lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Input */}
      <InputSkeleton className="mb-4" />

      {/* Buttons */}
      <div className="flex space-x-3">
        <ButtonSkeleton className="flex-1" />
        <ButtonSkeleton className="w-20" />
      </div>
    </div>
  );
};

/**
 * Loading Overlay with Spinner
 */
interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Loading...'
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-studio-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-studio-850 rounded-2xl p-8 border border-studio-700 shadow-2xl text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Spinner */}
        <motion.div
          className="w-16 h-16 mx-auto mb-4 border-4 border-studio-600 border-t-electric-purple-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-gray-300 font-medium">{message}</p>
      </motion.div>
    </motion.div>
  );
};

export default {
  Skeleton,
  ImageSkeleton,
  CardSkeleton,
  TextSkeleton,
  AvatarSkeleton,
  ButtonSkeleton,
  InputSkeleton,
  GridSkeleton,
  HeroSkeleton,
  UploadSkeleton,
  SettingsCardSkeleton,
  LoadingOverlay
};
