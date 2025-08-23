import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const InteractiveReader = ({ text, onWordClick, onBack, selectedWord }) => {
  const [hoveredWord, setHoveredWord] = useState(null);

  const processText = (text) => {
    // Split text into words while preserving punctuation and spacing
    const words = text.split(/(\s+|[.!?।॥,;:])/);
    
    return words.map((word, index) => {
      const cleanWord = word.trim();
      
      // Skip empty strings and pure whitespace/punctuation
      if (!cleanWord || /^[\s.!?।॥,;:]+$/.test(cleanWord)) {
        return <span key={index}>{word}</span>;
      }
      
      // Remove punctuation for word lookup but keep original for display
      const wordForLookup = cleanWord.replace(/[.!?।॥,;:]+$/, '');
      
      const isSelected = selectedWord === wordForLookup;
      const isHovered = hoveredWord === wordForLookup;
      
      return (
        <span
          key={index}
          className={`cursor-pointer transition-all duration-200 px-1 py-0.5 rounded ${
            isSelected
              ? 'bg-kannada-orange text-white shadow-md'
              : isHovered
              ? 'bg-kannada-orange bg-opacity-20'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => onWordClick(wordForLookup)}
          onMouseEnter={() => setHoveredWord(wordForLookup)}
          onMouseLeave={() => setHoveredWord(null)}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Text Input
        </button>
        <div className="text-sm text-gray-500">
          Click any word to see its meaning
        </div>
      </div>
      
      <div className="p-6">
        <div className="kannada-text text-xl leading-relaxed text-gray-800 selection:bg-kannada-orange selection:text-white">
          {processText(text)}
        </div>
      </div>
    </div>
  );
};

export default InteractiveReader;