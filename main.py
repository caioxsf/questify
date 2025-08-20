from fastapi import FastAPI
from routes import generate_route
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.include_router(generate_route.router)