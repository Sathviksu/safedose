// SafeDose.ai Popup Script
// Handles popup UI interactions and communication with background script

class SafeDosePopup {
    constructor() {
        this.init();
    }

    async init() {
        // Load settings
        await this.loadSettings();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Check API status
        this.checkApiStatus();
    }

    setupEventListeners() {
        // Analyze button
        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.analyzeText();
        });

        // Settings toggles
        document.getElementById('enabledToggle').addEventListener('change', (e) => {
            this.updateSetting('enabled', e.target.checked);
        });

        document.getElementById('autoAnalyzeToggle').addEventListener('change', (e) => {
            this.updateSetting('autoAnalyze', e.target.checked);
        });

        document.getElementById('tooltipsToggle').addEventListener('change', (e) => {
            this.updateSetting('showTooltips', e.target.checked);
        });

        // History button
        document.getElementById('historyBtn').addEventListener('click', () => {
            this.showHistory();
        });

        // Enter key in textarea
        document.getElementById('textInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.analyzeText();
            }
        });
    }

    async loadSettings() {
        try {
            const response = await this.sendMessage({ action: 'getSettings' });
            if (response.success) {
                const settings = response.data;
                
                document.getElementById('enabledToggle').checked = settings.enabled;
                document.getElementById('autoAnalyzeToggle').checked = settings.autoAnalyze;
                document.getElementById('tooltipsToggle').checked = settings.showTooltips;
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    async updateSetting(key, value) {
        try {
            const settings = {};
            settings[key] = value;
            await this.sendMessage({ action: 'updateSettings', settings });
        } catch (error) {
            console.error('Failed to update setting:', error);
        }
    }

    async analyzeText() {
        const textInput = document.getElementById('textInput');
        const text = textInput.value.trim();
        
        if (!text) {
            this.showError('Please enter some text to analyze.');
            return;
        }

        if (text.length < 10) {
            this.showError('Text must be at least 10 characters long.');
            return;
        }

        // Show loading state
        const analyzeBtn = document.getElementById('analyzeBtn');
        const originalText = analyzeBtn.textContent;
        analyzeBtn.textContent = 'Analyzing...';
        analyzeBtn.disabled = true;

        try {
            const response = await this.sendMessage({
                action: 'analyzeText',
                text: text,
                sourceUrl: 'popup-input'
            });

            if (response.success) {
                this.displayResults(response.data);
            } else {
                this.showError('Analysis failed: ' + response.error);
            }
        } catch (error) {
            this.showError('Failed to analyze text: ' + error.message);
        } finally {
            // Restore button state
            analyzeBtn.textContent = originalText;
            analyzeBtn.disabled = false;
        }
    }

    displayResults(results) {
        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');
        
        const { misinformation_score, persuasion_score, trust_score, recommendations } = results;
        
        resultsContent.innerHTML = `
            <div class="results-grid">
                <div class="result-item ${this.getRiskClass(misinformation_score)}">
                    <div class="result-label">Misinformation Risk</div>
                    <div class="result-value">${(misinformation_score * 100).toFixed(1)}%</div>
                    <div class="result-bar">
                        <div class="result-bar-fill" style="width: ${misinformation_score * 100}%"></div>
                    </div>
                </div>
                
                <div class="result-item ${this.getRiskClass(persuasion_score)}">
                    <div class="result-label">Persuasion Techniques</div>
                    <div class="result-value">${(persuasion_score * 100).toFixed(1)}%</div>
                    <div class="result-bar">
                        <div class="result-bar-fill" style="width: ${persuasion_score * 100}%"></div>
                    </div>
                </div>
                
                <div class="result-item ${this.getRiskClass(1 - trust_score)}">
                    <div class="result-label">Trust Score</div>
                    <div class="result-value">${(trust_score * 100).toFixed(1)}%</div>
                    <div class="result-bar">
                        <div class="result-bar-fill" style="width: ${trust_score * 100}%"></div>
                    </div>
                </div>
            </div>
            
            ${recommendations.length > 0 ? `
                <div class="recommendations">
                    <h4>Recommendations:</h4>
                    <ul>
                        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
        
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    getRiskClass(score) {
        if (score < 0.3) return 'low-risk';
        if (score < 0.6) return 'medium-risk';
        return 'high-risk';
    }

    async showHistory() {
        try {
            const response = await this.sendMessage({ action: 'getAnalysisHistory' });
            if (response.success) {
                this.displayHistory(response.data);
            }
        } catch (error) {
            this.showError('Failed to load history: ' + error.message);
        }
    }

    displayHistory(history) {
        if (history.length === 0) {
            this.showError('No analysis history found.');
            return;
        }

        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');
        
        resultsContent.innerHTML = `
            <div class="history-list">
                <h4>Recent Analyses (${history.length})</h4>
                ${history.slice(0, 10).map(item => `
                    <div class="history-item">
                        <div class="history-text">${item.text}</div>
                        <div class="history-meta">
                            <span class="history-score">Trust: ${(item.result.trust_score * 100).toFixed(1)}%</span>
                            <span class="history-date">${new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    async checkApiStatus() {
        const statusText = document.getElementById('apiStatusText');
        
        try {
            const response = await fetch('http://localhost:8000/api/v1/health');
            if (response.ok) {
                statusText.textContent = 'Connected';
                statusText.className = 'status-value connected';
            } else {
                statusText.textContent = 'Error';
                statusText.className = 'status-value error';
            }
        } catch (error) {
            statusText.textContent = 'Disconnected';
            statusText.className = 'status-value disconnected';
        }
    }

    showError(message) {
        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');
        
        resultsContent.innerHTML = `
            <div class="error-message">
                <span>⚠️ ${message}</span>
            </div>
        `;
        
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    sendMessage(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(response);
                }
            });
        });
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SafeDosePopup();
});
