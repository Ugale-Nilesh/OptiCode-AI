from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.analyze import router as analyze_router

app = FastAPI(title="OptiCode AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Never leak raw exception details to the client -- log server-side only.
    print(f"Unhandled exception on {request.url.path}: {exc.__class__.__name__}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred while processing your request. Please try again."},
    )


@app.get("/api/health")
def health():
    return {"status": "ok"}


app.include_router(analyze_router, prefix="/api")