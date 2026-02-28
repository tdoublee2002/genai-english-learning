from datetime import datetime
from typing import Optional

from sqlalchemy import Column, DateTime, UniqueConstraint, func
from sqlmodel import Field, SQLModel


class VocabItem(SQLModel, table=True):
    __tablename__ = "vocab_item"
    __table_args__ = (
        UniqueConstraint("user_label", "word", name="uq_vocab_item_user_word"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)

    user_label: str = Field(index=True, max_length=64)

    # content
    word: str = Field(index=True, min_length=1, max_length=64)
    meaning: Optional[str] = None
    example_sentence: Optional[str] = None
    level: Optional[str] = Field(default=None, index=True)
    tags: Optional[str] = None  # Examples: travel,work

    # progress
    score: float = Field(default=0.0)
    attempts: int = Field(default=0)
    correct: int = Field(default=0)
    last_seen: Optional[datetime] = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )
    mastered: bool = Field(default=False, index=True)

    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), 
            server_default=func.now(), 
            nullable=False)
    )
    
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False,
        )
    )