from fastapi import APIRouter, Depends, HTTPException
from modules import generate_modules
from schemas import generate_schema

router = APIRouter()

@router.post("/generate")
async def create_questions(request: generate_schema.GenerateRequest):
    return await generate_modules.generate_question(request.content, request.difficulty)
