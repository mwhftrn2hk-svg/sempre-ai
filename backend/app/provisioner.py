import boto3
import os

async def get_agent_status() -> str:
    """
    Check EC2 agent instance status
    Returns: running, stopped, pending, or not_found
    """
    instance_id = os.getenv("AGENT_INSTANCE_ID")
    if not instance_id:
        return "not_configured"

    try:
        ec2 = boto3.client("ec2", region_name=os.getenv("AWS_REGION", "us-east-1"))
        response = ec2.describe_instances(InstanceIds=[instance_id])
        reservations = response.get("Reservations", [])
        if not reservations:
            return "not_found"
        state = reservations[0]["Instances"][0]["State"]["Name"]
        return state
    except Exception as e:
        return f"error: {str(e)}"
