// Enhanced Kannada Morphological Analysis Module
// Handles compound words, grammatical inflections, and complex word forms

// Comprehensive morphological rules for Kannada with better pattern matching
export const kannadaMorphologyRules = {
  // Complex verb conjugation patterns (ordered by specificity)
  verbs: [
    // Complex passive and causative forms
    { 
      suffix: 'ಇಸಲಾಗುತ್ತಿದೆ', 
      remove: 'ಇಸಲಾಗುತ್ತಿದೆ', 
      add: '', 
      info: 'causative passive continuous present',
      priority: 10
    },
    { 
      suffix: 'ಯಲಾಗುತ್ತಿದೆ', 
      remove: 'ಯಲಾಗುತ್ತಿದೆ', 
      add: '', 
      info: 'passive continuous present',
      priority: 9
    },
    { 
      suffix: 'ಯಲಾಗುತ್ತದೆ', 
      remove: 'ಯಲಾಗುತ್ತದೆ', 
      add: '', 
      info: 'passive voice, present tense, 3rd person neuter',
      example: 'ಕರೆಯಲಾಗುತ್ತದೆ → ಕರೆ (to call)',
      priority: 8
    },
    { 
      suffix: 'ಯಲಾಗುತ್ತಾರೆ', 
      remove: 'ಯಲಾಗುತ್ತಾರೆ', 
      add: '', 
      info: 'passive voice, present tense, 3rd person honorific',
      priority: 8
    },
    { 
      suffix: 'ಯಲಾಗಿದೆ', 
      remove: 'ಯಲಾಗಿದೆ', 
      add: '', 
      info: 'passive voice, present perfect, 3rd person',
      priority: 7
    },
    
    // Causative forms
    { 
      suffix: 'ಇಸುತ್ತಿದ್ದಾರೆ', 
      remove: 'ಇಸುತ್ತಿದ್ದಾರೆ', 
      add: '', 
      info: 'causative continuous past, honorific',
      priority: 8
    },
    { 
      suffix: 'ಇಸಿದ್ದಾರೆ', 
      remove: 'ಇಸಿದ್ದಾರೆ', 
      add: '', 
      info: 'causative perfect past, honorific',
      priority: 7
    },
    { 
      suffix: 'ಇಸುತ್ತಾರೆ', 
      remove: 'ಇಸುತ್ತಾರೆ', 
      add: '', 
      info: 'causative present, honorific',
      priority: 6
    },
    { 
      suffix: 'ಇಸುತ್ತದೆ', 
      remove: 'ಇಸುತ್ತದೆ', 
      add: '', 
      info: 'causative present, 3rd person',
      priority: 6
    },
    { 
      suffix: 'ಇಸಿದನು', 
      remove: 'ಇಸಿದನು', 
      add: '', 
      info: 'causative past, masculine',
      priority: 5
    },
    
    // Complex continuous forms
    { 
      suffix: 'ುತ್ತಿದ್ದಾರೆ', 
      remove: 'ುತ್ತಿದ್ದಾರೆ', 
      add: '', 
      info: 'continuous past, honorific',
      priority: 7
    },
    { 
      suffix: 'ುತ್ತಿದ್ದಳು', 
      remove: 'ುತ್ತಿದ್ದಳು', 
      add: '', 
      info: 'continuous past, feminine',
      priority: 6
    },
    { 
      suffix: 'ುತ್ತಿದ್ದನು', 
      remove: 'ುತ್ತಿದ್ದನು', 
      add: '', 
      info: 'continuous past, masculine',
      priority: 6
    },
    
    // Present tense patterns
    { 
      suffix: 'ುತ್ತಿದ್ದೇನೆ', 
      remove: 'ುತ್ತಿದ್ದೇನೆ', 
      add: '', 
      info: 'continuous present, 1st person',
      priority: 6
    },
    { 
      suffix: 'ುತ್ತೀನಿ', 
      remove: 'ುತ್ತೀನಿ', 
      add: '', 
      info: 'present tense, 1st person',
      priority: 5
    },
    { 
      suffix: 'ುತ್ತೀಯ', 
      remove: 'ುತ್ತೀಯ', 
      add: '', 
      info: 'present tense, 2nd person',
      priority: 5
    },
    { 
      suffix: 'ುತ್ತಾರೆ', 
      remove: 'ುತ್ತಾರೆ', 
      add: '', 
      info: 'present tense, 3rd person honorific/plural',
      priority: 5
    },
    { 
      suffix: 'ುತ್ತದೆ', 
      remove: 'ುತ್ತದೆ', 
      add: '', 
      info: 'present tense, 3rd person neuter',
      priority: 4
    },
    { 
      suffix: 'ುತ್ತಾನೆ', 
      remove: 'ುತ್ತಾನೆ', 
      add: '', 
      info: 'present tense, 3rd person masculine',
      priority: 4
    },
    { 
      suffix: 'ುತ್ತಾಳೆ', 
      remove: 'ುತ್ತಾಳೆ', 
      add: '', 
      info: 'present tense, 3rd person feminine',
      priority: 4
    },
    
    // Past tense patterns
    { 
      suffix: 'ಿದ್ದಾರೆ', 
      remove: 'ಿದ್ದಾರೆ', 
      add: '', 
      info: 'past perfect, honorific',
      priority: 5
    },
    { 
      suffix: 'ಿದ್ದೇನೆ', 
      remove: 'ಿದ್ದೇನೆ', 
      add: '', 
      info: 'past tense, 1st person',
      priority: 5
    },
    { 
      suffix: 'ಿದ್ದೀಯ', 
      remove: 'ಿದ್ದೀಯ', 
      add: '', 
      info: 'past tense, 2nd person',
      priority: 5
    },
    { 
      suffix: 'ಿದ್ದರು', 
      remove: 'ಿದ್ದರು', 
      add: '', 
      info: 'past tense, 3rd person honorific/plural',
      priority: 4
    },
    { 
      suffix: 'ಿದ್ದನು', 
      remove: 'ಿದ್ದನು', 
      add: '', 
      info: 'past tense, 3rd person masculine',
      priority: 3
    },
    { 
      suffix: 'ಿದ್ದಳು', 
      remove: 'ಿದ್ದಳು', 
      add: '', 
      info: 'past tense, 3rd person feminine',
      priority: 3
    },
    { 
      suffix: 'ಿತು', 
      remove: 'ಿತು', 
      add: '', 
      info: 'past tense, 3rd person neuter',
      priority: 3
    },
    
    // Negative forms
    { 
      suffix: 'ುವುದಿಲ್ಲ', 
      remove: 'ುವುದಿಲ್ಲ', 
      add: '', 
      info: 'negative present tense',
      priority: 5
    },
    { 
      suffix: 'ಲಿಲ್ಲ', 
      remove: 'ಲಿಲ್ಲ', 
      add: '', 
      info: 'negative past tense',
      priority: 3
    },
    { 
      suffix: 'ಬಾರದು', 
      remove: 'ಬಾರದು', 
      add: '', 
      info: 'negative possibility',
      priority: 4
    },
    
    // Conditional and subjunctive
    { 
      suffix: 'ಿದ್ದರೆ', 
      remove: 'ಿದ್ದರೆ', 
      add: '', 
      info: 'conditional past',
      priority: 4
    },
    { 
      suffix: 'ಬೇಕು', 
      remove: 'ಬೇಕು', 
      add: '', 
      info: 'necessity/want',
      priority: 3
    },
    { 
      suffix: 'ಬಹುದು', 
      remove: 'ಬಹುದು', 
      add: '', 
      info: 'possibility/may',
      priority: 3
    }
  ],

  // Enhanced noun case patterns
  nouns: [
    // Complex locative cases
    { 
      suffix: 'ಯೊಳಗಿನಲ್ಲಿ', 
      remove: 'ಯೊಳಗಿನಲ್ಲಿ', 
      add: '', 
      info: 'complex locative (inside of)',
      priority: 8
    },
    { 
      suffix: 'ಅವರ ಮನೆಯಲ್ಲಿ', 
      remove: 'ಅವರ ಮನೆಯಲ್ಲಿ', 
      add: '', 
      info: 'complex possessive locative',
      priority: 7
    },
    { 
      suffix: 'ಗಳಲ್ಲಿ', 
      remove: 'ಗಳಲ್ಲಿ', 
      add: '', 
      info: 'plural locative',
      priority: 6
    },
    { 
      suffix: 'ಯಲ್ಲಿ', 
      remove: 'ಯಲ್ಲಿ', 
      add: '', 
      info: 'locative case (in/at)',
      priority: 4
    },
    { 
      suffix: 'ಅಲ್ಲಿ', 
      remove: 'ಅಲ್ಲಿ', 
      add: '', 
      info: 'locative case (there/at that place)',
      priority: 3
    },
    { 
      suffix: 'ೊಳಗೆ', 
      remove: 'ೊಳಗೆ', 
      add: '', 
      info: 'locative case (inside)',
      priority: 4
    },
    { 
      suffix: 'ಮೇಲೆ', 
      remove: 'ಮೇಲೆ', 
      add: '', 
      info: 'locative case (on/above)',
      priority: 4
    },
    
    // Complex dative cases
    { 
      suffix: 'ಅವರಿಗೆ', 
      remove: 'ಅವರಿಗೆ', 
      add: '', 
      info: 'dative case, honorific (to them)',
      priority: 5
    },
    { 
      suffix: 'ಗಳಿಗೆ', 
      remove: 'ಗಳಿಗೆ', 
      add: '', 
      info: 'plural dative case',
      priority: 5
    },
    { 
      suffix: 'ಇಗೆ', 
      remove: 'ಇಗೆ', 
      add: '', 
      info: 'dative case (to/for)',
      priority: 3
    },
    { 
      suffix: 'ಗೆ', 
      remove: 'ಗೆ', 
      add: '', 
      info: 'dative case (to/for)',
      priority: 2
    },
    
    // Complex ablative cases
    { 
      suffix: 'ಗಳಿಂದ', 
      remove: 'ಗಳಿಂದ', 
      add: '', 
      info: 'plural ablative case',
      priority: 5
    },
    { 
      suffix: 'ಇಂದ', 
      remove: 'ಇಂದ', 
      add: '', 
      info: 'ablative case (from)',
      priority: 3
    },
    { 
      suffix: 'ನಿಂದ', 
      remove: 'ನಿಂದ', 
      add: '', 
      info: 'ablative case (from)',
      priority: 3
    },
    
    // Complex genitive cases
    { 
      suffix: 'ಅವರ', 
      remove: 'ಅವರ', 
      add: '', 
      info: 'genitive case, honorific (their)',
      priority: 4
    },
    { 
      suffix: 'ಗಳ', 
      remove: 'ಗಳ', 
      add: '', 
      info: 'plural genitive case',
      priority: 4
    },
    { 
      suffix: 'ಇನ', 
      remove: 'ಇನ', 
      add: '', 
      info: 'genitive case (of/possessive)',
      priority: 3
    },
    { 
      suffix: 'ಅ', 
      remove: 'ಅ', 
      add: '', 
      info: 'genitive case (of/possessive)',
      priority: 1
    },
    
    // Instrumental and associative cases
    { 
      suffix: 'ಗಳೊಂದಿಗೆ', 
      remove: 'ಗಳೊಂದಿಗೆ', 
      add: '', 
      info: 'plural associative case (together with)',
      priority: 7
    },
    { 
      suffix: 'ಯೊಂದಿಗೆ', 
      remove: 'ಯೊಂದಿಗೆ', 
      add: '', 
      info: 'associative case (together with)',
      priority: 5
    },
    { 
      suffix: 'ೊಂದಿಗೆ', 
      remove: 'ೊಂದಿಗೆ', 
      add: '', 
      info: 'associative case (with)',
      priority: 4
    },
    
    // Plural forms
    { 
      suffix: 'ಅವರು', 
      remove: 'ಅವರು', 
      add: '', 
      info: 'honorific plural (they)',
      priority: 4
    },
    { 
      suffix: 'ಗಳು', 
      remove: 'ಗಳು', 
      add: '', 
      info: 'plural form',
      priority: 3
    },
    { 
      suffix: 'ರು', 
      remove: 'ರು', 
      add: '', 
      info: 'plural form (people)',
      priority: 2
    }
  ],

  // Enhanced adjective and adverbial patterns
  adjectives: [
    { 
      suffix: 'ಾದಂತಹ', 
      remove: 'ಾದಂತಹ', 
      add: '', 
      info: 'comparative adjectival (like that which)',
      priority: 5
    },
    { 
      suffix: 'ಆದ', 
      remove: 'ಆದ', 
      add: '', 
      info: 'past participle adjective',
      priority: 3
    },
    { 
      suffix: 'ುವ', 
      remove: 'ುವ', 
      add: '', 
      info: 'present participle adjective',
      priority: 3
    },
    { 
      suffix: 'ಿದ', 
      remove: 'ಿದ', 
      add: '', 
      info: 'past participle (done)',
      priority: 2
    }
  ],

  // Compound and complex word patterns
  compounds: [
    { 
      suffix: 'ಆಗಿರುವ', 
      remove: 'ಆಗಿರುವ', 
      add: '', 
      info: 'being/existing as (present participle)',
      priority: 5
    },
    { 
      suffix: 'ಆಗಿದ್ದ', 
      remove: 'ಆಗಿದ್ದ', 
      add: '', 
      info: 'having been (past participle)',
      priority: 4
    },
    { 
      suffix: 'ಆಗಿ', 
      remove: 'ಆಗಿ', 
      add: '', 
      info: 'becoming/as (adverbial)',
      priority: 3
    },
    { 
      suffix: 'ೇಕೆಂದರೆ', 
      remove: 'ೇಕೆಂದರೆ', 
      add: '', 
      info: 'because (causal)',
      priority: 6
    },
    { 
      suffix: 'ೇಕೆ', 
      remove: 'ೇಕೆ', 
      add: '', 
      info: 'why? (interrogative)',
      priority: 3
    }
  ]
};

