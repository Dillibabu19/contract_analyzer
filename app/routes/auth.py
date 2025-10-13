from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from app.services.authservices import check_user,create_user

router = APIRouter()

@router.post("/sign_up/user")
async def sign_up_user(payload: dict):
    user_name,password_raw,email = payload.get("user_name") , payload.get("password_raw"),payload.get("email")
    if not user_name or not password_raw:
        return {"Error": "No user name or password provided"}
    user = check_user(username=user_name,password=password_raw)
    if user.get("Error") != "User not found":
        return {"Error":"User already exist"}
    created_user = create_user(user_name,password_raw,email)
    print(user_name,password_raw,email)
    print(created_user)
    return created_user

@router.post("/sign_in/user")
async def sign_in_user(payload: dict):
    user_name,password_raw,email = payload.get("user_name") , payload.get("password_raw"),payload.get("email")
    if not user_name and not email:
        return {"Error": "No user name or email provided"}
    user = check_user(email=email,password=password_raw)
    if user:
        return user
    else:
        return RedirectResponse(url="/sign-up")

