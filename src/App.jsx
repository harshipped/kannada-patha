import React, { useState } from 'react';
import { BookOpen, Upload, FileText, Clipboard, Volume2, X, ArrowLeft, AlertCircle, Loader2, Info, Lightbulb, Zap } from 'lucide-react';
import { useDictionary } from './hooks/useDictionary.js';
import { cleanWordForLookup, analyzeCompound, getGrammarExplanation } from './utils/kannadaMorphology.js';

// Layout Component
const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #fff7ed, #fef2f2)' }}>
      <header className="card" style={{ margin: 0, borderRadius: 0, borderBottom: '2px solid #f97316', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <div className="header-container">
          <div className="header-title">
            <BookOpen className="icon-lg icon-orange" />
            <h1>
              ಕನ್ನಡ <span className="orange-text">ಪಾಠ</span>
            </h1>
          </div>
          <div className="header-subtitle">
            Interactive Kannada Literature Reader with Smart Word Analysis
          </div>
        </div>
      </header>
      
      <main className="main-container">
        {children}
      </main>
    </div>
  );
};

// Enhanced Loading Screen Component
const LoadingScreen = ({ error, onRetry, stats }) => {
  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <AlertCircle className="icon-xl" style={{ color: '#ef4444', margin: '0 auto 1rem' }} />
        <h2 style={{ color: '#374151', marginBottom: '1rem' }}>Dictionary Loading Failed</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
          {error}
        </p>
        <button onClick={onRetry} className="btn btn-primary">
          <span>Try Again</span>
        </button>
        <p style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.875rem' }}>
          You can still use the app with limited dictionary functionality
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
      <Loader2 className="icon-xl" style={{ color: '#f97316', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
      <h2 style={{ color: '#374151', marginBottom: '1rem' }}>Loading Dictionary</h2>
      <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
        Setting up your Kannada dictionary with morphological analysis...
      </p>
      {stats && (
        <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
          Loading {stats.totalWords?.toLocaleString()} words and {stats.totalDefinitions?.toLocaleString()} definitions
        </div>
      )}
    </div>
  );
};

// Text Input Component
const TextInput = ({ onTextSubmit }) => {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('paste');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onTextSubmit(inputText.trim());
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setInputText(text);
        onTextSubmit(text);
      };
      reader.readAsText(file);
    }
  };

  const sampleText = `ಒಂದು ಕಾಲದಲ್ಲಿ ಒಂದು ಊರಲ್ಲಿ ಒಬ್ಬ ರಾಜನಿದ್ದನು. ಅವನು ತುಂಬಾ ದಯಾಳು ಮತ್ತು ನ್ಯಾಯಪ್ರಿಯನಾಗಿದ್ದನು. ಪ್ರಜೆಗಳು ಅವನನ್ನು ತುಂಬಾ ಪ್ರೀತಿಸುತ್ತಿದ್ದರು. ಒಂದು ದಿನ ರಾಜನಿಗೆ ಒಂದು ಕನಸು ಬಂದಿತು. ಆ ಕನಸಿನಲ್ಲಿ ಒಬ್ಬ ಮುದುಕ ಅವನಿಗೆ ಹೇಳಿದನು, "ನಿಮ್ಮ ರಾಜ್ಯದಲ್ಲಿ ಒಂದು ವಿಶೇಷ ಪುಸ್ತಕ ಇದೆ. ಅದು ನಿಮ್ಮ ಜನರಿಗೆ ಬಹಳ ಒಳ್ಳೆಯದನ್ನು ಮಾಡುತ್ತದೆ."`;

  return (
    <div className="card">
      <h2 className="card-title">Add Your Kannada Text</h2>
      
      <div className="tab-container">
        <button
          className={`tab ${activeTab === 'paste' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('paste')}
        >
          <Clipboard className="icon" />
          Paste Text
        </button>
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('upload')}
        >
          <Upload className="icon" />
          Upload File
        </button>
      </div>

      {activeTab === 'paste' && (
        <form onSubmit={handleSubmit} className="form">
          <div>
            <textarea
              className="textarea"
              placeholder="ನಿಮ್ಮ ಕನ್ನಡ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          
          <div className="form-row">
            <button
              type="button"
              onClick={() => setInputText(sampleText)}
              className="btn btn-secondary btn-sm"
            >
              Try Sample Text
            </button>
            
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="btn btn-primary"
            >
              Start Reading
            </button>
          </div>
        </form>
      )}

      {activeTab === 'upload' && (
        <div className="file-upload">
          <FileText className="icon-xl" />
          <div style={{ marginBottom: '1rem' }}>
            <label className="btn btn-primary">
              Choose File (.txt)
              <input
                type="file"
                className="hidden"
                accept=".txt"
                onChange={handleFileUpload}
              />
            </label>
          </div>
          <p className="file-upload-text">
            Upload a .txt file containing Kannada text
          </p>
        </div>
      )}
    </div>
  );
};

// Interactive Reader Component
const InteractiveReader = ({ text, onWordClick, onBack, selectedWord }) => {
  const [hoveredWord, setHoveredWord] = useState(null);

  const processText = (text) => {
    const words = text.split(/(\s+|[.!?೥೦,;:])/);
    
    return words.map((word, index) => {
      const cleanWord = word.trim();
      
      if (!cleanWord || /^[\s.!?೥೦,;:]+$/.test(cleanWord)) {
        return <span key={index}>{word}</span>;
      }
      
      const wordForLookup = cleanWordForLookup(cleanWord);
      
      const isSelected = selectedWord === wordForLookup;
      const isHovered = hoveredWord === wordForLookup;
      
      let className = 'word';
      if (isSelected) className += ' selected';
      else if (isHovered) className += ' hovered';
      
      return (
        <span
          key={index}
          className={className}
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
    <div className="card" style={{ padding: 0 }}>
      <div className="reader-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft className="icon" />
          Back to Text Input
        </button>
        <div className="reader-hint">
          <Zap className="icon" style={{ color: '#f97316' }} />
          Click any word for smart analysis
        </div>
      </div>
      
      <div className="reader-text">
        {processText(text)}
      </div>
    </div>
  );
};

// Enhanced Dictionary Panel Component with Better Match Type Handling
const DictionaryPanel = ({ word, onClose, lookupWord, isDbReady, speakWord }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [dictEntry, setDictEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showGrammarHelp, setShowGrammarHelp] = useState(false);

  // Initialize dictionary lookup
  React.useEffect(() => {
    if (word) {
      lookupWordInternal(word);
    }
  }, [word]);

  const lookupWordInternal = async (searchWord) => {
    setLoading(true);
    try {
      const result = await lookupWord(searchWord);
      setDictEntry(result);
    } catch (error) {
      console.error('Dictionary lookup failed:', error);
      setDictEntry({
        matchType: 'error',
        originalWord: searchWord,
        entry: searchWord,
        romanization: 'Error',
        definition: 'Lookup failed. Please try again.',
        wordType: 'error'
      });
    }
    setLoading(false);
  };

  const playPronunciation = async () => {
    if (!dictEntry) return;
    
    setIsPlaying(true);
    try {
      // Use the phone field if available for better pronunciation
      const textToSpeak = dictEntry.phone || dictEntry.romanization || dictEntry.entry;
      await speakWord(dictEntry.entry, textToSpeak);
    } catch (error) {
      console.warn('Pronunciation failed:', error);
      // Try fallback with just the word
      try {
        await speakWord(dictEntry.entry);
      } catch (fallbackError) {
        alert('Pronunciation not available for this word');
      }
    } finally {
      setIsPlaying(false);
    }
  };

  if (!word) return null;

  if (loading) {
    return (
      <div className="dictionary-panel">
        <div className="dictionary-header">
          <div className="dictionary-title">
            <BookOpen className="icon icon-orange" />
            <h3>Smart Analysis</h3>
          </div>
          <button onClick={onClose} className="close-button">
            <X className="icon" />
          </button>
        </div>
        <div className="dictionary-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Loader2 className="icon" style={{ animation: 'spin 1s linear infinite', color: '#f97316' }} />
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Analyzing word...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dictEntry) return null;

  // Analyze compound structure
  const compoundAnalysis = analyzeCompound(word);

  return (
    <div className="dictionary-panel">
      <div className="dictionary-header">
        <div className="dictionary-title">
          <BookOpen className="icon icon-orange" />
          <h3>Smart Analysis</h3>
          {!isDbReady && (
            <span className="db-status limited">Limited</span>
          )}
        </div>
        <button onClick={onClose} className="close-button">
          <X className="icon" />
        </button>
      </div>

      <div className="dictionary-content">
        {/* Match Type Indicator */}
        <div className="match-type-indicator">
          {dictEntry.matchType === 'exact' && (
            <div className="match-badge exact">
              <span>✓ Exact Match</span>
            </div>
          )}
          {dictEntry.matchType === 'stem' && (
            <div className="match-badge stem">
              <span>🔍 Root Word Found</span>
            </div>
          )}
          {dictEntry.matchType === 'progressive' && (
            <div className="match-badge partial">
              <span>📝 Similar Words</span>
            </div>
          )}
          {dictEntry.matchType === 'suggestions' && (
            <div className="match-badge suggestions">
              <span>💡 Suggestions</span>
            </div>
          )}
          {dictEntry.matchType === 'fallback' && (
            <div className="match-badge fallback">
              <span>🌐 Translation</span>
            </div>
          )}
        </div>

        {/* Word Analysis for Exact and Stem matches */}
        {(dictEntry.matchType === 'exact' || dictEntry.matchType === 'stem') && (
          <>
            {/* Original word display for stem matches */}
            {dictEntry.matchType === 'stem' && (
              <div className="original-word-section">
                <div className="section-title">You clicked:</div>
                <div className="kannada-word-large">{dictEntry.originalWord}</div>
                
                {/* Compound breakdown */}
                {compoundAnalysis.isCompound && (
                  <div className="compound-breakdown">
                    <div className="breakdown-title">Word breakdown:</div>
                    <div className="compound-parts">
                      {compoundAnalysis.components.map((component, index) => (
                        <div key={index} className="compound-part">
                          <span className={`part-text ${component.type}`}>
                            {component.text}
                          </span>
                          <span className="part-meaning">
                            {component.meaning}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="section-title" style={{ marginTop: '1rem' }}>Root word:</div>
              </div>
            )}

            {/* Main word information */}
            <div className="word-info-section">
              <div className="kannada-word">{dictEntry.entry}</div>
              <div className="romanization-container">
                <span className="romanization">
                  {dictEntry.phone || dictEntry.romanization}
                </span>
                <button
                  onClick={playPronunciation}
                  disabled={isPlaying}
                  className="btn btn-secondary btn-sm"
                >
                  <Volume2 className="icon" />
                  <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
                </button>
              </div>
            </div>

            {/* Definition section */}
            <div className="definition-section">
              <div className="word-type">{dictEntry.wordType || dictEntry.type}</div>
              <div className="definition">{dictEntry.definition}</div>
              
              {dictEntry.alternateDefinitions && dictEntry.alternateDefinitions.map((def, index) => (
                <div key={index} className="alternate-definition">
                  <div className="word-type">{def.type}</div>
                  <div className="definition">{def.definition}</div>
                </div>
              ))}
              
              {dictEntry.totalDefinitions > 1 && (
                <div className="definition-count">
                  {dictEntry.totalDefinitions} definitions available
                </div>
              )}
            </div>

            {/* Grammar helper for stem matches */}
            {dictEntry.grammaticalInfo && dictEntry.grammaticalInfo.length > 0 && (
              <div className="grammar-section">
                <button 
                  className="grammar-toggle"
                  onClick={() => setShowGrammarHelp(!showGrammarHelp)}
                >
                  <Lightbulb className="icon" />
                  Grammar Helper
                  <span style={{ marginLeft: 'auto' }}>
                    {showGrammarHelp ? '−' : '+'}
                  </span>
                </button>
                
                {showGrammarHelp && (
                  <div className="grammar-explanations">
                    {getGrammarExplanation(dictEntry.grammaticalInfo).map((explanation, index) => (
                      <div key={index} className="grammar-item">
                        <strong>{explanation.term}:</strong>
                        <span>{explanation.explanation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Progressive match results */}
        {dictEntry.matchType === 'progressive' && (
          <div className="progressive-match-section">
            <div className="section-title">
              Found partial match for: <strong>{dictEntry.originalWord}</strong>
            </div>
            <div className="match-info">
              Matched: <span className="matched-part">{dictEntry.matchedPortion}</span>
              {dictEntry.remainingPortion && (
                <>
                  {' '} + <span className="remaining-part">{dictEntry.remainingPortion}</span>
                </>
              )}
            </div>
            <div className="suggestions-list">
              <div className="suggestions-title">Similar words:</div>
              {dictEntry.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => lookupWordInternal(suggestion.entry)}
                  className="suggestion-item"
                >
                  <span className="suggestion-entry">{suggestion.entry}</span>
                  <span className="suggestion-romanization">
                    ({suggestion.phone || suggestion.romanization})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions only */}
        {dictEntry.matchType === 'suggestions' && (
          <div className="suggestions-section">
            <div className="section-title">
              No exact match for: <strong>{dictEntry.originalWord}</strong>
            </div>
            <div className="suggestions-list">
              <div className="suggestions-title">Did you mean:</div>
              {dictEntry.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => lookupWordInternal(suggestion.entry)}
                  className="suggestion-item"
                >
                  <span className="suggestion-entry">{suggestion.entry}</span>
                  <span className="suggestion-romanization">
                    ({suggestion.phone || suggestion.romanization})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fallback translation */}
        {dictEntry.matchType === 'fallback' && (
          <div className="fallback-section">
            <div className="kannada-word">{dictEntry.entry}</div>
            <div className="romanization-container">
              <span className="romanization">{dictEntry.romanization}</span>
              <button
                onClick={playPronunciation}
                disabled={isPlaying}
                className="btn btn-secondary btn-sm"
              >
                <Volume2 className="icon" />
                <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
              </button>
            </div>
            <div className="definition-section">
              <div className="word-type">Translation</div>
              <div className="definition">{dictEntry.definition}</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                📡 {dictEntry.source === 'mymemory' ? 'MyMemory Translation' : 
                     dictEntry.source === 'libretranslate' ? 'LibreTranslate' : 
                     'Translation service'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentText, setCurrentText] = useState('');
  const [selectedWord, setSelectedWord] = useState('');
  const [showReader, setShowReader] = useState(false);
  
  // Initialize enhanced dictionary hook
  const { isLoading, isReady, error, lookupWord, speakWord, getStats, retry } = useDictionary();
  const [stats, setStats] = useState(null);

  // Load stats when ready
  React.useEffect(() => {
    if (isReady && getStats) {
      getStats().then(setStats);
    }
  }, [isReady, getStats]);

  const handleTextSubmit = (text) => {
    setCurrentText(text);
    setShowReader(true);
    setSelectedWord('');
  };

  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  const handleBackToInput = () => {
    setShowReader(false);
    setCurrentText('');
    setSelectedWord('');
  };

  const handleCloseDictionary = () => {
    setSelectedWord('');
  };

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <Layout>
        <LoadingScreen error={error} onRetry={retry} stats={stats} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Enhanced status indicator */}
        {!isReady && !isLoading && (
          <div className="card status-card warning">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle className="icon" style={{ color: '#d97706' }} />
              <div>
                <div style={{ color: '#92400e', fontSize: '0.875rem', fontWeight: '500' }}>
                  Using limited dictionary
                </div>
                <div style={{ color: '#a16207', fontSize: '0.75rem' }}>
                  {error && `Error: ${error}`}
                </div>
              </div>
              <button onClick={retry} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
                Retry
              </button>
            </div>
          </div>
        )}

        {isReady && stats && (
          <div className="card status-card success">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen className="icon" style={{ color: '#16a34a' }} />
              <div style={{ color: '#166534', fontSize: '0.875rem' }}>
                <strong>Full dictionary loaded:</strong> {stats.totalWords?.toLocaleString()} words, 
                {stats.totalDefinitions?.toLocaleString()} definitions with smart morphological analysis
              </div>
            </div>
          </div>
        )}

        {!showReader ? (
          <TextInput onTextSubmit={handleTextSubmit} />
        ) : (
          <div className="reader-container">
            <div>
              <InteractiveReader
                text={currentText}
                onWordClick={handleWordClick}
                onBack={handleBackToInput}
                selectedWord={selectedWord}
              />
            </div>
            
            <div>
              {selectedWord && (
                <DictionaryPanel
                  word={selectedWord}
                  onClose={handleCloseDictionary}
                  lookupWord={lookupWord}
                  speakWord={speakWord}
                  isDbReady={isReady}
                />
              )}
              
              {!selectedWord && (
                <div className="placeholder-state">
                  <BookOpen className="icon-xl" />
                  <h3>Smart Word Analysis</h3>
                  <p>Click on any word in the text to see:</p>
                  <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
                    <li>📖 Dictionary meanings</li>
                    <li>🔍 Root word analysis</li>
                    <li>📚 Grammar explanations</li>
                    <li>🔊 Pronunciation help</li>
                    <li>💡 Word suggestions</li>
                  </ul>
                  {isReady && (
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
                      ✅ Enhanced with {stats?.totalWords?.toLocaleString()} words database
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;