// Enhanced morphological analyzer with priority-based matching
export const findWordStem = (word) => {
  if (!word || word.length < 2) {
    return { stem: word, grammaticalInfo: [], confidence: 0 };
  }

  // Collect all possible matches with their priorities
  const allRules = [
    ...kannadaMorphologyRules.verbs.map(r => ({...r, category: 'verb'})),
    ...kannadaMorphologyRules.nouns.map(r => ({...r, category: 'noun'})),
    ...kannadaMorphologyRules.adjectives.map(r => ({...r, category: 'adjective'})),
    ...kannadaMorphologyRules.compounds.map(r => ({...r, category: 'compound'}))
  ];

  // Sort rules by priority (highest first), then by suffix length
  allRules.sort((a, b) => {
    const priorityDiff = (b.priority || 0) - (a.priority || 0);
    if (priorityDiff !== 0) return priorityDiff;
    return b.suffix.length - a.suffix.length;
  });

  const matches = [];

  // Find all matching rules
  for (const rule of allRules) {
    if (word.endsWith(rule.suffix)) {
      const stem = word.substring(0, word.length - rule.suffix.length) + rule.add;
      
      // Validate stem (should be meaningful length)
      if (stem.length >= 1 && stem !== word) {
        const confidence = calculateConfidence(word, rule, stem);
        matches.push({
          stem: stem,
          rule: rule,
          confidence: confidence,
          grammaticalInfo: [rule.info],
          matchedSuffix: rule.suffix,
          category: rule.category
        });
      }
    }
  }

  // Return the best match
  if (matches.length > 0) {
    const bestMatch = matches[0];
    return {
      stem: bestMatch.stem,
      grammaticalInfo: bestMatch.grammaticalInfo,
      rule: bestMatch.rule,
      matchedSuffix: bestMatch.matchedSuffix,
      category: bestMatch.category,
      confidence: bestMatch.confidence,
      alternativeMatches: matches.slice(1, 3) // Keep top 3 alternatives
    };
  }

  // Fallback: try common vowel endings
  const vowelSuffixes = ['ು', 'ೆ', 'ೇ', 'ೈ', 'ೊ', 'ೋ', 'ಾ', 'ಿ', 'ೀ', 'ೂ'];
  
  for (const suffix of vowelSuffixes) {
    if (word.endsWith(suffix) && word.length > suffix.length + 1) {
      const stem = word.substring(0, word.length - suffix.length);
      return {
        stem: stem,
        grammaticalInfo: ['basic inflection'],
        rule: { suffix, info: 'vowel modification', category: 'basic' },
        matchedSuffix: suffix,
        category: 'basic',
        confidence: 0.3
      };
    }
  }

  return { 
    stem: word, 
    grammaticalInfo: [], 
    confidence: 0,
    category: 'unknown'
  };
};

