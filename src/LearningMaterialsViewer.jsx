import React, { useState } from 'react';
import { BookOpen, Volume2, ArrowLeft, ChevronRight, Lightbulb, User, MessageCircle, GraduationCap } from 'lucide-react';
import FlashcardTest from './FlashcardTest.jsx';

// Main Learning Materials Viewer Component
const LearningMaterialsViewer = ({ material, onBack, onWordClick, speakWord }) => {
  const [selectedSection, setSelectedSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!material) return null;

  // Handle flashcard tests
  if (material.type === 'test') {
    return (
      <FlashcardTest 
        material={material}
        onBack={onBack}
        speakWord={speakWord}
      />
    );
  }

  const currentSection = material.sections[selectedSection];
  const hasManyTabs = material.sections.length > 4;

  const playPronunciation = async (kannada, romanization) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      await speakWord(kannada, romanization);
    } catch (error) {
      console.warn('Pronunciation failed:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const renderAlphabetSection = (section) => (
    <div className="learning-section">
      <div className="section-header">
        <h3 className="section-title">{section.title}</h3>
        <p className="section-subtitle">{section.subtitle}</p>
      </div>
      
      <div className="alphabet-grid">
        {section.items.map((item, index) => (
          <div key={index} className="alphabet-card">
            <div className="alphabet-main">
              <div 
                className="kannada-char"
                onClick={() => onWordClick && onWordClick(item.kannada)}
              >
                {item.kannada}
              </div>
              <div className="char-info">
                <div className="romanization">{item.romanization}</div>
                <div className="pronunciation">{item.english}</div>
              </div>
              <button
                onClick={() => playPronunciation(item.kannada, item.romanization)}
                disabled={isPlaying}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.5rem' }}
              >
                <Volume2 className="icon" />
                <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
              </button>
            </div>
            
            {item.example && (
              <div className="example-section">
                <div className="example-label">Example:</div>
                <div 
                  className="example-word"
                  onClick={() => onWordClick && onWordClick(item.example.word)}
                >
                  {item.example.word}
                </div>
                <div className="example-details">
                  <span className="example-meaning">{item.example.meaning}</span>
                  <span className="example-rom">({item.example.romanization})</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderVocabularySection = (section) => (
    <div className="learning-section">
      <div className="section-header">
        <h3 className="section-title">{section.title}</h3>
        <p className="section-subtitle">{section.subtitle}</p>
      </div>
      
      <div className="vocabulary-list">
        {section.items.map((item, index) => (
          <div key={index} className="vocabulary-item">
            <div className="word-section">
              <div 
                className="kannada-word"
                onClick={() => onWordClick && onWordClick(item.kannada)}
              >
                {item.kannada}
              </div>
              <div className="word-details">
                <div className="english-meaning">{item.english}</div>
                <div className="romanization">({item.romanization})</div>
              </div>
              <button
                onClick={() => playPronunciation(item.kannada, item.romanization)}
                disabled={isPlaying}
                className="btn btn-secondary btn-sm"
              >
                <Volume2 className="icon" />
              </button>
            </div>
            
            {item.context && (
              <div className="context-section">
                <Lightbulb className="icon context-icon" />
                <span className="context-text">{item.context}</span>
              </div>
            )}

            {item.usage && (
              <div className="usage-section">
                <div className="usage-label">Usage:</div>
                <div 
                  className="usage-example"
                  onClick={() => onWordClick && onWordClick(item.usage.kannada)}
                >
                  <span className="usage-kannada">{item.usage.kannada}</span>
                  <span className="usage-meaning"> - {item.usage.english}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPhrasesSection = (section) => (
    <div className="learning-section">
      <div className="section-header">
        <h3 className="section-title">{section.title}</h3>
        <p className="section-subtitle">{section.subtitle}</p>
      </div>
      
      <div className="phrases-list">
        {section.items.map((item, index) => (
          <div key={index} className="phrase-item">
            <div className="phrase-main">
              <div 
                className="kannada-phrase"
                onClick={() => onWordClick && onWordClick(item.kannada)}
              >
                {item.kannada}
              </div>
              <div className="phrase-translation">{item.english}</div>
              <div className="phrase-romanization">({item.romanization})</div>
              
              <div className="phrase-actions">
                <button
                  onClick={() => playPronunciation(item.kannada, item.romanization)}
                  disabled={isPlaying}
                  className="btn btn-secondary btn-sm"
                >
                  <Volume2 className="icon" />
                  <span>Listen</span>
                </button>
                
                {item.context && (
                  <div className="context-badge">
                    <MessageCircle className="icon" />
                    <span>{item.context}</span>
                  </div>
                )}
              </div>
            </div>
            
            {item.breakdown && (
              <div className="breakdown-section">
                <div className="breakdown-title">Word breakdown:</div>
                <div className="breakdown-list">
                  {item.breakdown.map((part, partIndex) => (
                    <div key={partIndex} className="breakdown-item">
                      <span 
                        className="breakdown-word"
                        onClick={() => onWordClick && onWordClick(part.word)}
                      >
                        {part.word}
                      </span>
                      <span className="breakdown-meaning">= {part.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.variations && (
              <div className="variations-section">
                <div className="variations-title">Variations:</div>
                <div className="variations-list">
                  {item.variations.map((variation, varIndex) => (
                    <div key={varIndex} className="variation-item">
                      <span 
                        className="variation-kannada"
                        onClick={() => onWordClick && onWordClick(variation.kannada)}
                      >
                        {variation.kannada}
                      </span>
                      <span className="variation-context">({variation.context})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSection = (section) => {
    switch (material.type) {
      case 'alphabet':
        return renderAlphabetSection(section);
      case 'vocabulary':
        return renderVocabularySection(section);
      case 'phrases':
        return renderPhrasesSection(section);
      default:
        return renderVocabularySection(section);
    }
  };

  return (
    <div className="card" style={{ padding: 0 }}>
      <div className="learning-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft className="icon" />
          Back to Learning Materials
        </button>
        
        <div className="learning-title">
          <BookOpen className="icon icon-orange" />
          <div>
            <h2>{material.title}</h2>
            <p className="learning-description">{material.description}</p>
            <span className={`level-badge ${material.level}`}>
              {material.level.charAt(0).toUpperCase() + material.level.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      {material.sections.length > 1 && (
        <div className={`section-navigation ${hasManyTabs ? 'many-tabs' : ''}`}>
          {material.sections.map((section, index) => (
            <button
              key={index}
              className={`section-tab ${selectedSection === index ? 'active' : 'inactive'}`}
              onClick={() => setSelectedSection(index)}
            >
              {section.title}
            </button>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="learning-content">
        {renderSection(currentSection)}
      </div>

      {/* Navigation buttons */}
      {material.sections.length > 1 && (
        <div className="section-controls">
          <button
            onClick={() => setSelectedSection(Math.max(0, selectedSection - 1))}
            disabled={selectedSection === 0}
            className="btn btn-secondary"
          >
            Previous Section
          </button>
          
          <span className="section-counter">
            {selectedSection + 1} of {material.sections.length}
          </span>
          
          <button
            onClick={() => setSelectedSection(Math.min(material.sections.length - 1, selectedSection + 1))}
            disabled={selectedSection === material.sections.length - 1}
            className="btn btn-secondary"
          >
            Next Section
            <ChevronRight className="icon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LearningMaterialsViewer;