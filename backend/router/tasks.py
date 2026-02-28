from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from config.database import SessionLocal
from schema import schemas
from services import crud

router = APIRouter(prefix="/tasks", tags=["Tasks"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    print(task)
    created = crud.create_task(db, task)
    if created == "PLAN_NOT_FOUND":
        raise HTTPException(status_code=400, detail="Plan does not exist")
    if created == "ASSET_NOT_FOUND":
        raise HTTPException(status_code=400, detail="Asset does not exist")
    print("hello")
    return created


@router.get("/", response_model=List[schemas.TaskResponse])
def list_tasks(db: Session = Depends(get_db)):
    return crud.get_tasks(db)


@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    updated = crud.update_task(db, task_id, task)

    if updated == "WORKER_NOT_FOUND":
        raise HTTPException(status_code=400, detail="Worker does not exist")

    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")

    return updated


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_task(db, task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"detail": "Task deleted"}