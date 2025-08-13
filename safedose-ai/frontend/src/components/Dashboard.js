import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, TrendingUp, Users, Zap, Globe } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const features = [
    {
      icon: <Shield size={32} />,
      title: 'Misinformation Detection',
      description: 'Advanced AI algorithms detect patterns and signals of misinformation in text content.'
    },
    {
      icon: <Search size={32} />,
      title: 'Persuasion Analysis',
      description: 'Identify manipulation techniques and emotional appeals used in content.'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Trust Scoring',
      description: 'Get comprehensive trust scores based on multiple factors and source verification.'
    },
    {
      icon: <Users size={32} />,
      title: 'Trusted Alternatives',
      description: 'Find verified sources and fact-checking resources for any topic.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Real-time Analysis',
      description: 'Instant analysis with our browser extension for seamless protection.'
    },
    {
      icon: <Globe size={32} />,
      title: 'Global Coverage',
      description: 'Works across multiple languages and content types worldwide.'
    }
  ];

  const stats = [
    { label: 'Analyses Performed', value: '10,000+' },
    { label: 'Accuracy Rate', value: '95%' },
    { label: 'Active Users', value: '5,000+' },
    { label: 'Trusted Sources', value: '1,000+' }
  ];

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Protect Yourself from Misinformation</h2>
          <p>
            SafeDose.ai uses cutting-edge AI to help you identify misinformation, 
            detect manipulation techniques, and find trusted sources. 
            Stay informed, stay safe.
          </p>
          <div className="hero-buttons">
            <Link to="/analyze" className="btn btn-primary">
              <Search size={20} />
              Start Analysis
            </Link>
            <a href="#features" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="card-header">
              <div className="card-icon">🔍</div>
              <h3>Sample Analysis</h3>
            </div>
            <div className="card-content">
              <div className="metric">
                <span className="metric-label">Misinformation Risk</span>
                <span className="metric-value low">15%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Trust Score</span>
                <span className="metric-value high">85%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Persuasion Level</span>
                <span className="metric-value medium">45%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>How SafeDose.ai Protects You</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Analyzing?</h2>
          <p>
            Join thousands of users who trust SafeDose.ai to help them 
            navigate the digital information landscape safely.
          </p>
          <Link to="/analyze" className="btn btn-primary">
            <Search size={20} />
            Analyze Your First Text
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
