from sqlalchemy.orm import Session
from schema import schemas
from model import models


def create_asset(db: Session, asset: schemas.AssetCreate):
    db_asset = models.Asset(**asset.model_dump())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset


# READ ALL
def get_assets(db: Session):
    return db.query(models.Asset).all()


# READ ONE
def get_asset(db: Session, asset_id: int):
    return db.query(models.Asset).filter(models.Asset.id == asset_id).first()


# UPDATE
def update_asset(db: Session, asset_id: int, asset_data: schemas.AssetUpdate):
    asset = get_asset(db, asset_id)
    if not asset:
        return None

    for key, value in asset_data.model_dump(exclude_unset=True).items():
        setattr(asset, key, value)

    db.commit()
    db.refresh(asset)
    return asset


# DELETE
def delete_asset(db: Session, asset_id: int):
    asset = get_asset(db, asset_id)
    if not asset:
        return None

    db.delete(asset)
    db.commit()
    return asset







# -------------------------
# MAINTENANCE PLAN CRUD
# -------------------------

def create_maintenance_plan(db: Session, plan: schemas.MaintenancePlanCreate):
    # Validate asset exists
    asset = db.query(models.Asset).filter(models.Asset.id == plan.asset_id).first()
    if not asset:
        return None  # handled in router

    db_plan = models.MaintenancePlan(**plan.model_dump())
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


def get_maintenance_plans(db: Session):
    return db.query(models.MaintenancePlan).all()


def get_maintenance_plan(db: Session, plan_id: int):
    return db.query(models.MaintenancePlan).filter(
        models.MaintenancePlan.id == plan_id
    ).first()


def update_maintenance_plan(db: Session, plan_id: int, plan_data: schemas.MaintenancePlanUpdate):
    plan = get_maintenance_plan(db, plan_id)
    if not plan:
        return None

    for key, value in plan_data.model_dump(exclude_unset=True).items():
        setattr(plan, key, value)

    db.commit()
    db.refresh(plan)
    return plan


def delete_maintenance_plan(db: Session, plan_id: int):
    plan = get_maintenance_plan(db, plan_id)
    if not plan:
        return None

    db.delete(plan)
    db.commit()
    return plan



#worker-crud

# -------------------------
# WORKER CRUD
# -------------------------

def create_worker(db: Session, worker: schemas.WorkerCreate):
    db_worker = models.Worker(**worker.model_dump())
    db.add(db_worker)
    db.commit()
    db.refresh(db_worker)
    return db_worker


def get_workers(db: Session):
    return db.query(models.Worker).all()


def get_worker(db: Session, worker_id: int):
    return db.query(models.Worker).filter(models.Worker.id == worker_id).first()


def update_worker(db: Session, worker_id: int, worker_data: schemas.WorkerUpdate):
    worker = get_worker(db, worker_id)
    if not worker:
        return None

    for key, value in worker_data.model_dump(exclude_unset=True).items():
        setattr(worker, key, value)

    db.commit()
    db.refresh(worker)
    return worker



#Task
# -------------------------
# TASK CRUD
# -------------------------
def create_task(db: Session, task: schemas.TaskCreate):
    """
    Create a new Task.
    - Validates plan and asset exist.
    - Validates worker exists if assigned.
    - Allows tasks with assigned_to=None.
    """
    "hiii"
    plan = db.query(models.MaintenancePlan).filter(
        models.MaintenancePlan.id == task.plan_id
    ).first()
    if not plan:
        return "PLAN_NOT_FOUND"

    asset = db.query(models.Asset).filter(
        models.Asset.id == task.asset_id
    ).first()
    if not asset:
        return "ASSET_NOT_FOUND"

    # Validate worker if assigned
    worker_id = getattr(task, "assigned_to", None)
    if worker_id is not None:
        worker = db.query(models.Worker).filter(
            models.Worker.id == worker_id
        ).first()
        if not worker:
            # Optional: automatically set assigned_to=None instead of failing
            worker_id = None

    # Create task
    print("hehehehehe")
    db_task = models.Task(
        plan_id=task.plan_id,
        asset_id=task.asset_id,
        assigned_to=worker_id,
        due_ts=task.due_ts,
        status=task.status,
        notes=getattr(task, "notes", None)
    )

    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def get_tasks(db: Session):
    return db.query(models.Task).all()


def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def update_task(db: Session, task_id: int, task_data: schemas.TaskUpdate):
    task = get_task(db, task_id)
    if not task:
        return None

    # Validate worker assignment
    if task_data.assigned_to is not None:
        worker = db.query(models.Worker).filter(
            models.Worker.id == task_data.assigned_to
        ).first()
        if not worker:
            return "WORKER_NOT_FOUND"

    for key, value in task_data.model_dump(exclude_unset=True).items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: int):
    task = get_task(db, task_id)
    if not task:
        return None

    db.delete(task)
    db.commit()
    return task