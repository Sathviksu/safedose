import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';
import './TextAnalyzer.css';

const TextAnalyzer = ({ onAnalysisComplete }) => {
  const [text, setText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }

    if (text.trim().length < 10) {
      setError('Text must be at least 10 characters long.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await axios.post('/api/v1/analyze', {
        text: text.trim(),
        source_url: sourceUrl.trim() || null
      });

      onAnalysisComplete(response.data);
      navigate('/results');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(
        err.response?.data?.detail || 
        'Failed to analyze text. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAnalyze();
    }
  };

  const getCharacterCount = () => {
    return text.length;
  };

  const getWordCount = () => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  return (
    <div className="text-analyzer">
      <div className="analyzer-header">
        <h2>Text Analysis</h2>
        <p>Paste or type text to analyze for misinformation and manipulation techniques</p>
      </div>

      <div className="analyzer-content">
        <div className="input-section">
          <div className="text-input-group">
            <label htmlFor="textInput">Text to Analyze *</label>
            <textarea
              id="textInput"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Paste or type the text you want to analyze for misinformation, persuasion techniques, and trustworthiness..."
              rows={8}
              disabled={isAnalyzing}
            />
            <div className="input-stats">
              <span>{getWordCount()} words</span>
              <span>{getCharacterCount()} characters</span>
            </div>
          </div>

          <div className="url-input-group">
            <label htmlFor="urlInput">Source URL (Optional)</label>
            <input
              id="urlInput"
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://example.com/article"
              disabled={isAnalyzing}
            />
            <small>Adding a source URL helps improve analysis accuracy</small>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <button
            className="btn btn-primary analyze-btn"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !text.trim()}
          >
            {isAnalyzing ? (
              <>
                <Loader className="spinner-icon" size={20} />
                Analyzing...
              </>
            ) : (
              <>
                <Search size={20} />
                Analyze Text
              </>
            )}
          </button>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>What We Analyze</h3>
            <ul>
              <li>
                <CheckCircle size={16} />
                <span>Misinformation patterns and red flags</span>
              </li>
              <li>
                <CheckCircle size={16} />
                <span>Persuasion and manipulation techniques</span>
              </li>
              <li>
                <CheckCircle size={16} />
                <span>Source credibility and trustworthiness</span>
              </li>
              <li>
                <CheckCircle size={16} />
                <span>Alternative verified sources</span>
              </li>
            </ul>
          </div>

          <div className="info-card">
            <h3>Tips for Better Analysis</h3>
            <ul>
              <li>Include the full context of the text</li>
              <li>Add source URLs when available</li>
              <li>Analyze longer texts for more accurate results</li>
              <li>Consider the source and publication date</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>Keyboard Shortcuts</h3>
            <div className="shortcut">
              <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
              <span>Analyze text</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextAnalyzer;
