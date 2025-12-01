from fastapi import FastAPI
from routes import generate_route
from fastapi.middleware.cors import CORSMiddleware
import os

from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("URL_FRONTEND")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        
    allow_credentials=True,      
    allow_methods=["*"],        
    allow_headers=["*"],       
)

app.include_router(generate_route.router)