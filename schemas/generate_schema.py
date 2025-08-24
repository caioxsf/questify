from pydantic import BaseModel

class GenerateRequest(BaseModel):
    content: str
    difficulty: int