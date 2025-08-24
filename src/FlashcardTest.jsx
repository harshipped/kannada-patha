import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, Check, X, Trophy, RefreshCw } from 'lucide-react';

const FlashcardTest = ({ material, onBack, speakWord }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);

  // Initialize test questions from vocabulary materials
  useEffect(() => {
    if (material && material.questions) {
      setTestQuestions(material.questions.slice(0, 10));
    }
  }, [material]);

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

  const playPronunciation = async (kannada, romanization) => {
    try {
      await speakWord(kannada, romanization);
    } catch (error) {
      console.warn('Pronunciation failed:', error);
    }
  };

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
              <h2>Test Results</h2>
              <p className="learning-description">Your Kannada vocabulary test score</p>
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
                Excellent work! You have a strong grasp of Kannada vocabulary.
              </p>
            ) : score >= 60 ? (
              <p style={{ color: '#f59e0b', fontSize: '1.125rem' }}>
                Good job! Keep practicing to improve further.
              </p>
            ) : (
              <p style={{ color: '#dc2626', fontSize: '1.125rem' }}>
                Keep studying! Practice more vocabulary to improve your score.
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={restartTest} className="btn btn-primary">
              <RefreshCw className="icon" />
              Take Test Again
            </button>
            <button onClick={onBack} className="btn btn-secondary">
              Back to Materials
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!testQuestions.length) {
    return (
      <div className="card">
        <div className="learning-header">
          <button onClick={onBack} className="back-button">
            <ArrowLeft className="icon" />
            Back to Learning Materials
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No test questions available for this material.</p>
        </div>
      </div>
    );
  }

  const question = testQuestions[currentCard];

  return (
    <div className="card">
      <div className="learning-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft className="icon" />
          Back to Learning Materials
        </button>
        <div className="learning-title">
          <GraduationCap className="icon icon-orange" />
          <div>
            <h2>{material.title}</h2>
            <p className="learning-description">Flashcard Vocabulary Test</p>
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
          </div>
        </div>

        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <div className="flashcard-question">What does this word mean?</div>
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