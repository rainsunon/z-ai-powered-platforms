"""
Vercel serverless function entry point for FastAPI application.

This file serves as the entry point for Vercel deployment.
"""

import os
import sys

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.interface.main import app

# Vercel expects a handler function
handler = app

# For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
