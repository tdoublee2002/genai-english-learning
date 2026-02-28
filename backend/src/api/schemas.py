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
    
class SubmitExercisePayload(BaseModel):
    user_label: str = Field(..., min_length=1, max_length=64)
    vocab_item_id: int
    user_choice: int = Field(..., ge=1, le=4)
    correct_answer: int = Field(..., ge=1, le=4)


class SubmitExerciseResponse(BaseModel):
    correct: bool
    correct_answer: int
    updated_vocab: dict