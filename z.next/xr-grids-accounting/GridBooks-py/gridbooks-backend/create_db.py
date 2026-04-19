import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def create_database():
    # Connect to the default 'postgres' database to create the new one
    # Note: asyncpg requires a database name to connect.
    # We assume 'postgres' user and 'postgres' db exist.
    # We ignore the DATABASE_URL in .env which points to the non-existent 'gridbooks' db
    # and construct a connection string for the default db.
    
    # Simple default connection
    sys_conn_str = "postgresql://postgres:postgres@localhost:5432/postgres"
    
    try:
        conn = await asyncpg.connect(sys_conn_str)
        print("Connected to default postgres database.")
        
        # Check if database exists
        exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = 'gridbooks'")
        if not exists:
            print("Creating database 'gridbooks'...")
            await conn.execute('CREATE DATABASE gridbooks')
            print("Database created successfully.")
        else:
            print("Database 'gridbooks' already exists.")
            
        await conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")

if __name__ == "__main__":
    asyncio.run(create_database())
