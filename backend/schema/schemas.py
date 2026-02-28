from pydantic import BaseModel, Field
from datetime import date
from typing import Optional
from enum import Enum
from datetime import datetime
from typing import List
from pydantic import EmailStr

class AssetStatus(str, Enum):
    ACTIVE = "ACTIVE"
    DECOMMISSIONED = "DECOMMISSIONED"


class AssetBase(BaseModel):
    asset_tag: str = Field(..., example="ASSET-001")
    type: str
    location: str
    vendor: str
    installed_on: date
    status: AssetStatus = AssetStatus.ACTIVE


class AssetCreate(AssetBase):
    pass


class AssetUpdate(BaseModel):
    type: Optional[str]
    location: Optional[str]
    vendor: Optional[str]
    status: Optional[AssetStatus]


class AssetResponse(AssetBase):
    id: int

    class Config:
        from_attributes = True



class MaintenancePlanBase(BaseModel):
    asset_id: int
    frequency_days: int = Field(..., gt=0)
    next_due: datetime
    instructions: str


class MaintenancePlanCreate(MaintenancePlanBase):
    pass


class MaintenancePlanUpdate(BaseModel):
    frequency_days: Optional[int] = Field(None, gt=0)
    next_due: Optional[datetime]
    instructions: Optional[str]


class MaintenancePlanResponse(MaintenancePlanBase):
    id: int

    class Config:
        from_attributes = True


#workers
class WorkerBase(BaseModel):
    name: str
    email: EmailStr
    skills: List[str]


class WorkerCreate(WorkerBase):
    pass


class WorkerUpdate(BaseModel):
    name: Optional[str]
    skills: Optional[List[str]]


class WorkerResponse(WorkerBase):
    id: int

    class Config:
        from_attributes = True



class TaskStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"
    SKIPPED = "SKIPPED"



class TaskBase(BaseModel):
    plan_id: int
    asset_id: int
    assigned_to: Optional[int] = None
    due_ts: datetime
    status: TaskStatus = TaskStatus.PENDING
    notes: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    assigned_to: Optional[int]
    status: Optional[TaskStatus]
    notes: Optional[str]


class TaskResponse(TaskBase):
    id: int

    class Config:
        from_attributes = True