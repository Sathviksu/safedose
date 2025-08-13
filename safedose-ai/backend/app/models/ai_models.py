"""
AI Model configurations and schemas for SafeDose.ai
"""

from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class TextAnalysisRequest(BaseModel):
    text: str
    source_url: Optional[str] = None
    user_id: Optional[int] = None

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
    detected_patterns: List[str]
    explanation: str

class PersuasionAnalysisResult(BaseModel):
    score: float
    techniques_detected: List[str]
    emotional_appeal: float
    logical_appeal: float
    credibility_appeal: float

class TrustedMessengerResult(BaseModel):
    trust_score: float
    source_verification: Dict[str, Any]
    alternative_sources: List[str]
    fact_check_links: List[str]

class AIModelConfig(BaseModel):
    model_name: str
    version: str
    parameters: Dict[str, Any]
    threshold_scores: Dict[str, float]
