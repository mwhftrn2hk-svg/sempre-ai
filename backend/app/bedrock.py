import boto3
import json
import os

def get_bedrock_client():
    """Get Bedrock runtime client - uses IAM role, no API keys needed"""
    return boto3.client(
        service_name="bedrock-runtime",
        region_name=os.getenv("AWS_REGION", "us-east-1")
    )

async def invoke_claude(messages: list, system_prompt: str = None) -> str:
    """
    Send messages to Claude via Bedrock and return response
    Uses the Converse API which is cleaner than InvokeModel directly
    """
    client = get_bedrock_client()

    model_id = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-5-sonnet-20241022-v2:0")

    request_body = {
        "messages": messages,
        "inferenceConfig": {
            "maxTokens": 2048,
            "temperature": 0.7,
        }
    }

    if system_prompt:
        request_body["system"] = [{"text": system_prompt}]

    try:
        response = client.converse(
            modelId=model_id,
            **request_body
        )
        return response["output"]["message"]["content"][0]["text"]
    except Exception as e:
        raise Exception(f"Bedrock error: {str(e)}")
