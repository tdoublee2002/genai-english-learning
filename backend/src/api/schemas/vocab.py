from pydantic import BaseModel, Field


class VocabUpsert(BaseModel):
    user_label: str = Field(..., description="POC user id label, e.g. Santa, P'Seefoon, Tee")
    word: str
    meaning: str | None = None
    example_sentence: str | None = None
    level: str | None = None
    tags: str | None = None