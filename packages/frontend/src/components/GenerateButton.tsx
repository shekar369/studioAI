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
        w-full py-4 rounded-xl font-semibold text-white text-lg
        transition-all duration-300 flex items-center justify-center space-x-2
        ${disabled || isGenerating
          ? 'bg-studio-700 cursor-not-allowed text-gray-400'
          : 'bg-gradient-electric hover:scale-[1.02] shadow-glow hover:shadow-glow-lg'
        }
      `}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-bold">Generating Studio Photo...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-6 h-6" />
          <span className="font-bold">Create My Studio Photo</span>
        </>
      )}
    </button>
  );
};
