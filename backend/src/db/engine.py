from sqlmodel import Session, create_engine

from ..core.config import settings

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    echo=False,
)

def get_session():
    with Session(engine) as session:
        yield session
        
if __name__ == "__main__":
    from sqlmodel import text
    
    with Session(engine) as session:
        value = session.exec(text("SELECT now()")).scalar_one()
        print("DB ping OK, result =", value)