// Calculate confidence score for morphological analysis
const calculateConfidence = (originalWord, rule, stem) => {
  let confidence = rule.priority || 1;
  
  // Boost confidence for longer suffixes (more specific)
  confidence += rule.suffix.length * 0.1;
  
  // Boost confidence if stem is reasonable length
  if (stem.length >= 2) confidence += 0.2;
  if (stem.length >= 3) confidence += 0.2;
  
  // Penalize if stem is too short
  if (stem.length < 2) confidence -= 0.3;
  
  // Penalize very long suffixes compared to word length
  if (rule.suffix.length > originalWord.length * 0.7) confidence -= 0.2;
  
  return Math.max(0, Math.min(1, confidence / 10));
};

// Enhanced romanization with better character mapping and consonant clusters
// Enhanced romanization with proper halanta and vowel mark handling
export const generateFallbackRomanization = (kannadaWord) => {
  const consonantMap = {
    'ಕ': 'k', 'ಖ': 'kh', 'ಗ': 'g', 'ಘ': 'gh', 'ಙ': 'ng',
    'ಚ': 'ch', 'ಛ': 'chh', 'ಜ': 'j', 'ಝ': 'jh', 'ಞ': 'nj',
    'ಟ': 'T', 'ಠ': 'Th', 'ಡ': 'D', 'ಢ': 'Dh', 'ಣ': 'N',
    'ತ': 't', 'ಥ': 'th', 'ದ': 'd', 'ಧ': 'dh', 'ನ': 'n',
    'ಪ': 'p', 'ಫ': 'ph', 'ಬ': 'b', 'ಭ': 'bh', 'ಮ': 'm',
    'ಯ': 'y', 'ರ': 'r', 'ಲ': 'l', 'ವ': 'v',
    'ಶ': 'sh', 'ಷ': 'Sh', 'ಸ': 's', 'ಹ': 'h',
    'ಳ': 'L', 'ೞ': 'zh', 'ೱ': 'f'
  };

  const vowelMap = {
    'ಅ': 'a', 'ಆ': 'aa', 'ಇ': 'i', 'ಈ': 'ii', 'ಉ': 'u', 'ಊ': 'uu',
    'ಋ': 'ru', 'ೠ': 'ruu', 'ಌ': 'lu', 'ೡ': 'luu',
    'ಎ': 'e', 'ಏ': 'ee', 'ಐ': 'ai', 'ಒ': 'o', 'ಓ': 'oo', 'ಔ': 'au'
  };

  const vowelSignMap = {
    'ಾ': 'aa', 'ಿ': 'i', 'ೀ': 'ii', 'ು': 'u', 'ೂ': 'uu',
    'ೃ': 'ru', 'ೄ': 'ruu', 'ೆ': 'e', 'ೇ': 'ee', 'ೈ': 'ai',
    'ೊ': 'o', 'ೋ': 'oo', 'ೌ': 'au', 'ೢ': 'lu', 'ೣ': 'luu'
  };

  const specialChars = {
    'ಂ': 'm', 'ಃ': 'h', '಼': '', // nukta
    '್': '', // halanta/virama
    '೦': '0', '೧': '1', '೨': '2', '೩': '3', '೪': '4',
    '೫': '5', '೬': '6', '೭': '7', '೮': '8', '೯': '9'
  };

  // Normalize the input to handle different Unicode forms
  const normalizedWord = kannadaWord.normalize('NFC');
  let result = '';
  let i = 0;

  while (i < normalizedWord.length) {
    const char = normalizedWord[i];
    const nextChar = normalizedWord[i + 1];
    const prevChar = i > 0 ? normalizedWord[i - 1] : null;

    // Handle standalone vowels
    if (vowelMap[char]) {
      result += vowelMap[char];
      i++;
      continue;
    }

    // Handle consonants
    if (consonantMap[char]) {
      let consonantSound = consonantMap[char];
      let addInherentVowel = true;

      // Check if next character is halanta (್)
      if (nextChar === '್') {
        addInherentVowel = false;
        i++; // Skip the halanta in next iteration
      }
      // Check if next character is a vowel sign
      else if (vowelSignMap[nextChar]) {
        consonantSound += vowelSignMap[nextChar];
        addInherentVowel = false;
        i++; // Skip the vowel sign in next iteration
      }
      // Check if next character is anusvara or visarga
      else if (nextChar === 'ಂ' || nextChar === 'ಃ') {
        // Keep inherent vowel, handle special char in next iteration
      }
      // Check if we're at the end of word or next char is non-Kannada
      else if (i === normalizedWord.length - 1 || 
               (!consonantMap[nextChar] && !vowelMap[nextChar] && 
                !vowelSignMap[nextChar] && !specialChars[nextChar])) {
        // At word boundary - handle common endings
        const remainingWord = normalizedWord.substring(i);
        if (remainingWord === 'ನ್' || remainingWord === 'ಮ್' || 
            remainingWord === 'ರ್' || remainingWord === 'ಲ್') {
          addInherentVowel = false;
        }
      }

      result += consonantSound;
      
      // Add inherent vowel 'a' only if needed
      if (addInherentVowel) {
        result += 'a';
      }

      i++;
      continue;
    }

    // Handle vowel signs (shouldn't occur alone, but just in case)
    if (vowelSignMap[char]) {
      result += vowelSignMap[char];
      i++;
      continue;
    }

    // Handle special characters
    if (specialChars[char]) {
      const specialSound = specialChars[char];
      if (specialSound) {
        result += specialSound;
      }
      i++;
      continue;
    }

    // Handle halanta specially - remove trailing 'a' from previous consonant
    if (char === '್') {
      if (result.endsWith('a')) {
        result = result.slice(0, -1);
      }
      i++;
      continue;
    }

    // Handle unknown characters (pass through)
    result += char;
    i++;
  }

  // Post-processing cleanup
  result = result
    // Fix common double consonant patterns
    .replace(/([kgcjTDtdpbmnrlvshSL])a([kgcjTDtdpbmnrlvshSL])/g, '$1$2')
    // Clean up multiple consecutive vowels
    .replace(/aa+/g, 'aa')
    .replace(/ii+/g, 'ii')
    .replace(/uu+/g, 'uu')
    .replace(/ee+/g, 'ee')
    .replace(/oo+/g, 'oo')
    // Fix specific common patterns
    .replace(/alli$/, 'alli') // Ensure proper ending for locative case
    .replace(/inda$/, 'inda') // Ensure proper ending for ablative case
    .replace(/ige$/, 'ige')   // Ensure proper ending for dative case
    // Remove any trailing 'a' that might be incorrect for final consonants
    .replace(/([kgcjTDtdpbmnrlvshSL])a$/, '$1');

  return result || kannadaWord; // Fallback to original if processing fails
};

