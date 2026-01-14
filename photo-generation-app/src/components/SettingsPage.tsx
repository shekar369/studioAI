import { useState, useEffect } from 'react';
import { Key, Save, Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getAPI } from '../services/api/apiFactory';

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

  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [defaultModel, setDefaultModel] = useState<string>('gpt-image-1');

  // Load API keys from localStorage and env on mount
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

    // Load default model
    const savedModel = localStorage.getItem('default_model') || 'gpt-image-1';
    setDefaultModel(savedModel);
  }, []);

  // Validate API key
  const validateAPIKey = async (apiId: string, apiKey: string) => {
    if (!apiKey) {
      return false;
    }

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

  // Handle API key change
  const handleKeyChange = (apiId: string, value: string) => {
    setApiKeys(prev => prev.map(api =>
      api.id === apiId ? { ...api, key: value, isValid: null } : api
    ));
  };

  // Save API key
  const handleSaveKey = async (apiId: string) => {
    const api = apiKeys.find(a => a.id === apiId);
    if (!api) return;

    if (!api.key) {
      setSaveMessage(`Please enter a ${api.name} API key`);
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    // Validate the key
    const isValid = await validateAPIKey(apiId, api.key);

    if (isValid) {
      // Save to localStorage
      localStorage.setItem(`api_key_${apiId}`, api.key);
      setSaveMessage(`${api.name} API key saved successfully!`);
    } else {
      setSaveMessage(`Invalid ${api.name} API key. Please check and try again.`);
    }

    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Save all keys
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

    // Save default model
    localStorage.setItem('default_model', defaultModel);

    if (allValid) {
      setSaveMessage('All settings saved successfully!');
    } else {
      setSaveMessage('Some API keys are invalid. Please check and try again.');
    }

    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Toggle key visibility
  const toggleKeyVisibility = (apiId: string) => {
    setShowKeys(prev => ({ ...prev, [apiId]: !prev[apiId] }));
  };

  // Get status icon
  const getStatusIcon = (api: APIKeyConfig) => {
    if (api.isChecking) {
      return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    }
    if (api.isValid === true) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (api.isValid === false) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return <AlertCircle className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Key className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">API Settings</h1>
          </div>
          <p className="text-gray-600">
            Configure your API keys and preferences. Keys are stored locally in your browser.
          </p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            saveMessage.includes('successfully')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* API Keys Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Keys</h2>

          <div className="space-y-6">
            {apiKeys.map((api) => (
              <div key={api.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{api.logo}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{api.name}</h3>
                      <p className="text-xs text-gray-500">
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
                      className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                    <button
                      onClick={() => toggleKeyVisibility(api.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                    >
                      {showKeys[api.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSaveKey(api.id)}
                      disabled={!api.key || api.isChecking}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Save {api.name} Key
                    </button>
                    <button
                      onClick={() => validateAPIKey(api.id, api.key)}
                      disabled={!api.key || api.isChecking}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Test
                    </button>
                  </div>

                  {/* How to get key */}
                  <details className="text-xs text-gray-600">
                    <summary className="cursor-pointer hover:text-gray-900">How to get this API key?</summary>
                    <div className="mt-2 pl-4 space-y-1">
                      {api.id === 'openai' && (
                        <>
                          <p>1. Go to <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.openai.com</a></p>
                          <p>2. Sign up or log in</p>
                          <p>3. Navigate to API Keys section</p>
                          <p>4. Create new secret key</p>
                          <p>5. Copy the key (starts with sk-proj-...)</p>
                        </>
                      )}
                      {api.id === 'huggingface' && (
                        <>
                          <p>1. Go to <a href="https://huggingface.co/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">huggingface.co</a></p>
                          <p>2. Sign up or log in</p>
                          <p>3. Go to Settings → Access Tokens</p>
                          <p>4. Create new token (Read access)</p>
                          <p>5. Copy the token (starts with hf_...)</p>
                        </>
                      )}
                      {api.id === 'gemini' && (
                        <>
                          <p>1. Go to <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ai.google.dev</a></p>
                          <p>2. Click "Get API Key"</p>
                          <p>3. Create or select project</p>
                          <p>4. Generate API key</p>
                          <p>5. Copy the key</p>
                        </>
                      )}
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Default Model Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default OpenAI Model
              </label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gpt-image-1">gpt-image-1 (Image Editing - Best for face preservation)</option>
                <option value="dall-e-3">DALL-E 3 (Image Generation - High quality)</option>
                <option value="dall-e-2">DALL-E 2 (Image Generation - Faster, cheaper)</option>
              </select>
              <p className="mt-2 text-xs text-gray-500">
                gpt-image-1 is recommended for preserving your face while adding themes
              </p>
            </div>
          </div>
        </div>

        {/* Save All Button */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <button
            onClick={handleSaveAll}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save All Settings</span>
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Security Note</p>
              <ul className="list-disc list-inside space-y-1">
                <li>API keys are stored locally in your browser (localStorage)</li>
                <li>Keys are never sent to any server except the respective API providers</li>
                <li>For production, consider using environment variables</li>
                <li>Never share your API keys publicly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
