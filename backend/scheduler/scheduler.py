from datetime import datetime, timedelta
from typing import List, Optional
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from sqlalchemy import select
from config.database import SessionLocal
from model import models
import itertools

scheduler = BackgroundScheduler()
_worker_cycle_ids = None  # round-robin worker IDs


def get_worker_ids(db: Session) -> List[int]:
    """Return all worker IDs from the database."""
    return db.execute(select(models.Worker.id)).scalars().all()


def init_worker_cycle(db: Session):
    """Initialize the round-robin cycle of worker IDs."""
    global _worker_cycle_ids
    worker_ids = get_worker_ids(db)
    if worker_ids:
        _worker_cycle_ids = itertools.cycle(worker_ids)
    else:
        _worker_cycle_ids = None


def get_next_worker_id(db: Session) -> Optional[int]:
    """Return the next worker ID in round-robin fashion."""
    global _worker_cycle_ids

    if _worker_cycle_ids is None:
        init_worker_cycle(db)

    try:
        return next(_worker_cycle_ids) if _worker_cycle_ids else None
    except StopIteration:
        init_worker_cycle(db)
        return None


def run_scheduler_job():
    print("Running maintenance scheduler job...")
    with SessionLocal() as db:
        now = datetime.utcnow()

        # Fetch all plans due
        plans = db.execute(
            select(models.MaintenancePlan)
            .where(models.MaintenancePlan.next_due <= now)
        ).scalars().all()

        for plan in plans:

            # Ensure asset exists
            asset = db.get(models.Asset, plan.asset_id)
            if not asset:
                print(f"Skipping plan {plan.id}: asset not found")
                continue

            # Assign next worker by ID
            worker_id = get_next_worker_id(db)

            # Create a new task
            new_task = models.Task(
                plan_id=plan.id,
                asset_id=plan.asset_id,
                assigned_to=worker_id,
                due_ts=plan.next_due,
                status="PENDING",
                notes=None,
            )

            db.add(new_task)

            # Update next_due
            plan.next_due = plan.next_due + timedelta(days=plan.frequency_days)

        db.commit()


def start_scheduler():
    scheduler.add_job(
        run_scheduler_job,
        "interval",
        days=1,
        id="maintenance_scheduler",
        replace_existing=True,
    )
    scheduler.start()
    print("Scheduler started.")