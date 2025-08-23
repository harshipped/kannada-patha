import React, { useState } from 'react';
import { Volume2, BookOpen, X } from 'lucide-react';

const DictionaryPanel = ({ word, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Simple dictionary data - in a real app, this would come from an API
  const getDictionary = (word) => {
    const dictionary = {
      'ರಾಜ': {
        romanization: 'raaja',
        definition: 'King, ruler, monarch',
        wordType: 'noun'
      },
      'ದಯಾಳು': {
        romanization: 'dayaaLu',
        definition: 'Kind, compassionate, merciful',
        wordType: 'adjective'
      },
      'ಊರು': {
        romanization: 'ooru',
        definition: 'Village, town, place',
        wordType: 'noun'
      },
      'ಪ್ರೀತಿ': {
        romanization: 'preeti',
        definition: 'Love, affection',
        wordType: 'noun'
      },
      'ಪುಸ್ತಕ': {
        romanization: 'pustaka',
        definition: 'Book',
        wordType: 'noun'
      },
      'ನೀರು': {
        romanization: 'neeru',
        definition: 'Water',
        wordType: 'noun'
      },
      'ಮನೆ': {
        romanization: 'mane',
        definition: 'House, home',
        wordType: 'noun'
      },
      'ಬರು': {
        romanization: 'baru',
        definition: 'To come',
        wordType: 'verb'
      },
      'ಹೋಗು': {
        romanization: 'hogu',
        definition: 'To go',
        wordType: 'verb'
      },
      'ಒಳ್ಳೆಯ': {
        romanization: 'oLLeya',
        definition: 'Good, nice',
        wordType: 'adjective'
      }
    };
    
    return dictionary[word] || {
      romanization: transliterate(word),
      definition: 'Definition not found in dictionary',
      wordType: 'unknown'
    };
  };

  const transliterate = (kannadaWord) => {
    // Basic transliteration mapping
    const mapping = {
      'ಅ': 'a', 'ಆ': 'aa', 'ಇ': 'i', 'ಈ': 'ee', 'ಉ': 'u', 'ಊ': 'oo',
      'ಎ': 'e', 'ಏ': 'ee', 'ಐ': 'ai', 'ಒ': 'o', 'ಓ': 'oo', 'ಔ': 'au',
      'ಕ': 'ka', 'ಖ': 'kha', 'ಗ': 'ga', 'ಘ': 'gha', 'ಙ': 'nga',
      'ಚ': 'cha', 'ಛ': 'chha', 'ಜ': 'ja', 'ಝ': 'jha', 'ಞ': 'nja',
      'ಟ': 'Ta', 'ಠ': 'Tha', 'ಡ': 'Da', 'ಢ': 'Dha', 'ಣ': 'Na',
      'ತ': 'ta', 'ಥ': 'tha', 'ದ': 'da', 'ಧ': 'dha', 'ನ': 'na',
      'ಪ': 'pa', 'ಫ': 'pha', 'ಬ': 'ba', 'ಭ': 'bha', 'ಮ': 'ma',
      'ಯ': 'ya', 'ರ': 'ra', 'ಲ': 'la', 'ವ': 'va', 'ಶ': 'sha',
      'ಷ': 'Sha', 'ಸ': 'sa', 'ಹ': 'ha', 'ಳ': 'La', 'ೞ': 'zha'
    };

    let result = '';
    for (let char of kannadaWord) {
      result += mapping[char] || char;
    }
    return result;
  };

  const playPronunciation = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'kn-IN';
      utterance.rate = 0.8;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  if (!word) return null;

  const dictEntry = getDictionary(word);

  return (
    <div className="bg-white rounded-xl shadow-xl border p-6 sticky top-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-kannada-orange" />
          <h3 className="text-lg font-semibold text-gray-800">Dictionary</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-3xl kannada-text font-medium text-gray-900 mb-2">
            {word}
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
              {dictEntry.romanization}
            </span>
            <button
              onClick={playPronunciation}
              disabled={isPlaying}
              className="btn-secondary flex items-center space-x-1 text-sm"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlaying ? 'Playing...' : 'Pronounce'}</span>
            </button>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">
            {dictEntry.wordType}
          </div>
          <div className="text-gray-800 leading-relaxed">
            {dictEntry.definition}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DictionaryPanel;