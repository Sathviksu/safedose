import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TextAnalyzer from './components/TextAnalyzer';
import Results from './components/Results';
import './App.css';

function App() {
  const [analysisResults, setAnalysisResults] = useState(null);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="container">
            <h1>🔍 SafeDose.ai</h1>
            <p>AI-powered misinformation detection and trusted messaging platform</p>
          </div>
        </header>

        <main className="App-main">
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analyze" element={
                <TextAnalyzer 
                  onAnalysisComplete={setAnalysisResults}
                />
              } />
              <Route path="/results" element={
                <Results 
                  results={analysisResults}
                  onBack={() => setAnalysisResults(null)}
                />
              } />
            </Routes>
          </div>
        </main>

        <footer className="App-footer">
          <div className="container">
            <p>&copy; 2024 SafeDose.ai. Empowering digital literacy through AI.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
