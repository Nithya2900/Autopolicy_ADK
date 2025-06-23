
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from orchestration.orchestrator import run_pipeline
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

@app.post("/process-claim")
async def process_claim(request: Request):
    claim_data = await request.json()
    result = run_pipeline(claim_data)
    return result


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
