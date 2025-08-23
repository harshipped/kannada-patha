// Updated Kannada Dictionary Data Layer with SQLite integration
import { useDictionary } from '../hooks/useDictionary.js';

// Export the hook for use in components
export { useDictionary };

// Fallback dictionary for development/testing
export const fallbackDictionary = {
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
  'ಊರಲ್ಲಿ': {
    romanization: 'ooralli',
    definition: 'In the village/town',
    wordType: 'noun (locative)'
  },
  'ಪ್ರೀತಿ': {
    romanization: 'preeti',
    definition: 'Love, affection',
    wordType: 'noun'
  },
  'ಪ್ರೀತಿಸುತ್ತಿದ್ದರು': {
    romanization: 'preetisuttiddaru',
    definition: 'They were loving/used to love',
    wordType: 'verb (past continuous)'
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
  'ಬಂದಿತು': {
    romanization: 'banditu',
    definition: 'Came (neuter past tense)',
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
  },
  'ಕಾಲದಲ್ಲಿ': {
    romanization: 'kaaladalli',
    definition: 'In the time/period',
    wordType: 'noun (locative)'
  },
  'ಕನಸು': {
    romanization: 'kanasu',
    definition: 'Dream',
    wordType: 'noun'
  },
  'ಮುದುಕ': {
    romanization: 'muduka',
    definition: 'Old man, elderly person',
    wordType: 'noun'
  },
  'ರಾಜ್ಯ': {
    romanization: 'raajya',
    definition: 'Kingdom, state',
    wordType: 'noun'
  },
  'ವಿಶೇಷ': {
    romanization: 'vishesha',
    definition: 'Special, particular',
    wordType: 'adjective'
  },
  'ಜನರಿಗೆ': {
    romanization: 'janarige',
    definition: 'For the people',
    wordType: 'noun (dative)'
  },
  'ಪ್ರಜೆಗಳು': {
    romanization: 'prajegaLu',
    definition: 'Subjects, citizens (plural)',
    wordType: 'noun (plural)'
  },
  'ನ್ಯಾಯಪ್ರಿಯನಾಗಿದ್ದನು': {
    romanization: 'nyaayapriyanaagiddanu',
    definition: 'He was justice-loving',
    wordType: 'verb (past tense)'
  }
};

// Fallback lookup function for when SQLite is not available
export const getFallbackDictionary = (word) => {
  return fallbackDictionary[word] || {
    romanization: transliterate(word),
    definition: 'Definition not found in dictionary',
    wordType: 'unknown'
  };
};

// Basic transliteration function (same as before)
export const transliterate = (kannadaWord) => {
  const mapping = {
    'ಅ': 'a', 'ಆ': 'aa', 'ಇ': 'i', 'ಈ': 'ee', 'ಉ': 'u', 'ಊ': 'oo',
    'ಎ': 'e', 'ಏ': 'ee', 'ಐ': 'ai', 'ಒ': 'o', 'ಓ': 'oo', 'ಔ': 'au',
    'ಕ': 'ka', 'ಖ': 'kha', 'ಗ': 'ga', 'ಘ': 'gha', 'ಙ': 'nga',
    'ಚ': 'cha', 'ಛ': 'chha', 'ಜ': 'ja', 'ಝ': 'jha', 'ಞ': 'nja',
    'ಟ': 'Ta', 'ಠ': 'Tha', 'ಡ': 'Da', 'ಢ': 'Dha', 'ಣ': 'Na',
    'ತ': 'ta', 'ಥ': 'tha', 'ದ': 'da', 'ಧ': 'dha', 'ನ': 'na',
    'ಪ': 'pa', 'ಫ': 'pha', 'ಬ': 'ba', 'ಭ': 'bha', 'ಮ': 'ma',
    'ಯ': 'ya', 'ರ': 'ra', 'ಲ': 'la', 'ವ': 'va', 'ಶ': 'sha',
    'ಷ': 'Sha', 'ಸ': 'sa', 'ಹ': 'ha', 'ಳ': 'La', 'ೞ': 'zha',
    'ಂ': 'm', 'ಃ': 'h', '್': '', 'ಾ': 'aa', 'ಿ': 'i', 'ೀ': 'ii',
    'ು': 'u', 'ೂ': 'uu', 'ೆ': 'e', 'ೇ': 'ee', 'ೈ': 'ai',
    'ೊ': 'o', 'ೋ': 'oo', 'ೌ': 'au'
  };

  let result = '';
  for (let char of kannadaWord) {
    result += mapping[char] || char;
  }
  return result;
};

// Utility function to clean words for lookup
export const cleanWordForLookup = (word) => {
  // Remove punctuation and whitespace
  return word.replace(/[.!?೥೦,;:]+$/, '').trim();
};

// Word processing utilities
export const processText = (text) => {
  // Split text into words while preserving punctuation and spacing
  return text.split(/(\s+|[.!?೥೦,;:])/);
};