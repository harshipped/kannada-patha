import { useState, useEffect, useCallback, useRef } from 'react';
import { generateFallbackRomanization } from '../utils/kannadaMorphology.js';

// Dictionary hook optimized for Netlify deployment
export const useDictionary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const dbRef = useRef(null);
  const SQLRef = useRef(null);

  // Initialize SQLite database
  const initializeDatabase = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load sql.js from CDN
      let initSqlJs;
      try {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
        
        initSqlJs = window.initSqlJs;
        
        if (!initSqlJs) {
          throw new Error('sql.js failed to load from CDN');
        }
      } catch (cdnError) {
        console.warn('CDN loading failed:', cdnError);
        throw new Error(`Failed to load SQL.js: ${cdnError.message}`);
      }

      // Initialize SQL.js with WASM
      const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });
      
      SQLRef.current = SQL;

      // Load the database file
      console.log('Loading Kannada dictionary database...');
      const response = await fetch('/kannada-dictionary.db');
      
      if (!response.ok) {
        throw new Error(`Failed to load database: ${response.status} ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const db = new SQL.Database(new Uint8Array(buffer));
      
      dbRef.current = db;

      // Test database connection
      try {
        const testQuery = db.prepare('SELECT COUNT(*) as count FROM dictionary');
        testQuery.step();
        const result = testQuery.getAsObject();
        testQuery.free();

        console.log(`Dictionary loaded: ${result.count} words available`);
        
        // Test definitions table
        const defQuery = db.prepare('SELECT COUNT(*) as count FROM definitions');
        defQuery.step();
        const defResult = defQuery.getAsObject();
        defQuery.free();
        console.log(`Definitions available: ${defResult.count}`);
        
      } catch (testError) {
        console.error('Database test failed:', testError);
        throw new Error(`Database structure issue: ${testError.message}`);
      }
      
      setIsReady(true);
      setIsLoading(false);

    } catch (err) {
      console.error('Database initialization failed:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  // Simplified word lookup - exact match or Netlify function fallback
  const lookupWord = useCallback(async (word) => {
    if (!word) return null;

    // Clean word for lookup
    const cleanWord = word.replace(/[.!?।०,;:\s]+/g, '').trim();
    if (!cleanWord) return null;

    // 1. Try exact match first
    const exactMatch = await exactLookup(cleanWord);
    if (exactMatch) {
      return {
        ...exactMatch,
        matchType: 'exact',
        originalWord: word
      };
    }

    // 2. If no exact match, use Netlify function for translation
    console.log(`No dictionary match for "${cleanWord}", trying Netlify translation function...`);
    const fallbackResult = await getFallbackTranslation(cleanWord);
    
    return {
      matchType: 'fallback',
      originalWord: word,
      entry: cleanWord,
      romanization: generateFallbackRomanization(cleanWord),
      definition: fallbackResult.definition,
      wordType: 'translation',
      source: fallbackResult.source,
      sourceType: fallbackResult.sourceType,
      confidence: fallbackResult.confidence,
      phone: generateFallbackRomanization(cleanWord) // For pronunciation
    };

  }, [isReady]);

  // Exact database lookup with better error handling
  const exactLookup = useCallback(async (word) => {
    if (!isReady || !dbRef.current || !word) return null;

    try {
      const stmt = dbRef.current.prepare(`
        SELECT 
          d.id, 
          d.entry, 
          d.phone,
          d.head,
          def.entry as definition, 
          def.type
        FROM dictionary d
        LEFT JOIN definitions def ON d.id = def.dictionary_id
        WHERE d.entry = ? COLLATE NOCASE
        ORDER BY def.id
      `);
      
      stmt.bind([word.trim()]);
      
      const definitions = [];
      let wordInfo = null;
      
      while (stmt.step()) {
        const row = stmt.getAsObject();
        
        if (!wordInfo) {
          wordInfo = {
            entry: row.entry,
            phone: row.phone,
            head: row.head
          };
        }
        
        if (row.definition) {
          definitions.push({
            definition: row.definition,
            type: row.type || 'unknown'
          });
        }
      }
      
      stmt.free();

      if (!wordInfo || definitions.length === 0) return null;

      return {
        entry: wordInfo.entry,
        romanization: wordInfo.phone || generateFallbackRomanization(word),
        wordType: definitions[0]?.type || 'unknown',
        definition: definitions[0]?.definition || 'No definition available',
        alternateDefinitions: definitions.length > 1 ? definitions.slice(1) : null,
        totalDefinitions: definitions.length
      };

    } catch (err) {
      console.error('Exact lookup failed:', err);
      return null;
    }
  }, [isReady]);

  // Use Netlify function for translation with fallback to direct APIs
  const getFallbackTranslation = useCallback(async (word) => {
    try {
      // First, try the Netlify function
      const netlifyResponse = await fetch('/.netlify/functions/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: word,
          // Don't specify service to use fallback strategy
        }),
        signal: AbortSignal.timeout(15000) // 15 second timeout for serverless function
      });

      if (netlifyResponse.ok) {
        const data = await netlifyResponse.json();
        if (data.definition && 
            data.definition !== 'Translation not available' && 
            data.definition !== word &&
            data.definition.toLowerCase() !== 'null') {
          return {
            definition: data.definition,
            confidence: data.confidence || 0.7,
            source: data.source || 'Netlify Translation Function',
            sourceType: data.sourceType || 'netlify'
          };
        }
      } else {
        console.warn('Netlify function failed:', netlifyResponse.status, netlifyResponse.statusText);
      }
    } catch (error) {
      console.warn('Netlify function failed:', error);
    }

    // Fallback to direct API calls if Netlify function fails
    console.log('Netlify function failed, trying direct API calls...');

    try {
      // Try MyMemory directly as backup
      const myMemoryResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=kn|en`,
        { 
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'KannadaReader/1.0'
          },
          signal: AbortSignal.timeout(8000)
        }
      );
      
      if (myMemoryResponse.ok) {
        const data = await myMemoryResponse.json();
        if (data.responseData && 
            data.responseData.translatedText && 
            data.responseData.translatedText !== word &&
            data.responseData.translatedText.toLowerCase() !== 'null') {
          return {
            definition: data.responseData.translatedText,
            confidence: data.responseData.match || 0.7,
            source: 'MyMemory (Direct)',
            sourceType: 'mymemory-direct'
          };
        }
      }
    } catch (error) {
      console.warn('Direct MyMemory API also failed:', error);
    }

    return {
      definition: 'Translation not available',
      confidence: 0,
      source: 'Local fallback',
      sourceType: 'none'
    };
  }, []);

  // Enhanced text-to-speech with better voice selection
  const speakWord = useCallback(async (word, romanization) => {
    if (!('speechSynthesis' in window)) {
      throw new Error('Text-to-speech not supported');
    }

    // Stop any ongoing speech
    speechSynthesis.cancel();

    return new Promise((resolve, reject) => {
      const voices = speechSynthesis.getVoices();
      
      // Priority order for voice selection
      let selectedVoice = null;
      const voicePriority = [
        v => v.lang === 'kn-IN' || v.lang === 'kn',
        v => v.lang.startsWith('hi-') && v.name.includes('Indian'),
        v => v.lang.startsWith('en-IN'),
        v => v.lang.startsWith('en-') && v.name.includes('Google'),
        v => v.default
      ];

      for (const criteria of voicePriority) {
        selectedVoice = voices.find(criteria);
        if (selectedVoice) break;
      }

      // Use romanization for better pronunciation if available
      const textToSpeak = (romanization && romanization !== word) ? romanization : word;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Optimize speech settings
      utterance.lang = selectedVoice?.lang || 'kn-IN';
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      let hasResolved = false;
      
      utterance.onend = () => {
        if (!hasResolved) {
          hasResolved = true;
          resolve();
        }
      };
      
      utterance.onerror = (error) => {
        if (!hasResolved) {
          hasResolved = true;
          console.warn('TTS failed:', error);
          reject(new Error('Speech synthesis failed'));
        }
      };

      // Fallback timeout
      setTimeout(() => {
        if (!hasResolved) {
          hasResolved = true;
          speechSynthesis.cancel();
          resolve();
        }
      }, 10000);
      
      speechSynthesis.speak(utterance);
    });
  }, []);

  // Database statistics with caching
  const getStats = useCallback(async () => {
    if (!isReady || !dbRef.current) return null;

    try {
      const stats = {};
      
      // Word count
      const wordQuery = dbRef.current.prepare('SELECT COUNT(*) as count FROM dictionary');
      wordQuery.step();
      stats.totalWords = wordQuery.getAsObject().count;
      wordQuery.free();
      
      // Definition count
      const defQuery = dbRef.current.prepare('SELECT COUNT(*) as count FROM definitions');
      defQuery.step();
      stats.totalDefinitions = defQuery.getAsObject().count;
      defQuery.free();
      
      // Word types distribution
      const typeQuery = dbRef.current.prepare(`
        SELECT type, COUNT(*) as count 
        FROM definitions 
        WHERE type IS NOT NULL AND type != '' 
        GROUP BY type 
        ORDER BY count DESC 
        LIMIT 10
      `);
      
      const wordTypes = [];
      while (typeQuery.step()) {
        const row = typeQuery.getAsObject();
        wordTypes.push({ type: row.type, count: row.count });
      }
      typeQuery.free();
      stats.wordTypes = wordTypes;
      
      // Database size info
      const sizeQuery = dbRef.current.prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()');
      sizeQuery.step();
      stats.databaseSize = sizeQuery.getAsObject().size;
      sizeQuery.free();
      
      return stats;
    } catch (err) {
      console.error('Stats query failed:', err);
      return null;
    }
  }, [isReady]);

  // Initialize on mount with better error handling
  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      if (!mounted) return;
      await initializeDatabase();
    };
    
    init();

    // Load voices for TTS
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        if (!mounted) return;
        const voices = speechSynthesis.getVoices();
        console.log('Available TTS voices:', voices
          .filter(v => v.lang.startsWith('kn') || v.lang.startsWith('hi') || v.lang.startsWith('en'))
          .map(v => ({ name: v.name, lang: v.lang }))
        );
      };
      
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
      loadVoices();
      
      return () => {
        mounted = false;
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        speechSynthesis.cancel();
      };
    }

    // Cleanup on unmount
    return () => {
      mounted = false;
      if (dbRef.current) {
        try {
          dbRef.current.close();
        } catch (e) {
          console.warn('Database cleanup error:', e);
        }
      }
    };
  }, [initializeDatabase]);

  return {
    isLoading,
    isReady,
    error,
    lookupWord,
    speakWord,
    getStats,
    retry: initializeDatabase
  };
};

export default useDictionary;