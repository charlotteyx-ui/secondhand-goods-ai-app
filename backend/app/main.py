from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import TMP_DIR
from app.routes.jobs import router as jobs_router

app = FastAPI(title='Resell Vision API V1')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(jobs_router)
app.mount('/static', StaticFiles(directory=TMP_DIR), name='static')


@app.get('/health')
def health_check():
    return {'ok': True}