from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from config.database import SessionLocal
from schema import schemas
from services import crud


router = APIRouter(prefix="/maintenance-plans", tags=["Maintenance Plans"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.MaintenancePlanResponse)
def create_plan(plan: schemas.MaintenancePlanCreate, db: Session = Depends(get_db)):
    created = crud.create_maintenance_plan(db, plan)
    if not created:
        raise HTTPException(status_code=400, detail="Asset does not exist")
    return created


@router.get("/", response_model=List[schemas.MaintenancePlanResponse])
def list_plans(db: Session = Depends(get_db)):
    return crud.get_maintenance_plans(db)


@router.get("/{plan_id}", response_model=schemas.MaintenancePlanResponse)
def get_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = crud.get_maintenance_plan(db, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan


@router.put("/{plan_id}", response_model=schemas.MaintenancePlanResponse)
def update_plan(plan_id: int, plan: schemas.MaintenancePlanUpdate, db: Session = Depends(get_db)):
    updated = crud.update_maintenance_plan(db, plan_id, plan)
    if not updated:
        raise HTTPException(status_code=404, detail="Plan not found")
    return updated


@router.delete("/{plan_id}")
def delete_plan(plan_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_maintenance_plan(db, plan_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Plan not found")
    return {"detail": "Plan deleted"}