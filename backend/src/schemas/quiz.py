from pydantic import BaseModel, Field


class QATemplate(BaseModel):
    question: str = Field(..., min_length=1)
    choice_1: str = Field(..., min_length=1)
    choice_2: str = Field(..., min_length=1)
    choice_3: str = Field(..., min_length=1)
    choice_4: str = Field(..., min_length=1)

    answer: int = Field(..., ge=1, le=4)