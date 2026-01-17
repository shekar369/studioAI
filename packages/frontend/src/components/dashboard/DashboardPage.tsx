import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Wand2,
  Images,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const stats = [
  { label: 'Photos Generated', value: '24', icon: Wand2, color: 'purple' },
  { label: 'Photos Saved', value: '18', icon: Images, color: 'pink' },
  { label: 'This Month', value: '12', icon: TrendingUp, color: 'blue' },
  { label: 'Last Active', value: 'Today', icon: Clock, color: 'green' },
];

const quickActions = [
  {
    title: 'Generate New Photo',
    description: 'Transform your photos with AI',
    icon: Wand2,
    path: '/app/generator',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'View Library',
    description: 'Browse your saved photos',
    icon: Images,
    path: '/app/library',
    gradient: 'from-blue-500 to-cyan-500',
  },
];

export function DashboardPage() {
  const { user } = useAuthStore();

  const firstName = user?.profile?.firstName || user?.email?.split('@')[0] || 'there';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          Welcome back, {firstName}!
        </h1>
        <p className="text-white/60">
          Here's what's happening with your photos today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-white/50 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 hover:border-white/20 transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                  {action.title}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-white/50 text-sm">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No recent activity</h3>
            <p className="text-white/50 mb-4 max-w-sm">
              Start generating photos to see your recent activity here.
            </p>
            <Link
              to="/app/generator"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-xl transition-all"
            >
              <Wand2 className="w-4 h-4" />
              Generate Your First Photo
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardPage;