// Enhanced grammar explanation system
export const getGrammarExplanation = (grammaticalInfo) => {
  const explanations = {
    // Verb forms
    'passive voice, present tense, 3rd person neuter': 'Action is being done to the subject (it is being done)',
    'causative passive continuous present': 'Someone is causing the action to be done continuously',
    'passive continuous present': 'Action is continuously being done',
    'causative present, honorific': 'Making someone do the action (respectful form)',
    'causative continuous past, honorific': 'Was making someone do the action (respectful)',
    'continuous past, honorific': 'Was doing the action continuously (respectful form)',
    'negative present tense': 'Action is not happening now',
    'conditional past': 'If the action had happened in the past',
    'necessity/want': 'Need to do or want to do the action',
    'possibility/may': 'Might or could do the action',
    
    // Noun cases
    'locative case (in/at)': 'Shows location - where something is happening',
    'locative case (on/above)': 'Shows position - on top of something',
    'locative case (inside)': 'Shows position - inside something',
    'plural locative': 'Location involving multiple items',
    'dative case (to/for)': 'Shows direction or beneficiary - to whom or for what',
    'plural dative case': 'Direction or benefit involving multiple recipients',
    'ablative case (from)': 'Shows origin or source - from where something comes',
    'plural ablative case': 'Origin involving multiple sources',
    'genitive case (of/possessive)': 'Shows ownership or relationship',
    'plural genitive case': 'Possession involving multiple owners',
    'associative case (with)': 'Shows companionship or accompaniment',
    'honorific plural (they)': 'Respectful way to refer to multiple people',
    
    // Adjectives and participles
    'past participle adjective': 'Describes something based on a completed action',
    'present participle adjective': 'Describes something based on an ongoing action',
    'comparative adjectival (like that which)': 'Comparing to something similar',
    
    // Complex forms
    'being/existing as (present participle)': 'Currently in the state of being',
    'having been (past participle)': 'Previously was in that state',
    'because (causal)': 'Shows the reason why something happens',
    'basic inflection': 'Simple grammatical change to the word',
    
    // Fallbacks
    'basic vowel suffix': 'Simple vowel ending modification',
    'possible inflected form': 'Word may have grammatical modifications'
  };

  return grammaticalInfo.map(info => ({
    term: info,
    explanation: explanations[info] || 'Grammatical modification of the word',
    category: categorizeGrammaticalInfo(info)
  }));
};

