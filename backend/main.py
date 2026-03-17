import asyncio
import io
import os
import time
import random
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    import numpy as np
    from PIL import Image
    HAS_IMAGE_LIBS = True
except ImportError:
    HAS_IMAGE_LIBS = False
    print("[VERDISORT] Pillow/numpy not found. Running in pure simulation mode.")

app = FastAPI(title="VERDISORT API", description="AI Enabled Waste Segregation System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── 7 Classes from the notebook ───────────────────────────────────────────────
CLASS_NAMES = [
    "Cardboard",
    "Food / Organics / BIO",
    "Glass",
    "Metal",
    "Paper",
    "Plastic",
    "Textile Trash",
]

IMG_SIZE = (224, 224)

# ─── Try to load model ─────────────────────────────────────────────────────────
model = None
MODEL_PATH = os.path.join(os.path.dirname(__file__), "waste_model.h5")

def try_load_model():
    """Try loading the saved Keras/H5 model file if it exists."""
    global model
    if os.path.isfile(MODEL_PATH):
        try:
            import tensorflow as tf
            model = tf.keras.models.load_model(MODEL_PATH)
            print(f"[VERDISORT] Model loaded from {MODEL_PATH}")
        except Exception as e:
            print(f"[VERDISORT] Failed to load model: {e}")
            model = None
    else:
        print(f"[VERDISORT] No model file found at {MODEL_PATH}. Using simulated inference.")

try_load_model()


# ─── Response Schema ───────────────────────────────────────────────────────────
class ClassificationResult(BaseModel):
    label: str
    confidence: float
    processing_time_ms: int
    all_scores: dict[str, float]


@app.get("/")
def read_root():
    mode = "AI Model" if model is not None else "Simulation"
    return {"status": "Active", "message": "VERDISORT API is running.", "inference_mode": mode}


@app.post("/api/classify", response_model=ClassificationResult)
async def classify_image(file: UploadFile = File(...)):
    """
    Classify uploaded waste image via real DenseNet121 model (if loaded)
    or simulated inference (if no model file exists).
    """
    start = time.time()

    # Read image bytes
    contents = await file.read()

    if HAS_IMAGE_LIBS and model is not None:
        # ── Real inference ────────────────────────────────────────────────────
        img = Image.open(io.BytesIO(contents)).convert("RGB").resize(IMG_SIZE)
        img_array = np.array(img, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)          # (1, 224, 224, 3)

        preds = model.predict(img_array, verbose=0)[0]         # shape (7,)
        top_idx = int(np.argmax(preds))
        label = CLASS_NAMES[top_idx]
        confidence = float(round(float(preds[top_idx]), 4))
        all_scores = {CLASS_NAMES[i]: float(round(float(preds[i]), 4)) for i in range(len(CLASS_NAMES))}

    elif HAS_IMAGE_LIBS:
        # ── Simulated with numpy dirichlet ─────────────────────────────────────
        await asyncio.sleep(1.0)
        raw = np.random.dirichlet(np.ones(len(CLASS_NAMES)) * 2)
        top_idx = int(np.argmax(raw))
        label = CLASS_NAMES[top_idx]
        confidence = float(round(float(raw[top_idx]), 4))
        all_scores = {CLASS_NAMES[i]: float(round(float(raw[i]), 4)) for i in range(len(CLASS_NAMES))}

    else:
        # ── Pure Python fallback (no numpy/PIL) ───────────────────────────────
        await asyncio.sleep(1.0)
        weights = [random.uniform(0.01, 1.0) for _ in CLASS_NAMES]
        total = sum(weights)
        raw_f = [w / total for w in weights]
        top_idx = raw_f.index(max(raw_f))
        label = CLASS_NAMES[top_idx]
        confidence = round(raw_f[top_idx], 4)
        all_scores = {CLASS_NAMES[i]: round(raw_f[i], 4) for i in range(len(CLASS_NAMES))}

    elapsed_ms = int((time.time() - start) * 1000)

    return ClassificationResult(
        label=label,
        confidence=confidence,
        processing_time_ms=elapsed_ms,
        all_scores=all_scores,
    )
