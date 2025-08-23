import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, MessageSquare, Type, Loader2, AlertCircle } from 'lucide-react';

// Learning Materials Selector Component
const LearningMaterialsSelector = ({ onMaterialSelect }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Available learning materials configuration
  const availableMaterials = [
    {
      id: 'alphabets',
      file: '/learning/alphabets.json',
      category: 'alphabet',
      icon: Type,
      color: '#3b82f6'
    },
    {
      id: 'beginner-vocabulary',
      file: '/learning/beginner-vocabulary.json', 
      category: 'vocabulary',
      icon: BookOpen,
      color: '#10b981'
    },
    {
      id: 'common-phrases',
      file: '/learning/common-phrases.json',
      category: 'phrases', 
      icon: MessageSquare,
      color: '#f59e0b'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Materials', icon: GraduationCap },
    { id: 'alphabet', label: 'Alphabets', icon: Type },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen },
    { id: 'phrases', label: 'Phrases', icon: MessageSquare }
  ];

  // Load learning materials on mount
  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const loadedMaterials = [];
      
      for (const materialConfig of availableMaterials) {
        try {
          const response = await fetch(materialConfig.file);
          if (response.ok) {
            const data = await response.json();
            loadedMaterials.push({
              ...data,
              config: materialConfig
            });
          } else {
            console.warn(`Failed to load ${materialConfig.id}:`, response.status);
          }
        } catch (err) {
          console.warn(`Error loading ${materialConfig.id}:`, err);
        }
      }
      
      if (loadedMaterials.length === 0) {
        throw new Error('No learning materials could be loaded');
      }
      
      setMaterials(loadedMaterials);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = selectedCategory === 'all' 
    ? materials 
    : materials.filter(m => m.type === selectedCategory);

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'beginner': return 'level-beginner';
      case 'intermediate': return 'level-intermediate';
      case 'advanced': return 'level-advanced';
      default: return 'level-beginner';
    }
  };

  const getItemCount = (material) => {
    return material.sections?.reduce((total, section) => {
      return total + (section.items?.length || 0);
    }, 0) || 0;
  };

  if (loading) {
    return (
      <div className="learning-materials-selector">
        <div className="selector-header">
          <GraduationCap className="icon-lg icon-orange" />
          <div>
            <h2>Learning Materials</h2>
            <p>Interactive lessons for learning Kannada</p>
          </div>
        </div>
        
        <div className="loading-materials">
          <Loader2 className="icon-xl" style={{ animation: 'spin 1s linear infinite', color: '#f97316' }} />
          <p>Loading learning materials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learning-materials-selector">
        <div className="selector-header">
          <GraduationCap className="icon-lg icon-orange" />
          <div>
            <h2>Learning Materials</h2>
            <p>Interactive lessons for learning Kannada</p>
          </div>
        </div>
        
        <div className="error-materials">
          <AlertCircle className="icon-xl" style={{ color: '#ef4444' }} />
          <h3>Failed to Load Materials</h3>
          <p>{error}</p>
          <button onClick={loadMaterials} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-materials-selector">
      <div className="selector-header">
        <GraduationCap className="icon-lg icon-orange" />
        <div>
          <h2>Learning Materials</h2>
          <p>Interactive lessons for learning Kannada - click on any Kannada text for detailed analysis</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map(category => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? 'active' : 'inactive'}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <IconComponent className="icon" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Materials Grid */}
      <div className="materials-grid">
        {filteredMaterials.map(material => {
          const IconComponent = material.config.icon;
          const itemCount = getItemCount(material);
          
          return (
            <div key={material.id} className="material-card" onClick={() => onMaterialSelect(material)}>
              <div className="material-icon" style={{ backgroundColor: material.config.color }}>
                <IconComponent className="icon-lg" style={{ color: 'white' }} />
              </div>
              
              <div className="material-content">
                <h3 className="material-title">{material.title}</h3>
                <p className="material-description">{material.description}</p>
                
                <div className="material-meta">
                  <span className={`level-badge ${getLevelBadgeClass(material.level)}`}>
                    {material.level}
                  </span>
                  <span className="item-count">
                    {itemCount} {material.type === 'alphabet' ? 'characters' : 'items'}
                  </span>
                </div>
                
                {material.sections && (
                  <div className="sections-preview">
                    <span className="sections-count">
                      {material.sections.length} sections:
                    </span>
                    <span className="sections-list">
                      {material.sections.map(s => s.title).join(', ')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="material-action">
                <span className="start-lesson">Start Learning →</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="no-materials">
          <BookOpen className="icon-xl" style={{ color: '#9ca3af' }} />
          <h3>No materials found</h3>
          <p>No learning materials available for the selected category.</p>
        </div>
      )}
    </div>
  );
};

export default LearningMaterialsSelector;