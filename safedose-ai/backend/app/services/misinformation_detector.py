"""
Misinformation detection service for SafeDose.ai
"""

import re
from typing import List
from app.models.ai_models import MisinformationDetectionResult

class MisinformationDetector:
    def __init__(self):
        # Common misinformation patterns
        self.misinformation_patterns = [
            r'\b(conspiracy|cover.?up|hidden|secret|they don\'t want you to know)\b',
            r'\b(100%|guaranteed|proven|scientific fact|undeniable)\b',
            r'\b(urgent|act now|limited time|exclusive|secret)\b',
            r'\b(big pharma|mainstream media|establishment|elite)\b',
            r'\b(natural cure|miracle|breakthrough|revolutionary)\b',
            r'\b(government|authorities|experts say|studies show)\b',
            r'\b(clickbait|shocking|you won\'t believe|amazing)\b'
        ]
        
        # Fact-checking keywords
        self.fact_check_keywords = [
            'fact-check', 'verified', 'peer-reviewed', 'study', 'research',
            'evidence', 'data', 'statistics', 'source'
        ]
        
    async def detect(self, text: str) -> MisinformationDetectionResult:
        """
        Detect misinformation in the given text.
        """
        text_lower = text.lower()
        
        # Count misinformation patterns
        pattern_matches = 0
        detected_patterns = []
        
        for pattern in self.misinformation_patterns:
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            if matches:
                pattern_matches += len(matches)
                detected_patterns.extend(matches)
        
        # Count fact-checking keywords
        fact_check_count = sum(1 for keyword in self.fact_check_keywords 
                              if keyword in text_lower)
        
        # Calculate misinformation score (0-1, higher = more likely misinformation)
        total_words = len(text.split())
        pattern_density = pattern_matches / max(total_words, 1)
        fact_check_ratio = fact_check_count / max(total_words, 1)
        
        # Base score from pattern density
        base_score = min(pattern_density * 10, 1.0)
        
        # Adjust score based on fact-checking presence
        adjusted_score = max(0, base_score - fact_check_ratio * 0.3)
        
        # Calculate confidence based on text length and pattern strength
        confidence = min(0.9, 0.3 + (pattern_matches * 0.1) + (len(text) / 1000 * 0.2))
        
        # Generate explanation
        explanation = self._generate_explanation(detected_patterns, adjusted_score, fact_check_count)
        
        return MisinformationDetectionResult(
            score=adjusted_score,
            confidence=confidence,
            detected_patterns=detected_patterns[:10],  # Limit to first 10
            explanation=explanation
        )
    
    def _generate_explanation(self, patterns: List[str], score: float, fact_check_count: int) -> str:
        """
        Generate human-readable explanation of the detection results.
        """
        if score < 0.3:
            return "Low misinformation risk detected. Text appears to be factual and well-sourced."
        elif score < 0.6:
            return f"Moderate misinformation risk. Detected {len(patterns)} suspicious patterns."
        else:
            return f"High misinformation risk. Detected {len(patterns)} suspicious patterns. Verify facts from multiple sources."
