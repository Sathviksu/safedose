// SafeDose.ai Content Script
// Analyzes page content for misinformation and provides real-time feedback

class SafeDoseContentAnalyzer {
    constructor() {
        this.apiUrl = 'http://localhost:8000/api/v1';
        this.isEnabled = true;
        this.analysisResults = null;
        this.init();
    }

    async init() {
        // Check if analysis is enabled
        const settings = await this.getSettings();
        this.isEnabled = settings.enabled !== false;
        
        if (this.isEnabled) {
            this.analyzePageContent();
            this.setupEventListeners();
        }
    }

    async getSettings() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['enabled', 'autoAnalyze'], resolve);
        });
    }

    async analyzePageContent() {
        try {
            // Extract text content from the page
            const textContent = this.extractTextContent();
            
            if (textContent.length < 50) {
                return; // Skip short content
            }

            // Send to API for analysis
            const response = await fetch(`${this.apiUrl}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: textContent,
                    source_url: window.location.href
                })
            });

            if (response.ok) {
                this.analysisResults = await response.json();
                this.displayResults();
            }
        } catch (error) {
            console.error('SafeDose.ai analysis failed:', error);
        }
    }

    extractTextContent() {
        // Extract main content from the page
        const selectors = [
            'article',
            'main',
            '.content',
            '.post-content',
            '.entry-content',
            'p'
        ];

        let content = '';
        
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                content += element.textContent + ' ';
            }
        }

        // Clean and limit content
        return content.trim().substring(0, 5000);
    }

    displayResults() {
        if (!this.analysisResults) return;

        // Remove existing results
        this.removeExistingResults();

        // Create results container
        const container = document.createElement('div');
        container.id = 'safedose-results';
        container.className = 'safedose-container';
        
        const { misinformation_score, persuasion_score, trust_score, recommendations } = this.analysisResults;
        
        // Create results HTML
        container.innerHTML = `
            <div class="safedose-header">
                <h3>🔍 SafeDose.ai Analysis</h3>
                <button class="safedose-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="safedose-scores">
                <div class="score-item ${this.getRiskClass(misinformation_score)}">
                    <span class="score-label">Misinformation Risk:</span>
                    <span class="score-value">${(misinformation_score * 100).toFixed(1)}%</span>
                </div>
                <div class="score-item ${this.getRiskClass(persuasion_score)}">
                    <span class="score-label">Persuasion Techniques:</span>
                    <span class="score-value">${(persuasion_score * 100).toFixed(1)}%</span>
                </div>
                <div class="score-item ${this.getRiskClass(1 - trust_score)}">
                    <span class="score-label">Trust Score:</span>
                    <span class="score-value">${(trust_score * 100).toFixed(1)}%</span>
                </div>
            </div>
            ${recommendations.length > 0 ? `
                <div class="safedose-recommendations">
                    <h4>Recommendations:</h4>
                    <ul>
                        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;

        // Insert into page
        document.body.appendChild(container);
    }

    getRiskClass(score) {
        if (score < 0.3) return 'low-risk';
        if (score < 0.6) return 'medium-risk';
        return 'high-risk';
    }

    removeExistingResults() {
        const existing = document.getElementById('safedose-results');
        if (existing) {
            existing.remove();
        }
    }

    setupEventListeners() {
        // Listen for text selection
        document.addEventListener('mouseup', (e) => {
            const selection = window.getSelection();
            if (selection.toString().length > 20) {
                this.analyzeSelection(selection.toString());
            }
        });
    }

    async analyzeSelection(text) {
        try {
            const response = await fetch(`${this.apiUrl}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    source_url: window.location.href
                })
            });

            if (response.ok) {
                const result = await response.json();
                this.showSelectionResults(result, text);
            }
        } catch (error) {
            console.error('Selection analysis failed:', error);
        }
    }

    showSelectionResults(result, text) {
        // Create tooltip for selected text
        const tooltip = document.createElement('div');
        tooltip.className = 'safedose-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <strong>Quick Analysis:</strong><br>
                Misinformation: ${(result.misinformation_score * 100).toFixed(1)}%<br>
                Trust: ${(result.trust_score * 100).toFixed(1)}%
            </div>
        `;

        // Position tooltip near selection
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        tooltip.style.position = 'absolute';
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
        
        document.body.appendChild(tooltip);
        
        // Remove tooltip after 3 seconds
        setTimeout(() => tooltip.remove(), 3000);
    }
}

// Initialize the analyzer when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SafeDoseContentAnalyzer();
    });
} else {
    new SafeDoseContentAnalyzer();
}
