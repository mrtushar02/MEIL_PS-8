from fastapi import APIRouter
from app.api.v1 import auth, organization, reporting_periods, submissions, reports, audit, hr, hse

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(organization.router)
api_router.include_router(reporting_periods.router)
api_router.include_router(submissions.router)
api_router.include_router(reports.router)
api_router.include_router(audit.router)
api_router.include_router(hr.router)
api_router.include_router(hse.router)


