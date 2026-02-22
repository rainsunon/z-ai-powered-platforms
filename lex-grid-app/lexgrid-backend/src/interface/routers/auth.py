"""
Authentication router - Handles login, registration, and token management.
"""

from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer

from src.application.dto import (
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RefreshTokenRequest,
    RefreshTokenResponse,
)
from src.application.use_cases import (
    LoginUserUseCase,
    RegisterUserUseCase,
    RefreshTokenUseCase,
    LogoutUserUseCase,
)
from src.interface.dependencies import (
    get_user_repository,
    get_current_user_id,
)
from src.infrastructure.security import PasswordHasher, JWTService

router = APIRouter()
security = HTTPBearer()


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(
    request: LoginRequest,
    user_repository=Depends(get_user_repository),
):
    """
    Authenticate user and return access token.
    
    - **email**: User's email address
    - **password**: User's password
    """
    password_hasher = PasswordHasher()
    jwt_service = JWTService()

    use_case = LoginUserUseCase(
        user_repository=user_repository,
        password_hasher=password_hasher,
        jwt_service=jwt_service,
    )

    return await use_case.execute(request)


@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    user_repository=Depends(get_user_repository),
):
    """
    Register a new user account.
    
    - **email**: User's email address (must be unique)
    - **password**: User's password (min 8 characters)
    - **name**: User's full name
    - **role**: User's role (default: 'user')
    - **jurisdiction**: User's jurisdiction (optional)
    """
    password_hasher = PasswordHasher()
    jwt_service = JWTService()

    use_case = RegisterUserUseCase(
        user_repository=user_repository,
        password_hasher=password_hasher,
        jwt_service=jwt_service,
    )

    return await use_case.execute(request)


@router.post("/refresh", response_model=RefreshTokenResponse, status_code=status.HTTP_200_OK)
async def refresh_token(
    request: RefreshTokenRequest,
):
    """
    Refresh access token using refresh token.
    
    - **refresh_token**: Valid refresh token
    """
    jwt_service = JWTService()

    use_case = RefreshTokenUseCase(jwt_service=jwt_service)

    return await use_case.execute(request)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    request: RefreshTokenRequest,
):
    """
    Logout user by invalidating refresh token.
    
    - **refresh_token**: Refresh token to invalidate
    """
    jwt_service = JWTService()

    use_case = LogoutUserUseCase(jwt_service=jwt_service)

    await use_case.execute(request.refresh_token)

    return None


@router.get("/me", status_code=status.HTTP_200_OK)
async def get_current_user_info(
    user_id=Depends(get_current_user_id),
    user_repository=Depends(get_user_repository),
):
    """
    Get current authenticated user information.
    
    Requires valid JWT token in Authorization header.
    """
    from src.application.use_cases import GetUserUseCase

    use_case = GetUserUseCase(user_repository=user_repository)

    return await use_case.execute(user_id)
