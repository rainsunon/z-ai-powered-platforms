"""
Security utilities for authentication and authorization.

Provides password hashing and JWT token management.
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt

from src.infrastructure.config import get_settings

settings = get_settings()


class PasswordHasher:
    """Password hashing and verification using bcrypt."""

    def __init__(self):
        self.context = CryptContext(
            schemes=["bcrypt"],
            deprecated="auto",
            bcrypt__rounds=12,
        )

    def hash(self, password: str) -> str:
        """
        Hash a password.
        
        Args:
            password: Plain text password
            
        Returns:
            Hashed password
        """
        return self.context.hash(password)

    def verify(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against a hash.
        
        Args:
            plain_password: Plain text password to verify
            hashed_password: Hashed password to verify against
            
        Returns:
            True if password matches hash
        """
        return self.context.verify(plain_password, hashed_password)


class JWTService:
    """JWT token creation and validation."""

    def __init__(self):
        self.secret_key = settings.jwt_secret_key
        self.algorithm = settings.jwt_algorithm
        self.access_token_expire_minutes = settings.jwt_access_token_expire_minutes
        self.refresh_token_expire_days = settings.jwt_refresh_token_expire_days

    def create_access_token(
        self,
        subject: str,
        additional_claims: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Create an access token.
        
        Args:
            subject: Subject of the token (usually user ID)
            additional_claims: Additional claims to include in token
            
        Returns:
            Encoded JWT access token
        """
        now = datetime.utcnow()
        expire = now + timedelta(minutes=self.access_token_expire_minutes)

        to_encode = {
            "sub": subject,
            "exp": expire,
            "iat": now,
            "type": "access",
        }

        if additional_claims:
            to_encode.update(additional_claims)

        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)

    def create_refresh_token(self, subject: str) -> str:
        """
        Create a refresh token.
        
        Args:
            subject: Subject of the token (usually user ID)
            
        Returns:
            Encoded JWT refresh token
        """
        now = datetime.utcnow()
        expire = now + timedelta(days=self.refresh_token_expire_days)

        to_encode = {
            "sub": subject,
            "exp": expire,
            "iat": now,
            "type": "refresh",
        }

        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)

    def decode_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Decode and validate a JWT token.
        
        Args:
            token: JWT token to decode
            
        Returns:
            Decoded token payload or None if invalid
        """
        try:
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm],
            )
            return payload
        except JWTError:
            return None

    def decode_access_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Decode and validate an access token.
        
        Args:
            token: JWT access token to decode
            
        Returns:
            Decoded token payload or None if invalid
        """
        payload = self.decode_token(token)

        if payload and payload.get("type") == "access":
            return payload

        return None

    def decode_refresh_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Decode and validate a refresh token.
        
        Args:
            token: JWT refresh token to decode
            
        Returns:
            Decoded token payload or None if invalid
        """
        payload = self.decode_token(token)

        if payload and payload.get("type") == "refresh":
            return payload

        return None

    def get_token_expiry(self, token: str) -> Optional[datetime]:
        """
        Get the expiry time of a token.
        
        Args:
            token: JWT token to decode
            
        Returns:
            Expiry datetime or None if invalid
        """
        payload = self.decode_token(token)

        if payload:
            exp = payload.get("exp")
            if exp:
                return datetime.fromtimestamp(exp)

        return None

    def is_token_expired(self, token: str) -> bool:
        """
        Check if a token is expired.
        
        Args:
            token: JWT token to check
            
        Returns:
            True if token is expired
        """
        expiry = self.get_token_expiry(token)

        if expiry is None:
            return True

        return datetime.utcnow() > expiry
