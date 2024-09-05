from fastapi import FastAPI, Request, Depends, Query, File, UploadFile, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from db import get_database
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorDatabase
from minio import Minio
from datetime import datetime
from multiprocessing import Process
from io import BytesIO
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from bson import ObjectId
from auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    Token,
    UserInRequest,
    oauth2_scheme,
    HTTPException
)
import logging

# SET LOGGING
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)  
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)
logger.info("start")

async def get_db_instance():
    database = await get_database()
    return database

app = FastAPI()
load_dotenv()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class WhatsappResult(BaseModel):
    find: bool
    whatsapp: dict
    mobile: str

class WhatsappResults(BaseModel):
    results: List[WhatsappResult]
    report: dict
    failed_numbers: List
    
    

# UI APIes
@app.get("/dashboard/")
async def dashboard(request: Request, current_user: dict = Depends(get_current_user) ,db: AsyncIOMotorDatabase = Depends(get_db_instance)):
    workers_count = await db.worker.count_documents({})
    user_data_count = await db.user_data.count_documents({})
    profiles_count = await db.profile.count_documents({})
    finded_whatsapp_profiles = await db.profile.count_documents({"whatsapp": {"$elemMatch": {"find": True}}})
    whatsapp_searched_profiles = await db.profile.count_documents({"whatsapp_searches": {"$gt": 0}})
    return {"workers": workers_count ,"user_data": user_data_count, "profiles": profiles_count,"whatsapp_profiles":finded_whatsapp_profiles,"whatsapp_searched_profiles": whatsapp_searched_profiles}

@app.get("/profiles")
async def get_records(request: Request, whatsapp_finded = Query() , current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db_instance), page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)):
    filter={}
    whatsapp_finded=str(whatsapp_finded)
    logger.warning(f"whatsapp_finded {whatsapp_finded}")
    if whatsapp_finded=='true' or whatsapp_finded=='false':
        if whatsapp_finded=="true":
            whatsapp_finded=True
        else:
            whatsapp_finded=False
        filter["whatsapp"]= {"$elemMatch": {"find": whatsapp_finded}}
    logger.warning(f"filter {filter}")
    skip = (page - 1) * limit
    records = []
    total_count = await db.profile.count_documents(filter)
    async for record in db.profile.find(filter).skip(skip).limit(limit):
        record["_id"] = str(record["_id"])
        records.append(record)
    return {"total_count": total_count,"data": records}

@app.get("/profile")
async def profile(request: Request, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db_instance), mobile: str = Query()):
    profile = await db.profile.find_one({"mobile":mobile})
    profile["_id"] = str(profile["_id"])
    return profile

@app.get("/workers")
async def get_records(request: Request, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db_instance), page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)):
    total_count = await db.worker.count_documents({})
    skip = (page - 1) * limit
    records = []
    async for record in db.worker.find({}).skip(skip).limit(limit):
        record["_id"] = str(record["_id"])
        if 'app_id' in record:
            record["app_id"] = str(record["app_id"])
        records.append(record)
    return {"total_count": total_count,"data": records}

@app.get("/worker")
async def worker(request: Request,current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db_instance), id: str = Query()):
    worker = await db.worker.find_one({"_id":ObjectId(id)})
    worker["_id"] = str(worker["_id"])
    if 'app_id' in worker:
        worker["app_id"] = str(worker["app_id"])
    return worker

@app.get("/userdatas")
async def get_records(request: Request, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db_instance), page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)):
    total_count = await db.user_data.count_documents({})
    skip = (page - 1) * limit
    records = []
    async for record in db.user_data.find({}).skip(skip).limit(limit):
        record["_id"] = str(record["_id"])
        records.append(record)
    return {"total_count": total_count,"data": records}





def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'zip'
@app.post("/upload_userdata/")
async def upload_zip_file(request: Request, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db_instance), file: UploadFile = File(...)):
    if not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Only zip files are allowed.")
    minio_client = Minio(
    "minio.sirafgroup.com",
    access_key="7qMlPjxSnrQ6fKGCPpl3",
    secret_key="zuf+RJCJY2rlmuU3WYI7ztbyvnKqq4N7bIdt1AumjA82",
    secure=False
)
    try:
        minio_client.make_bucket("whatsapp")
    except Exception as err:
        print(err)
    try:
        # Save the file to MinIO
        content = await file.read()
        minio_client.put_object(
            "whatsapp",
            file.filename,
            BytesIO(content),
            len(content)
        )
        file_url = f"https://minio.sirafgroup.com/whatsapp/{file.filename}"
        user_data=await db.user_data.insert_one({'status': 0,'path': file_url})
        if not user_data.acknowledged:
            JSONResponse(content="cannot create userdata", status_code=500)        
        return {"message": f"File '{file.filename}' uploaded successfully."}
    except Exception as err:
        JSONResponse(content={"error": str(err)}, status_code=500)


@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: UserInRequest):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
        raise credentials_exception
        
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

