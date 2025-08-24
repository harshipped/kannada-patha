import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Check, X, Trophy, RefreshCw, Target, BookOpen, MessageSquare } from 'lucide-react';

const FlashcardTest = ({ allMaterials, onBack, speakWord }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  // Available materials configuration (same as in LearningMaterialsSelector)
const availableMaterials = [
  {
    id: 'alphabets',
    file: '/learning/alphabets.json',
    category: 'alphabet'
  },
  {
    id: 'beginner-vocabulary',
    file: '/learning/beginner-vocabulary.json', 
    category: 'vocabulary'
  },
  {
    id: 'intermediate-vocabulary',
    file: '/learning/intermediate-vocabulary.json', 
    category: 'vocabulary'
  },
  {
    id: 'advanced-vocabulary',
    file: '/learning/advanced-vocabulary.json',
    category: 'vocabulary'
  },
  {
    id: 'common-phrases',
    file: '/learning/common-phrases.json',
    category: 'phrases'
  }
];
  const testLevels = [
    {
      id: 'beginner',
      title: 'Beginner Test',
      description: 'Basic alphabets, vocabulary, and common phrases',
      sources: [
        { materialId: 'alphabets', type: 'alphabet', limit: 5 },
        { materialId: 'beginner-vocabulary', type: 'vocabulary', limit: 10 },
        { materialId: 'common-phrases', type: 'phrases', limit: 5 }
      ],
      color: '#16a34a',
      icon: BookOpen
    },
    {
      id: 'intermediate',
      title: 'Intermediate Test',
      description: 'Expanded vocabulary and complex phrases',
      sources: [
        { materialId: 'intermediate-vocabulary', type: 'vocabulary', limit: 15 },
        { materialId: 'common-phrases', type: 'phrases', limit: 10 }
      ],
      color: '#3b82f6',
      icon: MessageSquare
    },
    {
      id: 'advanced',
      title: 'Advanced Test',
      description: 'Advanced vocabulary and sophisticated expressions',
      sources: [
        { materialId: 'advanced-vocabulary', type: 'vocabulary', limit: 15 },
        { materialId: 'common-phrases', type: 'phrases', limit: 10 }
      ],
      color: '#7c3aed',
      icon: Target
    }
  ];

  const generateQuestionsFromMaterial = (materialData, sourceConfig) => {
    const questions = [];
    
    if (!materialData || !materialData.sections) {
      console.warn('Material data missing or invalid:', materialData);
      return questions;
    }
    
    materialData.sections.forEach(section => {
      if (section.items) {
        section.items.forEach(item => {
          if (item.kannada && item.english) {
            let question = '';
            
            // Generate appropriate question based on material type
            switch (sourceConfig.type) {
              case 'alphabet':
                question = 'What is the pronunciation of this character?';
                break;
              case 'vocabulary':
                question = 'What does this word mean?';
                break;
              case 'phrases':
                question = 'What does this phrase mean?';
                break;
              default:
                question = 'What does this mean?';
            }

            questions.push({
              kannada: item.kannada,
              english: item.english,
              romanization: item.romanization,
              type: sourceConfig.type,
              question: question,
              context: item.context || '',
              section: section.title
            });
          }
        });
      }
    });
    
    // Shuffle and limit questions
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, sourceConfig.limit);
  };

  const loadTestQuestions = async (level) => {
  setLoading(true);
  setError(null);
  
  try {
    const allQuestions = [];
    const missingMaterials = [];
    
    // Check which materials we need to load
    for (const source of level.sources) {
      let material = allMaterials.find(m => m.id === source.materialId);
      
      if (!material) {
        // Try to load the missing material
        const materialConfig = availableMaterials.find(config => config.id === source.materialId);
        if (materialConfig && materialConfig.file) {
          try {
            const response = await fetch(materialConfig.file);
            if (response.ok) {
              const data = await response.json();
              material = {
                ...data,
                config: materialConfig
              };
              // Add to allMaterials for future use
              allMaterials.push(material);
            }
          } catch (err) {
            console.warn(`Failed to auto-load ${source.materialId}:`, err);
          }
        }
      }
      
      if (material) {
        const questions = generateQuestionsFromMaterial(material, source);
        allQuestions.push(...questions);
      } else {
        missingMaterials.push(source.materialId);
      }
    }
    
    if (allQuestions.length === 0) {
      if (missingMaterials.length > 0) {
        throw new Error(`Required materials could not be loaded: ${missingMaterials.join(', ')}`);
      } else {
        throw new Error('No test questions could be generated from the available materials.');
      }
    }
    
    // Shuffle final question set
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
    setTestQuestions(shuffledQuestions);
    setSelectedLevel(level);
    
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (isCorrect) => {
    const newAnswers = [...answers];
    newAnswers[currentCard] = isCorrect;
    setAnswers(newAnswers);

    if (currentCard < testQuestions.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const correct = answers.filter(answer => answer === true).length;
    return Math.round((correct / testQuestions.length) * 100);
  };

  const restartTest = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswers([]);
    setShowResults(false);
  };

  const backToLevelSelection = () => {
    setSelectedLevel(null);
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswers([]);
    setShowResults(false);
    setTestQuestions([]);
    setError(null);
  };

  const playPronunciation = async (kannada, romanization) => {
    try {
      await speakWord(kannada, romanization);
    } catch (error) {
      console.warn('Pronunciation failed:', error);
    }
  };

  // Check if we have the required materials
  const availableMaterialIds = allMaterials.map(m => m.id);
  const filteredTestLevels = testLevels.map(level => {
    const availableSources = level.sources.filter(source => 
      availableMaterialIds.includes(source.materialId)
    );
    return {
      ...level,
      sources: availableSources,
      isAvailable: availableSources.length > 0
    };
  }).filter(level => level.isAvailable);

  // Show level selection screen
  if (!selectedLevel) {
    return (
      <div className="card">
        <div className="learning-header">
          <button onClick={onBack} className="back-button">
            <ArrowLeft className="icon" />
            Back to Learning Materials
          </button>
          <div className="learning-title">
            <Target className="icon icon-orange" />
            <div>
              <h2>Vocabulary Tests</h2>
              <p className="learning-description">Choose your difficulty level</p>
            </div>
          </div>
        </div>

        <div className="test-levels-grid">
          {filteredTestLevels.map(level => {
            const IconComponent = level.icon;
            const totalQuestions = level.sources.reduce((sum, source) => sum + source.limit, 0);
            
            return (
              <div 
                key={level.id} 
                className="test-level-card"
                onClick={() => loadTestQuestions(level)}
                style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                <div className="test-level-icon" style={{ backgroundColor: level.color }}>
                  <IconComponent className="icon-lg" style={{ color: 'white' }} />
                </div>
                
                <div className="test-level-content">
                  <h3 className="test-level-title">{level.title}</h3>
                  <p className="test-level-description">{level.description}</p>
                  
                  <div className="test-sources">
                    <span className="source-tag">
                      {totalQuestions} total questions
                    </span>
                    {level.sources.map((source, index) => (
                      <span key={index} className="source-tag">
                        {source.limit} {source.type}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="test-level-action">
                  <span className="start-test">
                    {loading ? 'Loading...' : 'Start Test'} →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTestLevels.length === 0 && (
          <div className="error-materials">
            <X className="icon-xl" style={{ color: '#ef4444' }} />
            <h3>No Tests Available</h3>
            <p>No learning materials are currently loaded. Please go back and load some materials first.</p>
          </div>
        )}

        {loading && (
          <div className="loading-materials">
            <RotateCw className="icon-xl" style={{ animation: 'spin 1s linear infinite', color: '#f97316' }} />
            <p>Generating test questions...</p>
          </div>
        )}

        {error && (
          <div className="error-materials">
            <X className="icon-xl" style={{ color: '#ef4444' }} />
            <h3>Failed to Generate Test</h3>
            <p>{error}</p>
            <button onClick={backToLevelSelection} className="btn btn-primary">
              Try Again
            </button>
          </div>
        )}
      </div>
    );
  }

  // Show results screen
  if (showResults) {
    const score = calculateScore();
    const correct = answers.filter(answer => answer === true).length;
    
    return (
      <div className="card">
        <div className="learning-header">
          <button onClick={onBack} className="back-button">
            <ArrowLeft className="icon" />
            Back to Learning Materials
          </button>
          <div className="learning-title">
            <Trophy className="icon icon-orange" />
            <div>
              <h2>{selectedLevel.title} - Results</h2>
              <p className="learning-description">Your test score</p>
            </div>
          </div>
        </div>

        <div className="score-display">
          <div className="score-circle">
            {score}%
          </div>
          <h3>You scored {correct} out of {testQuestions.length} correct!</h3>
          
          <div style={{ margin: '2rem 0' }}>
            {score >= 80 ? (
              <p style={{ color: '#16a34a', fontSize: '1.125rem' }}>
                Excellent work! You have mastered this level.
              </p>
            ) : score >= 60 ? (
              <p style={{ color: '#f59e0b', fontSize: '1.125rem' }}>
                Good job! Keep practicing to improve further.
              </p>
            ) : (
              <p style={{ color: '#dc2626', fontSize: '1.125rem' }}>
                Keep studying! Practice more to improve your score.
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={restartTest} className="btn btn-primary">
              <RefreshCw className="icon" />
              Retake Test
            </button>
            <button onClick={backToLevelSelection} className="btn btn-secondary">
              <Target className="icon" />
              Choose Different Level
            </button>
            <button onClick={onBack} className="btn btn-secondary">
              Back to Materials
            </button>
          </div>
        </div>

        {/* Question Review Section */}
        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
          <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Question Review:</h4>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {testQuestions.map((question, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '0.75rem', 
                  marginBottom: '0.5rem', 
                  backgroundColor: answers[index] ? '#f0f9ff' : '#fef2f2',
                  border: `1px solid ${answers[index] ? '#3b82f6' : '#ef4444'}`,
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Question {index + 1}: {question.kannada}
                </div>
                <div style={{ color: '#6b7280' }}>
                  Answer: {question.english} ({question.romanization})
                </div>
                <div style={{ 
                  color: answers[index] ? '#16a34a' : '#dc2626',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem'
                }}>
                  {answers[index] ? '✓ Correct' : '✗ Incorrect'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show test question
  if (!testQuestions.length) {
    return (
      <div className="card">
        <div className="learning-header">
          <button onClick={backToLevelSelection} className="back-button">
            <ArrowLeft className="icon" />
            Back to Level Selection
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No test questions available for this level.</p>
        </div>
      </div>
    );
  }

  const question = testQuestions[currentCard];

  return (
    <div className="card">
      <div className="learning-header">
        <button onClick={backToLevelSelection} className="back-button">
          <ArrowLeft className="icon" />
          Back to Level Selection
        </button>
        <div className="learning-title">
          <selectedLevel.icon className="icon icon-orange" />
          <div>
            <h2>{selectedLevel.title}</h2>
            <p className="learning-description">Flashcard Test</p>
          </div>
        </div>
      </div>

      <div className="flashcard-container">
        <div className="quiz-controls">
          <div className="quiz-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentCard + 1) / testQuestions.length) * 100}%` }}
              />
            </div>
            <p>Question {currentCard + 1} of {testQuestions.length}</p>
            <span className="question-type" style={{ 
              backgroundColor: selectedLevel.color, 
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              marginLeft: '1rem'
            }}>
              {question.type}
            </span>
            {question.section && (
              <span className="question-section" style={{ 
                backgroundColor: '#f3f4f6', 
                color: '#374151',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                marginLeft: '0.5rem'
              }}>
                {question.section}
              </span>
            )}
          </div>
        </div>

        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <div className="flashcard-question">{question.question}</div>
              <div className="flashcard-kannada">{question.kannada}</div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '1rem' }}>
                Click to see the answer
              </p>
            </div>
            <div className="flashcard-back">
              <div className="flashcard-answer">{question.english}</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                ({question.romanization})
              </div>
              {question.context && (
                <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                  Context: {question.context}
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playPronunciation(question.kannada, question.romanization);
                }}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '1rem' }}
              >
                Listen
              </button>
            </div>
          </div>
        </div>

        {isFlipped && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button 
              onClick={() => handleAnswer(false)}
              className="btn btn-secondary"
              style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
            >
              <X className="icon" />
              I got it wrong
            </button>
            <button 
              onClick={() => handleAnswer(true)}
              className="btn btn-primary"
              style={{ background: '#16a34a' }}
            >
              <Check className="icon" />
              I got it right
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardTest;