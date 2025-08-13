"""
API endpoints for SafeDose.ai
"""

from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from pydantic import BaseModel

# Simple request/response models for now
class TextAnalysisRequest(BaseModel):
    text: str
    source_url: str = ""

class TextAnalysisResponse(BaseModel):
    analysis_id: int
    misinformation_score: float
    persuasion_score: float
    trust_score: float
    analysis_result: str
    recommendations: List[str]
    created_at: datetime

class MisinformationDetectionResult(BaseModel):
    score: float
    confidence: float
    explanation: str

class PersuasionAnalysisResult(BaseModel):
    score: float
    techniques: List[str]
    explanation: str

class TrustedMessengerResult(BaseModel):
    trust_score: float
    alternatives: List[str]
    fact_check_links: List[str]

router = APIRouter()

@router.post("/analyze", response_model=TextAnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    """
    Analyze text for misinformation, persuasion techniques, and provide trusted alternatives.
    """
    try:
        # Simple mock analysis for now
        text_length = len(request.text)
        word_count = len(request.text.split())
        
        # Mock scores based on text characteristics
        misinformation_score = min(0.3 + (text_length % 100) / 1000, 0.9)
        persuasion_score = min(0.2 + (word_count % 50) / 500, 0.8)
        trust_score = max(0.1, 1 - (misinformation_score + persuasion_score) / 2)
        
        # Generate recommendations
        recommendations = []
        if misinformation_score > 0.7:
            recommendations.append("High misinformation risk detected. Verify facts from multiple sources.")
        if persuasion_score > 0.8:
            recommendations.append("Strong persuasion techniques detected. Consider the intent behind this message.")
        if trust_score < 0.5:
            recommendations.append("Low trust score. Seek information from verified sources.")
        
        if not recommendations:
            recommendations.append("Text appears to be relatively trustworthy. Always verify important information.")
        
        return TextAnalysisResponse(
            analysis_id=1,
            misinformation_score=misinformation_score,
            persuasion_score=persuasion_score,
            trust_score=trust_score,
            analysis_result=f"Analysis complete. Misinformation risk: {misinformation_score:.2f}, Persuasion techniques: {persuasion_score:.2f}",
            recommendations=recommendations,
            created_at=datetime.utcnow()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/detect-misinformation", response_model=MisinformationDetectionResult)
async def detect_misinformation(request: TextAnalysisRequest):
    """
    Detect misinformation in text.
    """
    try:
        # Mock misinformation detection
        score = min(0.3 + (len(request.text) % 100) / 1000, 0.9)
        return MisinformationDetectionResult(
            score=score,
            confidence=0.7,
            explanation="Mock analysis based on text characteristics"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Misinformation detection failed: {str(e)}")

@router.post("/analyze-persuasion", response_model=PersuasionAnalysisResult)
async def analyze_persuasion(request: TextAnalysisRequest):
    """
    Analyze persuasion techniques in text.
    """
    try:
        # Mock persuasion analysis
        score = min(0.2 + (len(request.text.split()) % 50) / 500, 0.8)
        techniques = ["emotional appeal", "authority"] if score > 0.5 else ["neutral"]
        return PersuasionAnalysisResult(
            score=score,
            techniques=techniques,
            explanation="Mock analysis of persuasion techniques"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Persuasion analysis failed: {str(e)}")

@router.post("/get-trusted-alternatives", response_model=TrustedMessengerResult)
async def get_trusted_alternatives(request: TextAnalysisRequest):
    """
    Get trusted alternatives and fact-checking resources.
    """
    try:
        # Mock trusted alternatives
        trust_score = max(0.1, 1 - (len(request.text) % 100) / 1000)
        return TrustedMessengerResult(
            trust_score=trust_score,
            alternatives=["https://www.reuters.com", "https://www.ap.org", "https://www.factcheck.org"],
            fact_check_links=["https://www.snopes.com", "https://www.politifact.com"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trusted alternatives lookup failed: {str(e)}")

@router.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy", "message": "SafeDose.ai API is running"}
