from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from config.database import Base
import enum
from sqlalchemy.types import Enum
from sqlalchemy import JSON


class AssetStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    DECOMMISSIONED = "DECOMMISSIONED"


class TaskStatus(str, enum.Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"
    SKIPPED = "SKIPPED"


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_tag = Column(String, unique=True, index=True)
    type = Column(String)
    location = Column(String)
    vendor = Column(String)
    installed_on = Column(Date)
    status = Column(Enum(AssetStatus), default=AssetStatus.ACTIVE)


class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    skills = Column(JSON, nullable=False, default=[])


class MaintenancePlan(Base):
    __tablename__ = "maintenance_plans"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    frequency_days = Column(Integer, nullable=False)
    next_due = Column(DateTime, nullable=False)
    instructions = Column(String, nullable=False)

    asset = relationship("Asset")



class TaskStatus(str, enum.Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"
    SKIPPED = "SKIPPED"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("maintenance_plans.id"), nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("workers.id"), nullable=True)
    due_ts = Column(DateTime, nullable=False)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING)
    notes = Column(String, nullable=True)

    plan = relationship("MaintenancePlan")
    asset = relationship("Asset")
    worker = relationship("Worker")