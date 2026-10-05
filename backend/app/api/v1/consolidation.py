from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.consolidation_engine import ConsolidationEngine
from app.api.deps import (
    get_current_user, require_bu_access, require_subsidiary_access, require_group_access
)
from app.models.user import User

router = APIRouter(tags=["Hierarchical Consolidation Engine"])

@router.get("/business-units/{bu_id}/consolidated")
def get_bu_consolidated_metrics(
    bu_id: str,
    reporting_period_id: str = Query(..., description="ID of reporting period to consolidate"),
    status: Optional[str] = Query(None, description="Comma-separated statuses to include, e.g. 'BU_APPROVED,SUBSIDIARY_APPROVED,LOCKED'"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    require_bu_access(bu_id, current_user, db)

    allowed_statuses = [s.strip() for s in status.split(",")] if status else None
    try:
        return ConsolidationEngine.consolidate_business_unit(
            db=db,
            bu_id=bu_id,
            reporting_period_id=reporting_period_id,
            allowed_statuses=allowed_statuses
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/subsidiaries/{subsidiary_id}/consolidated")
def get_subsidiary_consolidated_metrics(
    subsidiary_id: str,
    reporting_period_id: str = Query(..., description="ID of reporting period to consolidate"),
    status: Optional[str] = Query(None, description="Comma-separated statuses to include"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    require_subsidiary_access(subsidiary_id, current_user, db)

    allowed_statuses = [s.strip() for s in status.split(",")] if status else None
    try:
        return ConsolidationEngine.consolidate_subsidiary(
            db=db,
            subsidiary_id=subsidiary_id,
            reporting_period_id=reporting_period_id,
            allowed_statuses=allowed_statuses
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/groups/{group_id}/consolidated")
def get_group_consolidated_metrics(
    group_id: str,
    reporting_period_id: str = Query(..., description="ID of reporting period to consolidate"),
    status: Optional[str] = Query(None, description="Comma-separated statuses to include"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    require_group_access(group_id, current_user)

    allowed_statuses = [s.strip() for s in status.split(",")] if status else None
    try:
        return ConsolidationEngine.consolidate_group(
            db=db,
            group_id=group_id,
            reporting_period_id=reporting_period_id,
            allowed_statuses=allowed_statuses
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
