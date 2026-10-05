from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.factors import EmissionFactor, FactorSource, Unit, UnitConversion
from app.schemas.factors import (
    EmissionFactorResponse, EmissionFactorCreate,
    FactorSourceResponse, UnitResponse, UnitConversionResponse
)
from app.api.deps import get_current_user, require_permission
from app.models.user import User

router = APIRouter(tags=["Authority Factor Master & Units"])

@router.get("/emission-factors", response_model=List[EmissionFactorResponse])
def list_emission_factors(
    scope: Optional[str] = Query(None),
    status: Optional[str] = Query("ACTIVE"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(EmissionFactor)
    if scope:
        query = query.filter(EmissionFactor.scope == scope)
    if status:
        query = query.filter(EmissionFactor.status == status)
    return query.order_by(EmissionFactor.scope.asc(), EmissionFactor.activity_type.asc()).all()

@router.post("/emission-factors", response_model=EmissionFactorResponse, status_code=status.HTTP_201_CREATED)
def create_emission_factor(
    factor_in: EmissionFactorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("factors:manage"))
):
    new_factor = EmissionFactor(**factor_in.model_dump())
    db.add(new_factor)
    db.commit()
    db.refresh(new_factor)
    return new_factor

@router.get("/factor-sources", response_model=List[FactorSourceResponse])
def list_factor_sources(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(FactorSource).order_by(FactorSource.name.asc()).all()

@router.get("/units", response_model=List[UnitResponse])
def list_units(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Unit).filter(Unit.is_active == True).order_by(Unit.dimension.asc(), Unit.code.asc()).all()

@router.get("/unit-conversions", response_model=List[UnitConversionResponse])
def list_unit_conversions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(UnitConversion).filter(UnitConversion.status == "ACTIVE").all()
