import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
} from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import "./Results.css";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Results = ({ results, onBack }) => {
  const navigate = useNavigate();

  if (!results) {
    return (
      <div className="results-error">
        <h2>No Analysis Results</h2>
        <p>Please analyze some text first to see results.</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/analyze")}
        >
          Start Analysis
        </button>
      </div>
    );
  }

  const {
    misinformation_score,
    persuasion_score,
    trust_score,
    recommendations,
    analysis_result,
  } = results;

  const getRiskLevel = (score) => {
    if (score < 0.3)
      return {
        level: "Low",
        color: "#27ae60",
        icon: <CheckCircle size={20} />,
      };
    if (score < 0.6)
      return {
        level: "Medium",
        color: "#f39c12",
        icon: <AlertTriangle size={20} />,
      };
    return {
      level: "High",
      color: "#e74c3c",
      icon: <AlertTriangle size={20} />,
    };
  };

  const misinfoRisk = getRiskLevel(misinformation_score);
  const persuasionRisk = getRiskLevel(persuasion_score);
  const trustRisk = getRiskLevel(1 - trust_score);

  // Chart data for trust score
  const chartData = {
    labels: ["Trust Score", "Risk"],
    datasets: [
      {
        data: [trust_score * 100, (1 - trust_score) * 100],
        backgroundColor: ["#27ae60", "#e74c3c"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed.toFixed(1)}%`;
          },
        },
      },
    },
  };

  return (
    <div className="results">
      <div className="results-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Analysis
        </button>
        <h2>Analysis Results</h2>
        <p>Here's what our AI found in your text</p>
      </div>

      <div className="results-content">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-header">
              <AlertTriangle size={24} color={misinfoRisk.color} />
              <h3>Misinformation Risk</h3>
            </div>
            <div className="card-value" style={{ color: misinfoRisk.color }}>
              {(misinformation_score * 100).toFixed(1)}%
            </div>
            <div className="card-level">
              {misinfoRisk.icon}
              <span>{misinfoRisk.level} Risk</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-header">
              <Info size={24} color={persuasionRisk.color} />
              <h3>Persuasion Techniques</h3>
            </div>
            <div className="card-value" style={{ color: persuasionRisk.color }}>
              {(persuasion_score * 100).toFixed(1)}%
            </div>
            <div className="card-level">
              {persuasionRisk.icon}
              <span>{persuasionRisk.level} Level</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-header">
              <CheckCircle size={24} color={trustRisk.color} />
              <h3>Trust Score</h3>
            </div>
            <div className="card-value" style={{ color: trustRisk.color }}>
              {(trust_score * 100).toFixed(1)}%
            </div>
            <div className="card-level">
              {trustRisk.icon}
              <span>{trustRisk.level} Trust</span>
            </div>
          </div>
        </div>

        {/* Trust Score Chart */}
        <div className="chart-section">
          <div className="chart-card">
            <h3>Trust Score Breakdown</h3>
            <div className="chart-container">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="chart-center">
                <div className="center-value">
                  {(trust_score * 100).toFixed(0)}%
                </div>
                <div className="center-label">Trust</div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="analysis-summary">
          <div className="summary-card-full">
            <h3>Analysis Summary</h3>
            <p>{analysis_result}</p>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="recommendations-section">
            <div className="recommendations-card">
              <h3>Recommendations</h3>
              <ul>
                {recommendations.map((recommendation, index) => (
                  <li key={index}>
                    <CheckCircle size={16} />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/analyze")}
          >
            Analyze Another Text
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            Back to Dashboard
          </button>
        </div>

        {/* Additional Resources */}
        <div className="resources-section">
          <div className="resources-card">
            <h3>Learn More About Digital Literacy</h3>
            <div className="resource-links">
              <a
                href="https://www.snopes.com"
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
              >
                <ExternalLink size={16} />
                <span>Snopes - Fact Checking</span>
              </a>
              <a
                href="https://www.factcheck.org"
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
              >
                <ExternalLink size={16} />
                <span>FactCheck.org</span>
              </a>
              <a
                href="https://www.politifact.com"
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
              >
                <ExternalLink size={16} />
                <span>PolitiFact</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
