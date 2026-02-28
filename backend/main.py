from fastapi import FastAPI
from config.database import engine, Base
from scheduler import scheduler
from router import assests,maintenance_plans,worker,tasks
from fastapi.middleware.cors import CORSMiddleware


# Allow your frontend origin (Vite default: http://localhost:5173)
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",  # optional alternative
]


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Telecom Maintenance API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"], 
)


@app.get("/health")
def health():
    return {"status": "ok"}



@app.on_event("startup")
def startup_event():
    scheduler.start_scheduler()



app.include_router(assests.router, prefix="/api/v1")
app.include_router(maintenance_plans.router, prefix="/api/v1")
app.include_router(worker.router, prefix="/api/v1")
app.include_router(tasks.router, prefix="/api/v1")