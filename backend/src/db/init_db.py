from sqlmodel import SQLModel

from .engine import engine
from .models import *


def init_db() -> None:
    SQLModel.metadata.create_all(engine)        