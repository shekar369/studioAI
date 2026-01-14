import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  disabled = false,
  isGenerating = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isGenerating}
      className={`
        w-full py-4 rounded-lg font-medium text-white text-lg
        transition-all duration-200 flex items-center justify-center space-x-2
        ${disabled || isGenerating
          ? 'bg-gray-400 cursor-not-allowed text-gray-100'
          : 'bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 shadow-lg hover:shadow-xl'
        }
      `}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-semibold">Generating...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-6 h-6" />
          <span className="font-semibold">Generate Image</span>
        </>
      )}
    </button>
  );
};
