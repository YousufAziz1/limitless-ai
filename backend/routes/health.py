"""
GET /api/health — Model status & system info
GET /api/subjects — Available subjects
"""

from fastapi import APIRouter
from services.ollama_service import check_ollama_health
import os, platform

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    """
    Returns Ollama/model status and system info.
    Used by frontend to show offline AI indicator.
    """
    status = await check_ollama_health()

    return {
        **status,
        "platform": platform.system(),
        "python": platform.python_version(),
        "message": "Limitless AI is running — Offline AI School for Every Child",
    }


@router.get("/subjects")
async def get_subjects():
    """Returns available subjects for the subjects page."""
    return [
        {
            "id": "math",
            "name": "Mathematics",
            "name_hi": "गणित",
            "emoji": "📐",
            "color": "#FF6B1A",
            "description": "Algebra, Geometry, Calculus and more",
            "description_hi": "बीजगणित, ज्यामिति, कैलकुलस और अधिक",
            "topics": ["Algebra", "Geometry", "Trigonometry", "Calculus", "Statistics", "Probability"],
        },
        {
            "id": "science",
            "name": "Science",
            "name_hi": "विज्ञान",
            "emoji": "🔬",
            "color": "#22C55E",
            "description": "Physics, Chemistry and Biology",
            "description_hi": "भौतिकी, रसायन और जीव विज्ञान",
            "topics": ["Physics", "Chemistry", "Biology", "Experiments", "Environment"],
        },
        {
            "id": "hindi",
            "name": "Hindi",
            "name_hi": "हिंदी",
            "emoji": "📖",
            "color": "#F5C842",
            "description": "Grammar, Literature and Writing",
            "description_hi": "व्याकरण, साहित्य और लेखन",
            "topics": ["Grammar", "Literature", "Essay Writing", "Poetry", "Comprehension"],
        },
        {
            "id": "english",
            "name": "English",
            "name_hi": "अंग्रेजी",
            "emoji": "🌐",
            "color": "#818CF8",
            "description": "Grammar, Reading and Writing skills",
            "description_hi": "व्याकरण, पठन और लेखन कौशल",
            "topics": ["Grammar", "Reading", "Writing", "Speaking", "Literature"],
        },
        {
            "id": "history",
            "name": "History & Civics",
            "name_hi": "इतिहास और नागरिक शास्त्र",
            "emoji": "🏛️",
            "color": "#F97316",
            "description": "Indian and World History, Civics",
            "description_hi": "भारतीय और विश्व इतिहास, नागरिक शास्त्र",
            "topics": ["Ancient India", "Modern India", "Freedom Movement", "World Wars", "Constitution"],
        },
        {
            "id": "geography",
            "name": "Geography",
            "name_hi": "भूगोल",
            "emoji": "🌍",
            "color": "#34D399",
            "description": "Physical and Human Geography",
            "description_hi": "भौतिक और मानव भूगोल",
            "topics": ["Physical Features", "Climate", "Agriculture", "Maps", "Natural Resources"],
        },
        {
            "id": "economics",
            "name": "Economics",
            "name_hi": "अर्थशास्त्र",
            "emoji": "📊",
            "color": "#60A5FA",
            "description": "Micro and Macro Economics, Indian Economy",
            "description_hi": "सूक्ष्म और स्थूल अर्थशास्त्र, भारतीय अर्थव्यवस्था",
            "topics": ["Demand & Supply", "National Income", "Banking", "Indian Economy", "Budget"],
        },
    ]
