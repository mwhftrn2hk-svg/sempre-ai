import os
from fastapi import APIRouter, Depends
from app.auth import verify_token
from app.provisioner import get_agent_status

router = APIRouter()

@router.get("/status")
async def agent_status(user=Depends(verify_token)):
    """Check if the agent instance is running"""
    status = await get_agent_status()
    return {
        "user_id": user.get("sub"),
        "agent_status": status
    }
