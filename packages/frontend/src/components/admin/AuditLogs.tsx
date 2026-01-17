import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  FileText,
  User,
  Key,
  Shield,
  LogIn,
  LogOut,
  UserPlus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  userId: string | null;
  userEmail: string | null;
  ipAddress: string;
  details: string | null;
  createdAt: string;
}

// Mock data
const mockLogs: AuditLog[] = [
  {
    id: '1',
    action: 'USER_LOGIN',
    resource: 'auth',
    userId: '123',
    userEmail: 'admin@example.com',
    ipAddress: '192.168.1.1',
    details: 'Successful login',
    createdAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    action: 'API_KEY_CREATED',
    resource: 'api_keys',
    userId: '123',
    userEmail: 'admin@example.com',
    ipAddress: '192.168.1.1',
    details: 'Created API key: Production OpenAI',
    createdAt: '2024-01-20T14:25:00Z',
  },
  {
    id: '3',
    action: 'USER_ROLE_UPDATED',
    resource: 'users',
    userId: '123',
    userEmail: 'admin@example.com',
    ipAddress: '192.168.1.1',
    details: 'Updated user role: john@example.com -> ADMIN',
    createdAt: '2024-01-20T14:20:00Z',
  },
  {
    id: '4',
    action: 'USER_REGISTERED',
    resource: 'auth',
    userId: '456',
    userEmail: 'newuser@example.com',
    ipAddress: '10.0.0.5',
    details: 'New user registration',
    createdAt: '2024-01-20T14:15:00Z',
  },
  {
    id: '5',
    action: 'USER_LOGOUT',
    resource: 'auth',
    userId: '789',
    userEmail: 'jane@example.com',
    ipAddress: '172.16.0.10',
    details: 'User logged out',
    createdAt: '2024-01-20T14:10:00Z',
  },
  {
    id: '6',
    action: 'SETTINGS_UPDATED',
    resource: 'settings',
    userId: '123',
    userEmail: 'admin@example.com',
    ipAddress: '192.168.1.1',
    details: 'Updated rate limiting settings',
    createdAt: '2024-01-20T14:05:00Z',
  },
];

const actionIcons: Record<string, React.ElementType> = {
  USER_LOGIN: LogIn,
  USER_LOGOUT: LogOut,
  USER_REGISTERED: UserPlus,
  USER_ROLE_UPDATED: Shield,
  API_KEY_CREATED: Key,
  API_KEY_DELETED: Key,
  SETTINGS_UPDATED: Settings,
};

const actionColors: Record<string, string> = {
  USER_LOGIN: 'bg-green-500/10 text-green-400',
  USER_LOGOUT: 'bg-gray-500/10 text-gray-400',
  USER_REGISTERED: 'bg-blue-500/10 text-blue-400',
  USER_ROLE_UPDATED: 'bg-orange-500/10 text-orange-400',
  API_KEY_CREATED: 'bg-purple-500/10 text-purple-400',
  API_KEY_DELETED: 'bg-red-500/10 text-red-400',
  SETTINGS_UPDATED: 'bg-yellow-500/10 text-yellow-400',
};

export function AuditLogs() {
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const formatAction = (action: string) => {
    return action
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Audit Logs</h1>
          <p className="text-white/60">Track all system activities and changes.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all">
          <Download className="w-5 h-5" />
          Export
        </button>
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
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
        </div>

        {/* Action filter */}
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
        >
          <option value="all">All Actions</option>
          <option value="USER_LOGIN">User Login</option>
          <option value="USER_LOGOUT">User Logout</option>
          <option value="USER_REGISTERED">User Registered</option>
          <option value="USER_ROLE_UPDATED">Role Updated</option>
          <option value="API_KEY_CREATED">API Key Created</option>
          <option value="SETTINGS_UPDATED">Settings Updated</option>
        </select>
      </motion.div>

      {/* Logs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
      >
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/40">No logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredLogs.map((log) => {
              const Icon = actionIcons[log.action] || FileText;
              const colorClass = actionColors[log.action] || 'bg-gray-500/10 text-gray-400';

              return (
                <div key={log.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">{formatAction(log.action)}</span>
                        <span className="text-white/30">•</span>
                        <span className="text-white/40 text-sm">{log.resource}</span>
                      </div>
                      {log.details && (
                        <p className="text-white/60 text-sm mb-2">{log.details}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        {log.userEmail && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {log.userEmail}
                          </span>
                        )}
                        <span>IP: {log.ipAddress}</span>
                        <span>
                          {new Date(log.createdAt).toLocaleDateString()}{' '}
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <p className="text-white/40 text-sm">
            Showing {filteredLogs.length} of {logs.length} logs
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-50 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white/60 text-sm px-3">1 / 1</span>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-50 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AuditLogs;
