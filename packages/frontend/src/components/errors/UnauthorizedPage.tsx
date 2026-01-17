import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-500/10 flex items-center justify-center"
        >
          <ShieldX className="w-12 h-12 text-red-400" />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Access Denied
        </h1>
        <p className="text-white/60 mb-8">
          You don't have permission to access this page. Please contact an
          administrator if you believe this is a mistake.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go back
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default UnauthorizedPage;
