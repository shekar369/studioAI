import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles,
  Upload,
  Wand2,
  Download,
  Shield,
  Lock,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  Image as ImageIcon,
  Play,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { heroImages, getTemplateImage, templateImages } from '../config/stockImages';
import {
  scrollReveal,
  scrollRevealScale
} from '../utils/animations';
import { useInView, usePrefersReducedMotion } from '../hooks/useScrollAnimation';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [beforeAfterSlider, setBeforeAfterSlider] = useState(50);
  const [activeCategory, setActiveCategory] = useState('professional');
  const [imagesLoaded, setImagesLoaded] = useState({ before: false, after: false });
  const [navScrolled, setNavScrolled] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Scroll-based parallax for hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroParallax = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  // Navigation scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section refs for scroll animations
  const [workflowRef, workflowInView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [templatesRef, templatesInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [trustRef, trustInView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [ctaRef, ctaInView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  const categories = [
    { id: 'professional', label: 'Professional', icon: '💼' },
    { id: 'celebrations', label: 'Celebrations', icon: '🎉' },
    { id: 'holidays', label: 'Holidays', icon: '🎄' },
    { id: 'events', label: 'Events', icon: '🎸' },
    { id: 'casual', label: 'Fun & Casual', icon: '🎨' }
  ];

  const templates = {
    professional: [
      {
        id: 'business',
        name: 'Business Portrait',
        description: 'Studio-fit, confident headshot',
        subtitle: 'Perfect for LinkedIn',
        imageKey: 'business'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn Profile',
        description: 'Polished resume photo',
        subtitle: 'Great for LinkedIn',
        imageKey: 'linkedin'
      },
      {
        id: 'corporate',
        name: 'Corporate Headshot',
        description: 'Professional executive look',
        subtitle: 'Business ready',
        imageKey: 'corporate'
      }
    ],
    celebrations: [
      {
        id: 'wedding',
        name: 'Wedding',
        description: 'Elegant wedding shot',
        subtitle: 'Perfect for announcements',
        imageKey: 'wedding'
      },
      {
        id: 'birthday',
        name: 'Birthday Party',
        description: 'Party celebratory portrait',
        subtitle: 'Perfect for sharing',
        imageKey: 'birthday'
      },
      {
        id: 'graduation',
        name: 'Graduation',
        description: 'Celebrate your achievement',
        subtitle: 'Milestone moments',
        imageKey: 'graduation'
      }
    ],
    holidays: [
      {
        id: 'christmas',
        name: 'Christmas',
        description: 'Festive holiday portrait',
        subtitle: 'Seasonal greetings',
        imageKey: 'christmas'
      },
      {
        id: 'newyear',
        name: 'New Year',
        description: 'Celebration vibes',
        subtitle: 'Ring in the new year',
        imageKey: 'newYear'
      },
      {
        id: 'diwali',
        name: 'Diwali',
        description: 'Festival of lights',
        subtitle: 'Celebrate in style',
        imageKey: 'diwali'
      }
    ],
    events: [
      {
        id: 'concert',
        name: 'Concert',
        description: 'Live music atmosphere',
        subtitle: 'Stage presence',
        imageKey: 'concert'
      },
      {
        id: 'beach',
        name: 'Beach',
        description: 'Coastal golden hour',
        subtitle: 'Vacation vibes',
        imageKey: 'beach'
      },
      {
        id: 'urban',
        name: 'Urban',
        description: 'City backdrop',
        subtitle: 'Street style',
        imageKey: 'urban'
      }
    ],
    casual: [
      {
        id: 'artistic',
        name: 'Artistic',
        description: 'Creative expression',
        subtitle: 'Unique aesthetic',
        imageKey: 'artistic'
      },
      {
        id: 'fashion',
        name: 'Fashion',
        description: 'Editorial style',
        subtitle: 'Magazine quality',
        imageKey: 'fashion'
      },
      {
        id: 'fitness',
        name: 'Fitness',
        description: 'Athletic energy',
        subtitle: 'Strong & confident',
        imageKey: 'fitness'
      }
    ]
  };

  const currentTemplates = templates[activeCategory as keyof typeof templates] || templates.professional;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-studio-950 text-white overflow-hidden">
      {/* Premium Navigation with Scroll Response */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled
            ? 'bg-studio-900/95 backdrop-blur-2xl border-b border-studio-700/80 shadow-xl'
            : 'bg-studio-900/60 backdrop-blur-xl border-b border-studio-700/30'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with Glow */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-10 h-10 bg-gradient-electric rounded-xl flex items-center justify-center shadow-glow"
                animate={prefersReducedMotion ? {} : {
                  boxShadow: [
                    '0 0 20px rgba(124, 58, 237, 0.4)',
                    '0 0 30px rgba(124, 58, 237, 0.6)',
                    '0 0 20px rgba(124, 58, 237, 0.4)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-electric-purple-400 to-electric-blue-400 bg-clip-text text-transparent">
                  Studio AI
                </h1>
              </div>
            </motion.div>

            {/* Navigation Links with Underline Animation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Templates', 'Pricing', 'Use Cases'].map((link) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase().replace(' ', '-')}`}
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors group"
                  whileHover={{ y: -2 }}
                >
                  {link}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-electric group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center space-x-4">
              <motion.button
                className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              <motion.button
                onClick={onGetStarted}
                className="px-6 py-2.5 bg-gradient-electric text-white text-sm font-semibold rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Free Demo
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-mesh"
          style={{ y: heroParallax, opacity: heroOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-radial from-electric-purple-900/30 via-studio-950 to-studio-950" />

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-electric-purple-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={prefersReducedMotion ? {} : {
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content with Staggered Animation */}
            <motion.div
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-electric-purple-500/10 border border-electric-purple-500/30 rounded-full"
              >
                <motion.div
                  animate={prefersReducedMotion ? {} : { rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-electric-purple-400" />
                </motion.div>
                <span className="text-sm font-medium text-electric-purple-300">AI-Powered Studio Quality</span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-tight"
              >
                Turn Any Photo Into
                <br />
                <motion.span
                  className="bg-gradient-to-r from-electric-purple-400 via-electric-indigo-500 to-electric-blue-400 bg-clip-text text-transparent inline-block"
                  animate={prefersReducedMotion ? {} : {
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Studio-Quality
                </motion.span>
                <br />
                Portrait
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-300 leading-relaxed max-w-xl"
              >
                Face-preserved AI. Professional lighting. Studio results.
                <br />
                Transform your photos into professional headshots in seconds.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  onClick={onGetStarted}
                  className="group px-8 py-4 bg-gradient-electric text-white font-semibold rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Try It Free – No Signup Required</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
                <motion.button
                  className="px-8 py-4 bg-studio-800 text-white font-semibold rounded-xl border border-studio-600 hover:border-electric-purple-500 transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.03, borderColor: 'rgba(124, 58, 237, 0.5)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-6 pt-4"
              >
                {[
                  { icon: Users, label: '1.1M+ Users', color: 'text-electric-purple-400' },
                  { icon: Star, label: '4.9/5 Rating', color: 'text-yellow-400', fill: true },
                  { icon: ImageIcon, label: '10M+ Photos', color: 'text-electric-blue-400' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <item.icon className={`w-5 h-5 ${item.color} ${item.fill ? 'fill-yellow-400' : ''}`} />
                    <span className="text-sm text-gray-400">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Before/After Comparison with Real Images */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div
                className="relative bg-studio-850 rounded-2xl p-6 sm:p-8 shadow-studio-lg border border-studio-700"
                whileHover={{ boxShadow: '0 0 60px rgba(124, 58, 237, 0.2)' }}
              >
                {/* Before/After Container */}
                <div className="relative aspect-[3/4] bg-studio-900 rounded-xl overflow-hidden">
                  {/* Before Image */}
                  <div className="absolute inset-0">
                    {!imagesLoaded.before && (
                      <div className="absolute inset-0 bg-studio-800 animate-pulse flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-studio-700 animate-skeleton" />
                      </div>
                    )}
                    <img
                      src={heroImages.before}
                      alt="Before - Original Photo"
                      className={`w-full h-full object-cover transition-opacity duration-500 ${
                        imagesLoaded.before ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImagesLoaded(prev => ({ ...prev, before: true }))}
                    />
                    {/* Before Label */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-studio-900/90 backdrop-blur-sm rounded-lg border border-studio-600">
                      <span className="text-xs font-semibold text-gray-300">BEFORE</span>
                    </div>
                  </div>

                  {/* After Image with Clip Path */}
                  <motion.div
                    className="absolute inset-0"
                    style={{ clipPath: `inset(0 ${100 - beforeAfterSlider}% 0 0)` }}
                  >
                    {!imagesLoaded.after && (
                      <div className="absolute inset-0 bg-gradient-to-br from-electric-purple-900/50 to-electric-blue-900/50 animate-pulse" />
                    )}
                    <img
                      src={heroImages.after}
                      alt="After - Studio Quality"
                      className={`w-full h-full object-cover transition-opacity duration-500 ${
                        imagesLoaded.after ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImagesLoaded(prev => ({ ...prev, after: true }))}
                    />
                    {/* After Label */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-electric rounded-lg shadow-glow">
                      <span className="text-xs font-semibold text-white">AFTER</span>
                    </div>
                    {/* Subtle glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-electric-purple-500/10 via-transparent to-transparent pointer-events-none" />
                  </motion.div>

                  {/* Slider Handle */}
                  <motion.div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] cursor-ew-resize z-10"
                    style={{ left: `${beforeAfterSlider}%` }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-studio-900"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center space-x-0.5">
                        <ChevronLeft className="w-4 h-4 text-studio-900" />
                        <ChevronRight className="w-4 h-4 text-studio-900" />
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Interactive Range Input */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={beforeAfterSlider}
                    onChange={(e) => setBeforeAfterSlider(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  />
                </div>

                {/* Labels and Badge */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium text-gray-400">Before</span>
                  <motion.div
                    className="flex items-center space-x-2 px-3 py-1.5 bg-electric-purple-500/10 border border-electric-purple-500/30 rounded-full"
                    animate={prefersReducedMotion ? {} : {
                      boxShadow: ['0 0 0px rgba(124, 58, 237, 0)', '0 0 20px rgba(124, 58, 237, 0.3)', '0 0 0px rgba(124, 58, 237, 0)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-electric-purple-400" />
                    <span className="text-xs font-medium text-electric-purple-300">Face Preserved</span>
                  </motion.div>
                  <span className="text-sm font-medium text-white">After</span>
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
              >
                <span className="text-xs font-bold text-white">AI Powered</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Three-Step Workflow with Scroll Animation */}
      <section
        ref={workflowRef}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-studio-900/50 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={workflowInView ? "visible" : "hidden"}
            variants={scrollReveal}
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              Perfect Photos in <span className="bg-gradient-electric bg-clip-text text-transparent">3 Easy Steps</span>
            </h2>
            <p className="text-xl text-gray-400">No technical knowledge required. Just upload, choose, and download.</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            animate={workflowInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {/* Step 1 */}
            <motion.div
              variants={itemVariants}
              className="group relative bg-studio-850 rounded-2xl p-8 border border-studio-700 hover:border-electric-purple-500/50 transition-all duration-500"
              whileHover={{ y: -8, boxShadow: '0 0 40px rgba(124, 58, 237, 0.2)' }}
            >
              {/* Connecting Line (visible on desktop) */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-electric-purple-500 to-transparent" />

              <motion.div
                className="absolute top-4 right-4 w-12 h-12 bg-electric-purple-500/10 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-2xl font-bold text-electric-purple-400">1</span>
              </motion.div>

              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-electric-purple-500 to-electric-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-glow"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Upload className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-2xl font-heading font-bold mb-3">Upload a Photo</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Drag & drop or click to upload your photo. We support JPG, PNG, and WEBP formats up to 10MB.
              </p>
              <div className="text-sm text-electric-purple-400 font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Face detection automatic</span>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={itemVariants}
              className="group relative bg-studio-850 rounded-2xl p-8 border border-studio-700 hover:border-electric-indigo-500/50 transition-all duration-500"
              whileHover={{ y: -8, boxShadow: '0 0 40px rgba(99, 102, 241, 0.2)' }}
            >
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-electric-indigo-500 to-transparent" />

              <motion.div
                className="absolute top-4 right-4 w-12 h-12 bg-electric-indigo-500/10 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-2xl font-bold text-electric-indigo-400">2</span>
              </motion.div>

              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-electric-indigo-500 to-electric-indigo-700 rounded-2xl flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{ boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)' }}
              >
                <Wand2 className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-2xl font-heading font-bold mb-3">Choose a Style</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Select from 34+ professional templates. Business, wedding, birthday, or artistic - we have it all.
              </p>
              <div className="text-sm text-electric-indigo-400 font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Studio lighting applied</span>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={itemVariants}
              className="group relative bg-studio-850 rounded-2xl p-8 border border-studio-700 hover:border-electric-blue-500/50 transition-all duration-500"
              whileHover={{ y: -8, boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)' }}
            >
              <motion.div
                className="absolute top-4 right-4 w-12 h-12 bg-electric-blue-500/10 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-2xl font-bold text-electric-blue-400">3</span>
              </motion.div>

              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-electric-blue-500 to-electric-blue-700 rounded-2xl flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}
              >
                <Download className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-2xl font-heading font-bold mb-3">Enhance & Download</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                AI enhances your photo in seconds. Preview, adjust quality, and download in high resolution.
              </p>
              <div className="text-sm text-electric-blue-400 font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Up to 8K resolution</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Template Showcase with Real Images */}
      <section id="templates" ref={templatesRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            animate={templatesInView ? "visible" : "hidden"}
            variants={scrollReveal}
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              Pick a Style & <span className="bg-gradient-electric bg-clip-text text-transparent">Watch the Magic</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose from professionally designed templates for every occasion. Each template includes optimized lighting, camera settings, and style presets.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial="hidden"
            animate={templatesInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                variants={itemVariants}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2
                  ${activeCategory === category.id
                    ? 'bg-gradient-electric text-white shadow-glow'
                    : 'bg-studio-850 text-gray-400 border border-studio-700 hover:border-electric-purple-500/50 hover:text-white'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Template Cards with Real Images */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
            >
              {currentTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  variants={itemVariants}
                  className="group relative bg-studio-850 rounded-2xl overflow-hidden border border-studio-700 hover:border-electric-purple-500/50 transition-all duration-500 cursor-pointer"
                  whileHover={{
                    y: -8,
                    boxShadow: '0 20px 60px rgba(124, 58, 237, 0.3)'
                  }}
                  onClick={onGetStarted}
                >
                  {/* Image Preview with Real Stock Photo */}
                  <div className="aspect-[4/5] bg-studio-900 relative overflow-hidden">
                    {/* Loading Skeleton */}
                    <div className="absolute inset-0 bg-studio-800 animate-skeleton" />

                    {/* Real Image */}
                    <motion.img
                      src={getTemplateImage(template.imageKey as keyof typeof templateImages)}
                      alt={template.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ scale: 1.1 }}
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.6 }}
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-studio-950 via-studio-950/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Hover Overlay with Info */}
                    <motion.div
                      className="absolute inset-0 flex items-end p-6"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <motion.div
                            className="w-8 h-8 bg-gradient-electric rounded-lg flex items-center justify-center"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-4 h-4 text-white" />
                          </motion.div>
                          <span className="text-sm font-medium text-white">AI Enhanced</span>
                        </div>
                        <motion.button
                          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium text-white border border-white/30 hover:bg-white/30 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Try This Style
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-electric-purple-400 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-electric-purple-400 font-medium">{template.subtitle}</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-electric-purple-400 transition-colors" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Explore All Button */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={templatesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={onGetStarted}
              className="px-8 py-4 bg-studio-850 text-white font-semibold rounded-xl border border-studio-700 hover:border-electric-purple-500 transition-all duration-300 inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124, 58, 237, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Explore All 34+ Templates</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section ref={trustRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-studio-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={trustInView ? "visible" : "hidden"}
            variants={scrollReveal}
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              <span className="bg-gradient-electric bg-clip-text text-transparent">AI Enhancements</span> You Can Trust
            </h2>
            <p className="text-xl text-gray-400">Your privacy and security are our top priorities</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate={trustInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {[
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your photos are never stored on our servers. Processing happens securely and temporarily.',
                color: 'electric-purple'
              },
              {
                icon: Lock,
                title: 'Face Preserved',
                description: 'Advanced AI preserves your facial identity while enhancing lighting and background.',
                color: 'electric-indigo'
              },
              {
                icon: Zap,
                title: 'No AI Training',
                description: 'We never use your images to train AI models. Your photos remain completely private.',
                color: 'electric-blue'
              },
              {
                icon: CheckCircle2,
                title: 'Studio Quality',
                description: 'Professional-grade results with perfect lighting, composition, and color grading.',
                color: 'electric-pink'
              }
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-studio-850 rounded-2xl p-8 border border-studio-700 text-center group"
                whileHover={{
                  y: -8,
                  borderColor: `rgba(124, 58, 237, 0.5)`,
                  boxShadow: '0 20px 60px rgba(124, 58, 237, 0.15)'
                }}
              >
                <motion.div
                  className={`w-16 h-16 bg-${feature.color}-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className={`w-8 h-8 text-${feature.color}-400`} />
                </motion.div>
                <h3 className="text-lg font-heading font-bold mb-3 group-hover:text-electric-purple-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={scrollRevealScale}
        >
          <motion.div
            className="bg-gradient-to-br from-electric-purple-500/10 to-electric-blue-500/10 rounded-3xl p-12 border border-electric-purple-500/20 relative overflow-hidden"
            whileHover={{ boxShadow: '0 0 80px rgba(124, 58, 237, 0.3)' }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

            <div className="relative">
              <motion.h2
                className="text-4xl sm:text-5xl font-heading font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                Ready to Transform Your Photos?
              </motion.h2>
              <motion.p
                className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                Join over 1 million users who trust Studio AI for professional-quality portraits. No signup required to get started.
              </motion.p>
              <motion.button
                onClick={onGetStarted}
                className="group px-10 py-5 bg-gradient-electric text-white text-lg font-bold rounded-xl shadow-glow-lg hover:shadow-glow transition-all duration-300 inline-flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <span>Create My Studio Photo</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </motion.button>
              <motion.p
                className="text-sm text-gray-400 mt-4"
                initial={{ opacity: 0 }}
                animate={ctaInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              >
                Free to try • No credit card required • Instant results
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-studio-700 py-12 px-4 sm:px-6 lg:px-8 bg-studio-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 bg-gradient-electric rounded-lg flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-heading font-bold">Studio AI</span>
            </motion.div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4 text-electric-purple-400" />
              <span>Powered by AI</span>
              <span className="text-studio-600">•</span>
              <Lock className="w-4 h-4 text-electric-indigo-400" />
              <span>Face-Preserved</span>
              <span className="text-studio-600">•</span>
              <Star className="w-4 h-4 text-electric-blue-400" />
              <span>Studio Quality</span>
            </div>

            <div className="text-sm text-gray-500">
              © 2026 Studio AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
