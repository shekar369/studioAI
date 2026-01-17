import { motion } from 'framer-motion';
import {
  Users,
  Key,
  Images,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

const stats = [
  { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'purple' },
  { label: 'Active API Keys', value: '8', change: '0', icon: Key, color: 'blue' },
  { label: 'Photos Generated', value: '45.2K', change: '+23%', icon: Images, color: 'pink' },
  { label: 'API Calls Today', value: '3,456', change: '+8%', icon: Activity, color: 'green' },
];

const recentActivity = [
  { type: 'user', action: 'New user registered', user: 'john@example.com', time: '2 min ago', icon: Users },
  { type: 'photo', action: 'Photo generated', user: 'jane@example.com', time: '5 min ago', icon: Images },
  { type: 'api', action: 'API key created', user: 'admin@example.com', time: '1 hour ago', icon: Key },
  { type: 'alert', action: 'Rate limit exceeded', user: 'user@example.com', time: '2 hours ago', icon: AlertTriangle },
];

const systemStatus = [
  { name: 'API Server', status: 'operational', uptime: '99.9%' },
  { name: 'Database', status: 'operational', uptime: '99.99%' },
  { name: 'OpenAI API', status: 'operational', uptime: '99.5%' },
  { name: 'Storage (S3)', status: 'operational', uptime: '100%' },
];

export function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/60">Monitor and manage your application.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              {stat.change !== '0' && (
                <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-white/50 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  activity.type === 'alert' ? 'bg-yellow-500/20' : 'bg-white/10'
                }`}>
                  <activity.icon className={`w-4 h-4 ${
                    activity.type === 'alert' ? 'text-yellow-400' : 'text-white/60'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{activity.action}</p>
                  <p className="text-white/40 text-xs truncate">{activity.user}</p>
                </div>
                <span className="text-white/40 text-xs whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
          <div className="space-y-4">
            {systemStatus.map((service) => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    service.status === 'operational' ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                  <span className="text-white">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/40 text-sm">{service.uptime}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    service.status === 'operational'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">All systems operational</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;
