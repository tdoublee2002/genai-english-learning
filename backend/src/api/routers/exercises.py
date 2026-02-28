from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ...api.deps import SessionDep
from ...db.repositories.vocab import VocabRepository
from ...llm.client import LlmClient
from ...services.quiz import QuizService
from ..schemas import GenerateExercisePayload, GenerateExerciseResponse

router = APIRouter(prefix="/exercises", tags=["exercises"])

service = QuizService(vocab_repo=VocabRepository(), llm=LlmClient.from_settings())

@router.post("/generate", response_model=GenerateExerciseResponse)
def generate_exercise(session: SessionDep, payload: GenerateExercisePayload) -> GenerateExerciseResponse:
    user_label = payload.user_label.strip().lower()
    if not user_label:
        raise HTTPException(status_code=400, detail="invalid_user_label")

    try:
        out = service.generate_for_user(session, user_label=user_label)
        return GenerateExerciseResponse(vocab_item_id=out.vocab_item_id, word=out.word, quiz=out.quiz)
    except ValueError as e:
        if str(e) == "no_vocab":
            raise HTTPException(status_code=404, detail="no_vocab_for_user")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="llm_generation_failed")