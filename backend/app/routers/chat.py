import os
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException
from jose import jwt, JWTError
from app.bedrock import invoke_claude
from app.shell import execute_command

router = APIRouter()

SYSTEM_PROMPT = """You are Sempre, an intelligent AI agent running on a dedicated cloud server.
You can help users with coding, file management, research, and general tasks.
When a user asks you to run a shell command, you must output it in this exact format:
EXECUTE: <command>
Only use this format for commands. Otherwise respond normally.
You are helpful, direct, and security-conscious."""

async def verify_ws_token(token: str) -> dict:
    """Verify JWT for WebSocket connections"""
    try:
        import httpx
        clerk_domain = os.getenv("CLERK_DOMAIN")
        url = f"https://{clerk_domain}/.well-known/jwks.json"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            jwks = response.json()
        header = jwt.get_unverified_header(token)
        key = next((k for k in jwks["keys"] if k["kid"] == header["kid"]), None)
        if not key:
            return None
        payload = jwt.decode(token, key, algorithms=["RS256"])
        return payload
    except JWTError:
        return None

@router.websocket("/ws")
async def websocket_chat(
    websocket: WebSocket,
    token: str = Query(...)
):
    """
    Authenticated WebSocket endpoint for real-time agent chat
    Token is passed as query parameter: /chat/ws?token=<jwt>
    """
    # Verify token before accepting connection
    payload = await verify_ws_token(token)
    if not payload:
        await websocket.close(code=4001, reason="Unauthorized")
        return

    await websocket.accept()
    user_id = payload.get("sub", "unknown")
    conversation_history = []

    try:
        await websocket.send_json({
            "type": "connected",
            "message": "Connected to Sempre AI. How can I help you?"
        })

        while True:
            data = await websocket.receive_json()
            user_message = data.get("message", "").strip()

            if not user_message:
                continue

            # Add to conversation history
            conversation_history.append({
                "role": "user",
                "content": [{"text": user_message}]
            })

            # Get response from Claude
            response_text = await invoke_claude(
                messages=conversation_history,
                system_prompt=SYSTEM_PROMPT
            )

            # Check if Claude wants to execute a command
            if response_text.startswith("EXECUTE:"):
                command = response_text.replace("EXECUTE:", "").strip()
                result = execute_command(command)

                if result["blocked"]:
                    response_text = f"I tried to run `{command}` but it was blocked by the security policy: {result['error']}"
                elif result["success"]:
                    response_text = f"Ran `{command}`:\n```\n{result['output']}\n```"
                else:
                    response_text = f"Command `{command}` failed:\n```\n{result['error']}\n```"

            # Add assistant response to history
            conversation_history.append({
                "role": "assistant",
                "content": [{"text": response_text}]
            })

            await websocket.send_json({
                "type": "message",
                "role": "assistant",
                "message": response_text
            })

    except WebSocketDisconnect:
        print(f"User {user_id} disconnected")
    except Exception as e:
        await websocket.send_json({
            "type": "error",
            "message": f"Something went wrong: {str(e)}"
        })