// Categorize grammatical information for better UI organization
const categorizeGrammaticalInfo = (info) => {
  if (info.includes('tense') || info.includes('passive') || info.includes('causative')) {
    return 'verb';
  }
  if (info.includes('case') || info.includes('plural') || info.includes('genitive')) {
    return 'noun';
  }
  if (info.includes('adjective') || info.includes('participle')) {
    return 'adjective';
  }
  if (info.includes('adverbial') || info.includes('because') || info.includes('why')) {
    return 'adverb';
  }
  return 'other';
};

// Utility function to clean words for lookup
export const cleanWordForLookup = (word) => {
  // Remove punctuation and whitespace, but preserve Kannada characters
  return word.replace(/[.!?೥೦,;:\s\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+/g, '').trim();
};

// Enhanced compound word analysis
export const analyzeCompound = (word) => {
  const stemResult = findWordStem(word);
  
  if (stemResult.stem !== word && stemResult.confidence > 0.3) {
    const components = [];
    
    // Add the root component
    components.push({
      text: stemResult.stem,
      type: 'root',
      meaning: 'Root word',
      category: 'stem'
    });
    
    // Add the suffix component with detailed explanation
    if (stemResult.matchedSuffix) {
      const grammarExplanation = getGrammarExplanation([stemResult.rule.info])[0];
      components.push({
        text: stemResult.matchedSuffix,
        type: 'suffix',
        meaning: stemResult.rule.info,
        explanation: grammarExplanation.explanation,
        category: stemResult.category
      });
    }
    
    return {
      isCompound: true,
      components: components,
      grammaticalInfo: stemResult.grammaticalInfo,
      confidence: stemResult.confidence,
      category: stemResult.category,
      alternatives: stemResult.alternativeMatches || []
    };
  }
  
  return {
    isCompound: false,
    components: [{ 
      text: word, 
      type: 'simple', 
      meaning: 'Simple word',
      category: 'simple'
    }],
    grammaticalInfo: [],
    confidence: 1.0,
    category: 'simple'
  };
};

// Advanced word similarity calculation for suggestions
export const calculateWordSimilarity = (word1, word2) => {
  const len1 = word1.length;
  const len2 = word2.length;
  
  // Create matrix for Levenshtein distance
  const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  
  // Fill the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = word1[i - 1] === word2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return maxLen === 0 ? 1 : 1 - (distance / maxLen);
};