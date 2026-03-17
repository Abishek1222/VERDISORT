import asyncio
import random
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="VERDISORT API", description="AI Enabled Waste Segregation System API")

# Setup CORS to allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClassificationResult(BaseModel):
    label: str
    confidence: float
    processing_time_ms: int

@app.get("/")
def read_root():
    return {"status": "Active", "message": "VERDISORT API is running."}

@app.post("/api/classify", response_model=ClassificationResult)
async def classify_image(file: UploadFile = File(...)):
    """
    Simulated AI classification endpoint.
    Retrieves an image and returns a dummy classification.
    
    The ML team should replace this logic with the actual model inference.
    """
    # Simulate processing delay (e.g., cloud AI communication, inference, etc.)
    processing_time_ms = random.randint(1500, 3500)
    await asyncio.sleep(processing_time_ms / 1000.0)
    
    categories = ["Biodegradable", "Non-biodegradable", "Metal"]
    
    # Simulate a result
    label = random.choice(categories)
    confidence = round(random.uniform(0.75, 0.99), 2)
    
    return ClassificationResult(
        label=label,
        confidence=confidence,
        processing_time_ms=processing_time_ms
    )
