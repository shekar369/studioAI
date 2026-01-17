import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Loader2,
  Star,
} from 'lucide-react';

const apiKeySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  provider: z.enum(['openai', 'huggingface', 'gemini', 'replicate']),
  apiKey: z.string().min(1, 'API key is required'),
});

type APIKeyFormData = z.infer<typeof apiKeySchema>;

interface APIKey {
  id: string;
  name: string;
  provider: string;
  maskedKey: string;
  isActive: boolean;
  isDefault: boolean;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
}

// Mock data
const mockAPIKeys: APIKey[] = [
  {
    id: '1',
    name: 'Production OpenAI',
    provider: 'openai',
    maskedKey: 'sk-...abc123',
    isActive: true,
    isDefault: true,
    usageCount: 15234,
    lastUsedAt: '2024-01-20T14:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Backup HuggingFace',
    provider: 'huggingface',
    maskedKey: 'hf_...xyz789',
    isActive: true,
    isDefault: false,
    usageCount: 432,
    lastUsedAt: '2024-01-19T10:15:00Z',
    createdAt: '2024-01-05T00:00:00Z',
  },
];

const providerColors: Record<string, string> = {
  openai: 'bg-green-500/10 text-green-400 border-green-500/20',
  huggingface: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  gemini: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  replicate: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export function APIKeysManager() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>(mockAPIKeys);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<APIKeyFormData>({
    resolver: zodResolver(apiKeySchema),
  });

  const onSubmit = async (data: APIKeyFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newKey: APIKey = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        provider: data.provider,
        maskedKey: `${data.apiKey.substring(0, 4)}...${data.apiKey.slice(-6)}`,
        isActive: true,
        isDefault: apiKeys.length === 0,
        usageCount: 0,
        lastUsedAt: null,
        createdAt: new Date().toISOString(),
      };
      setApiKeys([...apiKeys, newKey]);
      setShowAddModal(false);
      reset();
    } catch (error) {
      console.error('Failed to add API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  const handleSetDefault = async (id: string) => {
    setApiKeys(
      apiKeys.map((key) => ({
        ...key,
        isDefault: key.id === id,
      }))
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">API Keys</h1>
          <p className="text-white/60">Manage API keys for AI providers.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-medium rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Key
        </button>
      </motion.div>

      {/* Warning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-6"
      >
        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-yellow-400 font-medium text-sm">Security Notice</p>
          <p className="text-yellow-400/70 text-sm mt-1">
            API keys are encrypted and stored securely. Never share your API keys publicly.
          </p>
        </div>
      </motion.div>

      {/* API Keys List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {apiKeys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-white/5 border border-white/10">
            <Key className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/40 mb-4">No API keys configured</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add your first API key
            </button>
          </div>
        ) : (
          apiKeys.map((apiKey) => (
            <motion.div
              key={apiKey.id}
              layout
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Key className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium">{apiKey.name}</h3>
                      {apiKey.isDefault && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 text-orange-400 text-xs rounded-full">
                          <Star className="w-3 h-3" />
                          Default
                        </span>
                      )}
                    </div>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full border ${providerColors[apiKey.provider]}`}>
                      {apiKey.provider}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!apiKey.isDefault && (
                    <button
                      onClick={() => handleSetDefault(apiKey.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-orange-500/10 text-white/40 hover:text-orange-400 transition-all"
                      title="Set as default"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(apiKey.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-black/30">
                <code className="flex-1 text-white/60 font-mono text-sm">
                  {showApiKey[apiKey.id] ? apiKey.maskedKey : '••••••••••••••••'}
                </code>
                <button
                  onClick={() => setShowApiKey({ ...showApiKey, [apiKey.id]: !showApiKey[apiKey.id] })}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                >
                  {showApiKey[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleCopy(apiKey.id, apiKey.maskedKey)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                >
                  {copiedId === apiKey.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm text-white/40">
                <span>{apiKey.usageCount.toLocaleString()} requests</span>
                <span>•</span>
                <span>
                  {apiKey.lastUsedAt
                    ? `Last used ${new Date(apiKey.lastUsedAt).toLocaleDateString()}`
                    : 'Never used'}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Add API Key Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-2xl bg-gray-900 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Add API Key</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Name
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="e.g., Production OpenAI"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Provider
                  </label>
                  <select
                    {...register('provider')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="huggingface">HuggingFace</option>
                    <option value="gemini">Google Gemini</option>
                    <option value="replicate">Replicate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    API Key
                  </label>
                  <input
                    {...register('apiKey')}
                    type="password"
                    placeholder="Enter your API key"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all font-mono"
                  />
                  {errors.apiKey && (
                    <p className="mt-2 text-sm text-red-400">{errors.apiKey.message}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Key'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default APIKeysManager;
