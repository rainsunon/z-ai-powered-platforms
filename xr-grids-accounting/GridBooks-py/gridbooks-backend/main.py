from fastapi import FastAPI
import strawberry
from strawberry.fastapi import GraphQLRouter
from schema import schema
from database import engine, Base
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables if they don't exist (though we use alembic usually)
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()

def create_app():
    app = FastAPI(lifespan=lifespan)
    
    graphql_app = GraphQLRouter(schema)
    app.include_router(graphql_app, prefix="/graphql")
    
    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
