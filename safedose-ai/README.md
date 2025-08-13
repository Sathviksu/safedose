# SafeDose.ai - AI-Powered Misinformation Detection Platform

🔍 **SafeDose.ai** is a comprehensive platform that uses artificial intelligence to detect misinformation, analyze persuasion techniques, and provide trusted alternatives for digital content.

## 🌟 Features

- **Misinformation Detection**: Advanced AI algorithms detect patterns and signals of misinformation
- **Persuasion Analysis**: Identify manipulation techniques and emotional appeals
- **Trust Scoring**: Comprehensive trust scores based on multiple factors
- **Trusted Alternatives**: Find verified sources and fact-checking resources
- **Real-time Analysis**: Browser extension for seamless protection
- **Global Coverage**: Works across multiple languages and content types

## 🏗️ Architecture

The project consists of three main components:

### 1. Backend (FastAPI + Python)

- **Location**: `backend/`
- **Framework**: FastAPI
- **Database**: SQLAlchemy with SQLite/PostgreSQL
- **AI Services**: Custom misinformation detection and persuasion analysis

### 2. Frontend (React)

- **Location**: `frontend/`
- **Framework**: React 18
- **Styling**: Custom CSS with modern design
- **Charts**: Chart.js for data visualization

### 3. Chrome Extension

- **Location**: `chrome-extension/`
- **Manifest**: V3
- **Features**: Real-time page analysis and text selection analysis

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Chrome browser (for extension)

### Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd safedose-ai/backend
   ```

2. **Create virtual environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment**:

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Run the backend**:
   ```bash
   python -m app.main
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd safedose-ai/frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

### Chrome Extension Setup

1. **Open Chrome** and go to `chrome://extensions/`

2. **Enable Developer mode**

3. **Click "Load unpacked"** and select the `safedose-ai/chrome-extension/` directory

4. **The extension will appear** in your extensions list

## 📁 Project Structure

```
safedose-ai/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # FastAPI app initialization
│   │   ├── main.py              # Application entry point
│   │   ├── models/
│   │   │   ├── database.py      # SQLAlchemy models
│   │   │   └── ai_models.py     # Pydantic schemas
│   │   ├── api/
│   │   │   └── endpoints.py     # API routes
│   │   ├── services/
│   │   │   ├── misinformation_detector.py
│   │   │   ├── persuasion_engine.py
│   │   │   └── trusted_messenger.py
│   │   └── utils/
│   │       └── helpers.py       # Utility functions
│   ├── requirements.txt         # Python dependencies
│   └── env.example             # Environment template
├── chrome-extension/
│   ├── manifest.json           # Extension manifest
│   ├── content-script.js       # Page analysis script
│   ├── background.js           # Background service worker
│   ├── popup.html              # Extension popup
│   ├── popup.js                # Popup functionality
│   └── styles.css              # Extension styles
├── frontend/
│   ├── public/
│   │   └── index.html          # Main HTML file
│   ├── src/
│   │   ├── App.js              # Main React component
│   │   ├── components/
│   │   │   ├── Dashboard.js    # Landing page
│   │   │   ├── TextAnalyzer.js # Analysis interface
│   │   │   └── Results.js      # Results display
│   │   └── index.js            # React entry point
│   └── package.json            # Node.js dependencies
└── README.md                   # This file
```

## 🔧 API Endpoints

### Core Endpoints

- `POST /api/v1/analyze` - Full text analysis
- `POST /api/v1/detect-misinformation` - Misinformation detection only
- `POST /api/v1/analyze-persuasion` - Persuasion analysis only
- `POST /api/v1/get-trusted-alternatives` - Get trusted sources
- `GET /api/v1/health` - Health check

### Request Format

```json
{
  "text": "Text to analyze...",
  "source_url": "https://example.com/article",
  "user_id": 123
}
```

### Response Format

```json
{
  "analysis_id": 1,
  "misinformation_score": 0.25,
  "persuasion_score": 0.45,
  "trust_score": 0.75,
  "analysis_result": "Analysis complete...",
  "recommendations": [
    "Verify facts from multiple sources",
    "Consider the source credibility"
  ],
  "created_at": "2024-01-01T12:00:00Z"
}
```

## 🎯 Usage Examples

### Web Interface

1. Visit `http://localhost:3000`
2. Click "Start Analysis"
3. Paste or type text to analyze
4. View detailed results and recommendations

### Chrome Extension

1. Install the extension
2. Browse any webpage
3. Select text for quick analysis
4. View real-time analysis results

### API Integration

```python
import requests

response = requests.post('http://localhost:8000/api/v1/analyze', json={
    'text': 'Your text here...',
    'source_url': 'https://example.com'
})

results = response.json()
print(f"Trust Score: {results['trust_score']:.2%}")
```

## 🔒 Security Features

- Input sanitization and validation
- Rate limiting (configurable)
- CORS protection
- Environment-based configuration
- Secure API key management

## 🧪 Testing

### Backend Tests

```bash
cd backend
python -m pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment

1. Set up production database (PostgreSQL recommended)
2. Configure environment variables
3. Use Gunicorn or similar WSGI server
4. Set up reverse proxy (Nginx)

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy build/ directory to your web server
```

### Chrome Extension

1. Build the extension
2. Submit to Chrome Web Store
3. Or distribute as unpacked extension

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- React for the frontend framework
- Chart.js for data visualization
- Lucide React for beautiful icons

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Email: support@safedose.ai
- Documentation: https://docs.safedose.ai

---

**SafeDose.ai** - Empowering digital literacy through AI 🚀
