import subprocess
import shlex

ALLOWED_COMMANDS = [
    "ls", "cat", "pwd", "echo", "python3", "pip",
    "node", "npm", "git", "mkdir", "touch", "grep",
    "head", "tail", "wc", "whoami", "date", "env"
]

BLOCKED_PATTERNS = [
    "rm -rf", "curl | bash", "wget | sh", "chmod 777",
    "sudo", "su -", "/etc/shadow", "/etc/passwd",
    "AWS_SECRET", "export AWS", "dd if=", "> /dev/",
    "mkfs", "shutdown", "reboot", "passwd"
]

def sanitize_command(command: str) -> tuple[bool, str]:
    """
    Returns (is_allowed, reason)
    Two-layer check: allowlist first, then denylist patterns
    """
    command = command.strip()

    # Layer 2 — denylist patterns (checked first, no exceptions)
    for pattern in BLOCKED_PATTERNS:
        if pattern.lower() in command.lower():
            return False, f"Blocked pattern detected: '{pattern}'"

    # Layer 1 — allowlist: command must start with an approved prefix
    try:
        parts = shlex.split(command)
    except ValueError:
        return False, "Could not parse command"

    if not parts:
        return False, "Empty command"

    base_command = parts[0].split("/")[-1]  # handle full paths like /usr/bin/python3

    if base_command not in ALLOWED_COMMANDS:
        return False, f"Command '{base_command}' is not in the allowed list"

    return True, "OK"

def execute_command(command: str) -> dict:
    """
    Executes a sanitized shell command and returns output
    """
    allowed, reason = sanitize_command(command)

    if not allowed:
        return {
            "success": False,
            "output": "",
            "error": f"Command blocked by security policy: {reason}",
            "blocked": True
        }

    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        return {
            "success": result.returncode == 0,
            "output": result.stdout,
            "error": result.stderr,
            "blocked": False
        }
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "output": "",
            "error": "Command timed out after 30 seconds",
            "blocked": False
        }
