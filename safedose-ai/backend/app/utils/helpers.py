"""
Helper utility functions for SafeDose.ai
"""

import re
import hashlib
from typing import List, Dict, Any
from datetime import datetime

def clean_text(text: str) -> str:
    """
    Clean and normalize text for analysis.
    """
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s\.\,\!\?\-\:\;]', '', text)
    
    return text

def extract_keywords(text: str, max_keywords: int = 10) -> List[str]:
    """
    Extract key keywords from text.
    """
    # Remove common stop words
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    }
    
    # Split text into words and filter
    words = re.findall(r'\b\w+\b', text.lower())
    keywords = [word for word in words if word not in stop_words and len(word) > 2]
    
    # Count frequency
    word_count = {}
    for word in keywords:
        word_count[word] = word_count.get(word, 0) + 1
    
    # Sort by frequency and return top keywords
    sorted_keywords = sorted(word_count.items(), key=lambda x: x[1], reverse=True)
    return [word for word, count in sorted_keywords[:max_keywords]]

def calculate_similarity(text1: str, text2: str) -> float:
    """
    Calculate simple text similarity using keyword overlap.
    """
    keywords1 = set(extract_keywords(text1))
    keywords2 = set(extract_keywords(text2))
    
    if not keywords1 or not keywords2:
        return 0.0
    
    intersection = keywords1.intersection(keywords2)
    union = keywords1.union(keywords2)
    
    return len(intersection) / len(union)

def generate_analysis_id(text: str, user_id: int = None) -> str:
    """
    Generate a unique analysis ID.
    """
    timestamp = datetime.utcnow().isoformat()
    text_hash = hashlib.md5(text.encode()).hexdigest()[:8]
    user_part = f"u{user_id}" if user_id else "anon"
    
    return f"analysis_{user_part}_{text_hash}_{timestamp}"

def format_score(score: float) -> str:
    """
    Format a score as a percentage string.
    """
    return f"{score * 100:.1f}%"

def get_risk_level(score: float) -> str:
    """
    Get risk level based on score.
    """
    if score < 0.3:
        return "Low"
    elif score < 0.6:
        return "Medium"
    else:
        return "High"

def validate_url(url: str) -> bool:
    """
    Basic URL validation.
    """
    url_pattern = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    return bool(url_pattern.match(url))

def sanitize_input(text: str) -> str:
    """
    Sanitize user input to prevent injection attacks.
    """
    # Remove potentially dangerous characters
    text = re.sub(r'[<>"\']', '', text)
    
    # Limit length
    if len(text) > 10000:
        text = text[:10000]
    
    return text.strip()
