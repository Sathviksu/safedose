"""
Persuasion technique analysis service for SafeDose.ai
"""

import re
from typing import List
from app.models.ai_models import PersuasionAnalysisResult

class PersuasionEngine:
    def __init__(self):
        # Persuasion techniques and their patterns
        self.persuasion_techniques = {
            'emotional_appeal': [
                r'\b(fear|scary|terrifying|horrible|disaster)\b',
                r'\b(hope|dream|amazing|wonderful|fantastic)\b',
                r'\b(anger|outrage|furious|mad|angry)\b',
                r'\b(sad|heartbreaking|tragic|devastating)\b'
            ],
            'logical_appeal': [
                r'\b(because|therefore|thus|consequently|as a result)\b',
                r'\b(evidence|proof|data|statistics|research)\b',
                r'\b(logic|reason|rational|sensible)\b',
                r'\b(if.*then|when.*then|since.*then)\b'
            ],
            'credibility_appeal': [
                r'\b(expert|authority|scientist|doctor|professor)\b',
                r'\b(study|research|university|institution)\b',
                r'\b(experience|years|qualified|certified)\b',
                r'\b(trusted|reliable|proven|established)\b'
            ],
            'social_proof': [
                r'\b(everyone|everybody|most people|many people)\b',
                r'\b(trending|popular|viral|shared)\b',
                r'\b(join|follow|community|group)\b',
                r'\b(recommended|endorsed|approved)\b'
            ],
            'scarcity': [
                r'\b(limited|exclusive|rare|unique|only)\b',
                r'\b(last chance|final|ending|expiring)\b',
                r'\b(while supplies last|first come first serve)\b',
                r'\b(one time|special offer|limited time)\b'
            ],
            'authority': [
                r'\b(official|government|authority|regulatory)\b',
                r'\b(required|mandatory|must|should)\b',
                r'\b(compliance|regulation|policy|law)\b',
                r'\b(approved|certified|licensed|authorized)\b'
            ]
        }
        
    async def analyze(self, text: str) -> PersuasionAnalysisResult:
        """
        Analyze persuasion techniques in the given text.
        """
        text_lower = text.lower()
        
        # Analyze each persuasion technique
        techniques_detected = []
        emotional_appeal = 0
        logical_appeal = 0
        credibility_appeal = 0
        
        for technique, patterns in self.persuasion_techniques.items():
            technique_matches = 0
            
            for pattern in patterns:
                matches = re.findall(pattern, text_lower, re.IGNORECASE)
                technique_matches += len(matches)
            
            if technique_matches > 0:
                techniques_detected.append(f"{technique}: {technique_matches} instances")
                
                # Track specific appeal types
                if technique == 'emotional_appeal':
                    emotional_appeal = technique_matches
                elif technique == 'logical_appeal':
                    logical_appeal = technique_matches
                elif technique == 'credibility_appeal':
                    credibility_appeal = technique_matches
        
        # Calculate overall persuasion score
        total_words = len(text.split())
        total_techniques = sum(len(re.findall(pattern, text_lower, re.IGNORECASE)) 
                             for patterns in self.persuasion_techniques.values() 
                             for pattern in patterns)
        
        persuasion_score = min(1.0, total_techniques / max(total_words / 10, 1))
        
        # Normalize appeal scores
        max_possible = total_words / 20  # Rough estimate
        emotional_appeal = min(1.0, emotional_appeal / max(max_possible, 1))
        logical_appeal = min(1.0, logical_appeal / max(max_possible, 1))
        credibility_appeal = min(1.0, credibility_appeal / max(max_possible, 1))
        
        return PersuasionAnalysisResult(
            score=persuasion_score,
            techniques_detected=techniques_detected,
            emotional_appeal=emotional_appeal,
            logical_appeal=logical_appeal,
            credibility_appeal=credibility_appeal
        )
    
    def get_persuasion_insights(self, result: PersuasionAnalysisResult) -> List[str]:
        """
        Generate insights about detected persuasion techniques.
        """
        insights = []
        
        if result.score > 0.7:
            insights.append("High use of persuasion techniques detected")
        
        if result.emotional_appeal > 0.5:
            insights.append("Strong emotional appeal - consider the emotional manipulation")
        
        if result.logical_appeal > 0.5:
            insights.append("Logical arguments present - verify the reasoning")
        
        if result.credibility_appeal > 0.5:
            insights.append("Authority/credibility appeals - verify the sources")
        
        if len(result.techniques_detected) > 5:
            insights.append("Multiple persuasion techniques used - be cautious")
        
        return insights
