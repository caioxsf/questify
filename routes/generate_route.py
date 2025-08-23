from fastapi import APIRouter, Depends, HTTPException
from modules import generate_modules

router = APIRouter()

@router.post("/generate")
async def create_questions(content: str, difficult: int):
    return await generate_modules.generate_question(content, difficult)
