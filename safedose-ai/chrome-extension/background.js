// SafeDose.ai Background Script
// Handles extension lifecycle and communication

class SafeDoseBackground {
  constructor() {
    this.apiUrl = "http://localhost:8000/api/v1";
    this.init();
  }

  init() {
    // Set up message listeners
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async response
    });

    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    // Set default settings
    this.setDefaultSettings();
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case "analyzeText":
          const result = await this.analyzeText(
            request.text,
            request.sourceUrl
          );
          sendResponse({ success: true, data: result });
          break;

        case "getSettings":
          const settings = await this.getSettings();
          sendResponse({ success: true, data: settings });
          break;

        case "updateSettings":
          await this.updateSettings(request.settings);
          sendResponse({ success: true });
          break;

        case "getAnalysisHistory":
          const history = await this.getAnalysisHistory();
          sendResponse({ success: true, data: history });
          break;

        default:
          sendResponse({ success: false, error: "Unknown action" });
      }
    } catch (error) {
      console.error("Background script error:", error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async analyzeText(text, sourceUrl) {
    try {
      const response = await fetch(`${this.apiUrl}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          source_url: sourceUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      // Store analysis in history
      await this.storeAnalysisHistory({
        text: text.substring(0, 200) + "...",
        sourceUrl: sourceUrl,
        result: result,
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      console.error("Text analysis failed:", error);
      throw error;
    }
  }

  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(
        ["enabled", "autoAnalyze", "showTooltips", "apiUrl"],
        (result) => {
          resolve({
            enabled: result.enabled !== false,
            autoAnalyze: result.autoAnalyze !== false,
            showTooltips: result.showTooltips !== false,
            apiUrl: result.apiUrl || this.apiUrl,
          });
        }
      );
    });
  }

  async updateSettings(settings) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(settings, resolve);
    });
  }

  async getAnalysisHistory() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["analysisHistory"], (result) => {
        resolve(result.analysisHistory || []);
      });
    });
  }

  async storeAnalysisHistory(analysis) {
    const history = await this.getAnalysisHistory();
    history.unshift(analysis);

    // Keep only last 50 analyses
    if (history.length > 50) {
      history.splice(50);
    }

    return new Promise((resolve) => {
      chrome.storage.local.set({ analysisHistory: history }, resolve);
    });
  }

  async setDefaultSettings() {
    const settings = await this.getSettings();
    const defaults = {
      enabled: true,
      autoAnalyze: true,
      showTooltips: true,
      apiUrl: this.apiUrl,
    };

    // Only set defaults if no settings exist
    const hasSettings = Object.values(settings).some(
      (value) => value !== undefined
    );
    if (!hasSettings) {
      await this.updateSettings(defaults);
    }
  }

  handleInstallation(details) {
    if (details.reason === "install") {
      // First time installation
      console.log("SafeDose.ai extension installed");

      // Open welcome page
      chrome.tabs.create({
        url: "https://safedose.ai/welcome",
      });
    } else if (details.reason === "update") {
      // Extension updated
      console.log(
        "SafeDose.ai extension updated to version",
        chrome.runtime.getManifest().version
      );
    }
  }

  // Health check for API
  async checkApiHealth() {
    try {
      const response = await fetch(`${this.apiUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error("API health check failed:", error);
      return false;
    }
  }
}

// Initialize background script
new SafeDoseBackground();
