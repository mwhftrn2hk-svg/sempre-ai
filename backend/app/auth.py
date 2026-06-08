import os
import httpx
from jose import jwt, JWTError
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_jwks():
    """Fetch Clerk's public keys to verify JWTs"""
    clerk_domain = os.getenv("CLERK_DOMAIN")
    url = f"https://{clerk_domain}/.well-known/jwks.json"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Clerk JWT on every protected request"""
    token = credentials.credentials
    try:
        jwks = await get_jwks()
        header = jwt.get_unverified_header(token)
        key = next((k for k in jwks["keys"] if k["kid"] == header["kid"]), None)
        if not key:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token key")
        payload = jwt.decode(token, key, algorithms=["RS256"])
        return payload
    except JWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Token invalid: {str(e)}")
