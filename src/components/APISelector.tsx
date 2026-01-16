import React, { useState } from 'react';
import { Check, AlertCircle, Key } from 'lucide-react';
import type { APISelectorProps } from '../types/ui.types';

export const APISelector: React.FC<APISelectorProps> = ({
  apis,
  selectedAPI,
  onSelectAPI,
  apiStatus
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [selectedAPIForKey, setSelectedAPIForKey] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAPIClick = (apiId: string) => {
    const status = apiStatus[apiId];

    if (!status?.authenticated) {
      // Show API key modal
      setSelectedAPIForKey(apiId);
      setShowKeyModal(true);
    } else {
      // Select API
      onSelectAPI(apiId);
    }
  };

  const handleSaveAPIKey = async () => {
    if (selectedAPIForKey && apiKey) {
      setIsSaving(true);
      try {
        // Save to localStorage
        localStorage.setItem(`api_key_${selectedAPIForKey}`, apiKey);

        // Close modal and reset
        setShowKeyModal(false);
        setApiKey('');

        // Trigger API selection which will re-verify in parent
        onSelectAPI(selectedAPIForKey);
      } catch (error) {
        console.error('Error saving API key:', error);
        alert('Failed to save API key. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const getStatusColor = (apiId: string) => {
    const status = apiStatus[apiId];
    if (!status) return 'gray';
    if (!status.authenticated) return 'yellow';
    if (status.available) return 'green';
    return 'red';
  };

  const getStatusIcon = (apiId: string) => {
    const color = getStatusColor(apiId);
    return (
      <div className={`w-2 h-2 rounded-full bg-${color}-500`} />
    );
  };

  return (
    <>
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Select AI Provider</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {apis.map((api) => {
            const isSelected = selectedAPI === api.id;
            const status = apiStatus[api.id];
            const isAuthenticated = status?.authenticated ?? false;

            return (
              <button
                key={api.id}
                onClick={() => handleAPIClick(api.id)}
                className={`
                  relative p-4 rounded-lg border-2 text-left transition-all
                  ${isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }
                `}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* API Logo/Icon */}
                <div className="flex items-start space-x-3 mb-3">
                  <div className="text-3xl">{api.logo}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{api.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{api.description}</p>
                  </div>
                </div>

                {/* Status and Features */}
                <div className="space-y-2">
                  {/* Authentication Status */}
                  <div className="flex items-center space-x-2 text-xs">
                    {getStatusIcon(api.id)}
                    <span className={`
                      ${isAuthenticated ? 'text-green-600' : 'text-yellow-600'}
                    `}>
                      {isAuthenticated ? 'Connected' : 'API Key Required'}
                    </span>
                  </div>

                  {/* Pricing Tier */}
                  <div className="flex items-center space-x-2">
                    <span className={`
                      text-xs px-2 py-0.5 rounded
                      ${api.pricingTier === 'free' || api.pricingTier === 'freemium'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                      }
                    `}>
                      {api.pricingTier === 'free' ? 'Free' : api.pricingTier === 'freemium' ? 'Free Tier' : 'Paid'}
                    </span>

                    {api.capabilities.facePreservation && (
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                        Face Preservation
                      </span>
                    )}
                  </div>

                  {/* Limits */}
                  <div className="text-xs text-gray-500">
                    Max: {api.limits.maxResolution}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && selectedAPIForKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Key className="w-6 h-6 text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Enter API Key
              </h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Enter your API key for {apis.find(a => a.id === selectedAPIForKey)?.name}.
              Your key is stored locally and never sent to our servers.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-700">
                  <p className="font-medium mb-1">How to get an API key:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedAPIForKey === 'huggingface' && (
                      <>
                        <li>Go to huggingface.co</li>
                        <li>Sign up or log in</li>
                        <li>Navigate to Settings → Access Tokens</li>
                        <li>Create a new token</li>
                      </>
                    )}
                    {selectedAPIForKey === 'gemini' && (
                      <>
                        <li>Go to ai.google.dev</li>
                        <li>Click "Get API Key"</li>
                        <li>Create a new project</li>
                        <li>Generate your API key</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveAPIKey}
                  disabled={!apiKey || isSaving}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? 'Connecting...' : 'Save & Connect'}
                </button>
                <button
                  onClick={() => {
                    setShowKeyModal(false);
                    setApiKey('');
                    setSelectedAPIForKey(null);
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
