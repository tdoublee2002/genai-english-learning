from pydantic import BaseModel, Field

from ..schemas.quiz import QATemplate


class VocabUpsert(BaseModel):
    user_label: str = Field(..., description="POC user id label, e.g. Santa, P'Seefoon, Tee")
    word: str
    meaning: str | None = None
    example_sentence: str | None = None
    level: str | None = None
    tags: str | None = None
    
class SubmitAttemptPayload(BaseModel):
    user_label: str = Field(..., description="poc user label")
    word: str
    correct: bool
    
class GenerateExercisePayload(BaseModel):
    user_label: str = Field(..., min_length=1, max_length=64)

class GenerateExerciseResponse(BaseModel):
    vocab_item_id: int
    word: str
    quiz: QATemplate