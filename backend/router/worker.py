from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from config.database import SessionLocal
from schema import schemas
from services import crud

router = APIRouter(prefix="/workers", tags=["Workers"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.WorkerResponse)
def create_worker(worker: schemas.WorkerCreate, db: Session = Depends(get_db)):
    return crud.create_worker(db, worker)


@router.get("/", response_model=List[schemas.WorkerResponse])
def list_workers(db: Session = Depends(get_db)):
    return crud.get_workers(db)


@router.put("/{worker_id}", response_model=schemas.WorkerResponse)
def update_worker(worker_id: int, worker: schemas.WorkerUpdate, db: Session = Depends(get_db)):
    updated = crud.update_worker(db, worker_id, worker)
    if not updated:
        raise HTTPException(status_code=404, detail="Worker not found")
    return updated