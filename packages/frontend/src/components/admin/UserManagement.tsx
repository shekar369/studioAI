import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  Shield,
  Ban,
  Trash2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';

type Role = 'GUEST' | 'USER' | 'ADMIN' | 'SUPER_ADMIN';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: Role;
  emailVerified: boolean;
  isActive: boolean;
  isBanned: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
    emailVerified: true,
    isActive: true,
    isBanned: false,
    createdAt: '2024-01-15T10:30:00Z',
    lastLoginAt: '2024-01-20T14:22:00Z',
  },
  {
    id: '2',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'ADMIN',
    emailVerified: true,
    isActive: true,
    isBanned: false,
    createdAt: '2024-01-10T08:15:00Z',
    lastLoginAt: '2024-01-20T09:45:00Z',
  },
  {
    id: '3',
    email: 'bob@example.com',
    firstName: 'Bob',
    lastName: null,
    role: 'USER',
    emailVerified: false,
    isActive: true,
    isBanned: false,
    createdAt: '2024-01-18T16:00:00Z',
    lastLoginAt: null,
  },
];

const roleColors: Record<Role, string> = {
  GUEST: 'bg-gray-500/10 text-gray-400',
  USER: 'bg-blue-500/10 text-blue-400',
  ADMIN: 'bg-orange-500/10 text-orange-400',
  SUPER_ADMIN: 'bg-red-500/10 text-red-400',
};

export function UserManagement() {
  const [users] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">User Management</h1>
        <p className="text-white/60">Manage user accounts and permissions.</p>
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
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
        </div>

        {/* Role filter */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="USER">Users</option>
          <option value="ADMIN">Admins</option>
          <option value="SUPER_ADMIN">Super Admins</option>
        </select>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
      >
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 text-white/50 text-sm font-medium">
          <div className="col-span-4">User</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-2">Actions</div>
        </div>

        {/* Table Body */}
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/40">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
              >
                {/* User Info */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-medium">
                    {user.firstName?.[0] || user.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.email}
                    </p>
                    <p className="text-white/40 text-sm truncate">{user.email}</p>
                  </div>
                </div>

                {/* Role */}
                <div className="col-span-2 flex items-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center gap-2">
                  {user.isBanned ? (
                    <span className="flex items-center gap-1.5 text-red-400 text-sm">
                      <Ban className="w-4 h-4" />
                      Banned
                    </span>
                  ) : user.emailVerified ? (
                    <span className="flex items-center gap-1.5 text-green-400 text-sm">
                      <Check className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-yellow-400 text-sm">
                      <Mail className="w-4 h-4" />
                      Pending
                    </span>
                  )}
                </div>

                {/* Joined */}
                <div className="col-span-2 flex items-center text-white/50 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center gap-2">
                  <button
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    title="Change role"
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-all ${
                      user.isBanned
                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                        : 'bg-white/5 hover:bg-yellow-500/10 text-white/60 hover:text-yellow-400'
                    }`}
                    title={user.isBanned ? 'Unban user' : 'Ban user'}
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-all"
                    title="Delete user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <p className="text-white/40 text-sm">
            Showing {filteredUsers.length} of {users.length} users
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

export default UserManagement;
