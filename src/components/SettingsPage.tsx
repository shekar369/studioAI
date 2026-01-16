import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Save, Eye, EyeOff, CheckCircle, XCircle, AlertCircle, Shield, ExternalLink, Sparkles } from 'lucide-react';
import { getAPI } from '../services/api/apiFactory';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

interface APIKeyConfig {
  id: string;
  name: string;
  logo: string;
  key: string;
  isValid: boolean | null;
  isChecking: boolean;
}

export const SettingsPage: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKeyConfig[]>([
    { id: 'openai', name: 'OpenAI', logo: '🤖', key: '', isValid: null, isChecking: false },
    { id: 'huggingface', name: 'Hugging Face', logo: '🤗', key: '', isValid: null, isChecking: false },
    { id: 'gemini', name: 'Google Gemini', logo: '✨', key: '', isValid: null, isChecking: false },
  ]);

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({
    openai: false,
    huggingface: false,
    gemini: false,
  });

  const [saveMessage, setSaveMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [defaultModel, setDefaultModel] = useState<string>('gpt-image-1');

  useEffect(() => {
    const loadedKeys = apiKeys.map(api => {
      const storedKey = localStorage.getItem(`api_key_${api.id}`);
      const envKey = import.meta.env[`VITE_${api.id.toUpperCase()}_API_KEY`];
      const key = storedKey || envKey || '';

      return {
        ...api,
        key,
        isValid: key ? null : false
      };
    });

    setApiKeys(loadedKeys);

    const savedModel = localStorage.getItem('default_model') || 'gpt-image-1';
    setDefaultModel(savedModel);
  }, []);

  const validateAPIKey = async (apiId: string, apiKey: string) => {
    if (!apiKey) return false;

    setApiKeys(prev => prev.map(api =>
      api.id === apiId ? { ...api, isChecking: true } : api
    ));

    try {
      const api = getAPI(apiId);
      const isValid = await api.authenticate(apiKey);

      setApiKeys(prev => prev.map(api =>
        api.id === apiId ? { ...api, isValid, isChecking: false } : api
      ));

      return isValid;
    } catch (error) {
      console.error(`Validation failed for ${apiId}:`, error);
      setApiKeys(prev => prev.map(api =>
        api.id === apiId ? { ...api, isValid: false, isChecking: false } : api
      ));
      return false;
    }
  };

  const handleKeyChange = (apiId: string, value: string) => {
    setApiKeys(prev => prev.map(api =>
      api.id === apiId ? { ...api, key: value, isValid: null } : api
    ));
  };

  const handleSaveKey = async (apiId: string) => {
    const api = apiKeys.find(a => a.id === apiId);
    if (!api) return;

    if (!api.key) {
      setSaveMessage({ text: `Please enter a ${api.name} API key`, type: 'error' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    const isValid = await validateAPIKey(apiId, api.key);

    if (isValid) {
      localStorage.setItem(`api_key_${apiId}`, api.key);
      setSaveMessage({ text: `${api.name} API key saved successfully!`, type: 'success' });
    } else {
      setSaveMessage({ text: `Invalid ${api.name} API key. Please check and try again.`, type: 'error' });
    }

    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleSaveAll = async () => {
    let allValid = true;

    for (const api of apiKeys) {
      if (api.key) {
        const isValid = await validateAPIKey(api.id, api.key);
        if (isValid) {
          localStorage.setItem(`api_key_${api.id}`, api.key);
        } else {
          allValid = false;
        }
      }
    }

    localStorage.setItem('default_model', defaultModel);

    if (allValid) {
      setSaveMessage({ text: 'All settings saved successfully!', type: 'success' });
    } else {
      setSaveMessage({ text: 'Some API keys are invalid. Please check and try again.', type: 'error' });
    }

    setTimeout(() => setSaveMessage(null), 3000);
  };

  const toggleKeyVisibility = (apiId: string) => {
    setShowKeys(prev => ({ ...prev, [apiId]: !prev[apiId] }));
  };

  const getStatusIcon = (api: APIKeyConfig) => {
    if (api.isChecking) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-5 h-5 border-2 border-electric-purple-500 border-t-transparent rounded-full"
        />
      );
    }
    if (api.isValid === true) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    if (api.isValid === false) {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
    return <AlertCircle className="w-5 h-5 text-studio-400" />;
  };

  return (
    <div className="min-h-screen bg-studio-950 bg-gradient-mesh py-8 px-4">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          className="bg-studio-850 border border-studio-700 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-purple-500 to-electric-blue-500 flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">API Settings</h1>
              <p className="text-studio-400 text-sm">
                Configure your API keys and preferences
              </p>
            </div>
          </div>
        </motion.div>

        {/* Save Message */}
        <AnimatePresence>
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
                saveMessage.type === 'success'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                {saveMessage.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span>{saveMessage.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API Keys Section */}
        <motion.div
          variants={staggerItem}
          className="bg-studio-850 border border-studio-700 rounded-2xl p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-electric-purple-400" />
            API Keys
          </h2>

          <motion.div className="space-y-4" variants={staggerContainer}>
            {apiKeys.map((api) => (
              <motion.div
                key={api.id}
                variants={staggerItem}
                className="border border-studio-700 rounded-xl p-4 bg-studio-900/50 hover:border-electric-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{api.logo}</span>
                    <div>
                      <h3 className="font-medium text-white">{api.name}</h3>
                      <p className="text-xs text-studio-400">
                        {api.id === 'openai' && 'Recommended for face preservation'}
                        {api.id === 'huggingface' && 'Free tier available'}
                        {api.id === 'gemini' && 'Free tier available'}
                      </p>
                    </div>
                  </div>
                  {getStatusIcon(api)}
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showKeys[api.id] ? 'text' : 'password'}
                      value={api.key}
                      onChange={(e) => handleKeyChange(api.id, e.target.value)}
                      placeholder={`Enter your ${api.name} API key`}
                      className="w-full px-4 py-3 pr-12 bg-studio-800 border border-studio-600 rounded-xl text-white placeholder-studio-500 focus:outline-none focus:ring-2 focus:ring-electric-purple-500/50 focus:border-electric-purple-500 font-mono text-sm transition-all duration-300"
                    />
                    <button
                      onClick={() => toggleKeyVisibility(api.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-studio-400 hover:text-white transition-colors"
                    >
                      {showKeys[api.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => handleSaveKey(api.id)}
                      disabled={!api.key || api.isChecking}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-electric-purple-600 to-electric-blue-600 text-white rounded-xl hover:from-electric-purple-500 hover:to-electric-blue-500 disabled:from-studio-700 disabled:to-studio-700 disabled:text-studio-500 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium"
                      whileHover={{ scale: api.key && !api.isChecking ? 1.02 : 1 }}
                      whileTap={{ scale: api.key && !api.isChecking ? 0.98 : 1 }}
                    >
                      Save {api.name} Key
                    </motion.button>
                    <motion.button
                      onClick={() => validateAPIKey(api.id, api.key)}
                      disabled={!api.key || api.isChecking}
                      className="px-4 py-2.5 border border-studio-600 rounded-xl hover:bg-studio-800 hover:border-electric-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium text-gray-300"
                      whileHover={{ scale: api.key && !api.isChecking ? 1.02 : 1 }}
                      whileTap={{ scale: api.key && !api.isChecking ? 0.98 : 1 }}
                    >
                      Test
                    </motion.button>
                  </div>

                  {/* How to get key */}
                  <details className="text-xs text-studio-400 group">
                    <summary className="cursor-pointer hover:text-white transition-colors flex items-center space-x-1">
                      <ExternalLink className="w-3 h-3" />
                      <span>How to get this API key?</span>
                    </summary>
                    <div className="mt-3 pl-4 space-y-1.5 text-studio-300 bg-studio-800/50 rounded-lg p-3">
                      {api.id === 'openai' && (
                        <>
                          <p>1. Go to <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="text-electric-purple-400 hover:underline">platform.openai.com</a></p>
                          <p>2. Sign up or log in</p>
                          <p>3. Navigate to API Keys section</p>
                          <p>4. Create new secret key</p>
                          <p>5. Copy the key (starts with sk-proj-...)</p>
                        </>
                      )}
                      {api.id === 'huggingface' && (
                        <>
                          <p>1. Go to <a href="https://huggingface.co/" target="_blank" rel="noopener noreferrer" className="text-electric-purple-400 hover:underline">huggingface.co</a></p>
                          <p>2. Sign up or log in</p>
                          <p>3. Go to Settings → Access Tokens</p>
                          <p>4. Create new token (Read access)</p>
                          <p>5. Copy the token (starts with hf_...)</p>
                        </>
                      )}
                      {api.id === 'gemini' && (
                        <>
                          <p>1. Go to <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-electric-purple-400 hover:underline">ai.google.dev</a></p>
                          <p>2. Click "Get API Key"</p>
                          <p>3. Create or select project</p>
                          <p>4. Generate API key</p>
                          <p>5. Copy the key</p>
                        </>
                      )}
                    </div>
                  </details>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Model Settings */}
        <motion.div
          variants={staggerItem}
          className="bg-studio-850 border border-studio-700 rounded-2xl p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-electric-blue-400" />
            Default Model Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Default OpenAI Model
              </label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full px-4 py-3 bg-studio-900 border border-studio-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-electric-purple-500/50 focus:border-electric-purple-500 transition-all duration-300"
              >
                <option value="gpt-image-1">gpt-image-1 (Image Editing - Best for face preservation)</option>
                <option value="dall-e-3">DALL-E 3 (Image Generation - High quality)</option>
                <option value="dall-e-2">DALL-E 2 (Image Generation - Faster, cheaper)</option>
              </select>
              <p className="mt-2 text-xs text-studio-400">
                gpt-image-1 is recommended for preserving your face while adding themes
              </p>
            </div>
          </div>
        </motion.div>

        {/* Save All Button */}
        <motion.div
          variants={staggerItem}
          className="bg-studio-850 border border-studio-700 rounded-2xl p-6"
        >
          <motion.button
            onClick={handleSaveAll}
            className="w-full py-4 bg-gradient-to-r from-electric-purple-600 to-electric-blue-600 text-white rounded-xl hover:from-electric-purple-500 hover:to-electric-blue-500 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-glow hover:shadow-glow-lg"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Save className="w-5 h-5" />
            <span>Save All Settings</span>
          </motion.button>
        </motion.div>

        {/* Info Section */}
        <motion.div
          variants={fadeInUp}
          className="mt-6 bg-electric-blue-500/10 border border-electric-blue-500/30 rounded-2xl p-4"
        >
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-electric-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-electric-blue-300">
              <p className="font-medium mb-2 text-electric-blue-200">Security Note</p>
              <ul className="list-disc list-inside space-y-1 text-electric-blue-300/80">
                <li>API keys are stored locally in your browser (localStorage)</li>
                <li>Keys are never sent to any server except the respective API providers</li>
                <li>For production, consider using environment variables</li>
                <li>Never share your API keys publicly</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
