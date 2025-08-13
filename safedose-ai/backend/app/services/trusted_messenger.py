"""
Trusted messenger service for SafeDose.ai
"""

import re
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse
from app.models.ai_models import TrustedMessengerResult

class TrustedMessenger:
    def __init__(self):
        # Trusted fact-checking sources
        self.fact_check_sources = [
            'snopes.com',
            'factcheck.org',
            'politifact.com',
            'reuters.com/fact-check',
            'ap.org/fact-check',
            'bbc.com/news/fact-check',
            'fullfact.org',
            'leadstories.com'
        ]
        
        # Trusted news sources
        self.trusted_news_sources = [
            'reuters.com',
            'ap.org',
            'bbc.com',
            'npr.org',
            'pbs.org',
            'theguardian.com',
            'nytimes.com',
            'washingtonpost.com',
            'wsj.com',
            'economist.com'
        ]
        
        # Academic and research sources
        self.academic_sources = [
            'scholar.google.com',
            'pubmed.ncbi.nlm.nih.gov',
            'arxiv.org',
            'researchgate.net',
            'jstor.org',
            'sciencedirect.com'
        ]
        
        # Government sources
        self.government_sources = [
            'gov',
            'mil',
            'edu',
            'who.int',
            'cdc.gov',
            'nih.gov',
            'nasa.gov'
        ]
        
    async def get_alternatives(self, text: str, source_url: Optional[str] = None) -> TrustedMessengerResult:
        """
        Get trusted alternatives and fact-checking resources for the given text.
        """
        # Extract key topics from text
        topics = self._extract_topics(text)
        
        # Analyze source credibility
        source_verification = self._verify_source(source_url) if source_url else {}
        
        # Generate alternative sources
        alternative_sources = self._get_alternative_sources(topics)
        
        # Generate fact-check links
        fact_check_links = self._get_fact_check_links(topics)
        
        # Calculate trust score
        trust_score = self._calculate_trust_score(source_verification, len(alternative_sources))
        
        return TrustedMessengerResult(
            trust_score=trust_score,
            source_verification=source_verification,
            alternative_sources=alternative_sources,
            fact_check_links=fact_check_links
        )
    
    def _extract_topics(self, text: str) -> List[str]:
        """
        Extract key topics from text for fact-checking.
        """
        # Simple keyword extraction (in production, use NLP)
        keywords = [
            'covid', 'vaccine', 'election', 'climate', 'health', 'medicine',
            'politics', 'economy', 'science', 'technology', 'education'
        ]
        
        text_lower = text.lower()
        found_topics = [keyword for keyword in keywords if keyword in text_lower]
        
        return found_topics[:5]  # Limit to 5 topics
    
    def _verify_source(self, url: str) -> Dict[str, Any]:
        """
        Verify the credibility of a source URL.
        """
        try:
            parsed_url = urlparse(url)
            domain = parsed_url.netloc.lower()
            
            verification = {
                'domain': domain,
                'is_fact_check': domain in self.fact_check_sources,
                'is_trusted_news': domain in self.trusted_news_sources,
                'is_academic': domain in self.academic_sources,
                'is_government': any(gov in domain for gov in self.government_sources),
                'credibility_score': 0.0
            }
            
            # Calculate credibility score
            if verification['is_fact_check']:
                verification['credibility_score'] = 1.0
            elif verification['is_trusted_news']:
                verification['credibility_score'] = 0.8
            elif verification['is_academic']:
                verification['credibility_score'] = 0.9
            elif verification['is_government']:
                verification['credibility_score'] = 0.85
            else:
                verification['credibility_score'] = 0.3
            
            return verification
            
        except Exception:
            return {
                'domain': 'unknown',
                'is_fact_check': False,
                'is_trusted_news': False,
                'is_academic': False,
                'is_government': False,
                'credibility_score': 0.0
            }
    
    def _get_alternative_sources(self, topics: List[str]) -> List[str]:
        """
        Get alternative trusted sources for the given topics.
        """
        sources = []
        
        for topic in topics:
            if topic in ['covid', 'vaccine', 'health', 'medicine']:
                sources.extend([
                    'https://www.who.int/health-topics',
                    'https://www.cdc.gov/coronavirus',
                    'https://www.nih.gov/health-information'
                ])
            elif topic in ['election', 'politics']:
                sources.extend([
                    'https://www.reuters.com/politics',
                    'https://www.ap.org/politics',
                    'https://www.bbc.com/news/politics'
                ])
            elif topic in ['climate', 'science']:
                sources.extend([
                    'https://climate.nasa.gov',
                    'https://www.ipcc.ch',
                    'https://www.nature.com/climate'
                ])
            elif topic in ['economy', 'technology']:
                sources.extend([
                    'https://www.economist.com',
                    'https://www.ft.com',
                    'https://www.wsj.com/tech'
                ])
        
        # Remove duplicates and limit results
        unique_sources = list(set(sources))
        return unique_sources[:10]
    
    def _get_fact_check_links(self, topics: List[str]) -> List[str]:
        """
        Get relevant fact-checking links for the given topics.
        """
        base_urls = [
            'https://www.snopes.com',
            'https://www.factcheck.org',
            'https://www.politifact.com',
            'https://www.reuters.com/fact-check'
        ]
        
        # In a real implementation, you would search these sites for specific topics
        # For now, return the base URLs
        return base_urls
    
    def _calculate_trust_score(self, source_verification: Dict[str, Any], num_alternatives: int) -> float:
        """
        Calculate overall trust score based on source verification and available alternatives.
        """
        base_score = source_verification.get('credibility_score', 0.0)
        
        # Boost score if many alternative sources are available
        alternative_boost = min(0.2, num_alternatives * 0.02)
        
        return min(1.0, base_score + alternative_boost)
