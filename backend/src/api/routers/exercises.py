from fastapi import APIRouter, HTTPException
from llm.client import LlmClient
from pydantic import BaseModel, Field

from ...api.deps import SessionDep
from ...db.repositories.vocab import VocabRepository
from ...schemas.quiz import QATemplate
from ...services.progress import VocabProgressService
from ...services.quiz import QuizService
from ..schemas import (GenerateExercisePayload, GenerateExerciseResponse,
                       SubmitAttemptPayload, SubmitExercisePayload,
                       SubmitExerciseResponse)

router = APIRouter(prefix="/exercises", tags=["exercises"])

vocab_repo = VocabRepository()
quiz_service = QuizService(vocab_repo=vocab_repo, llm=LlmClient.from_settings())
progress_service = VocabProgressService(vocab_repo)


@router.post("/generate", response_model=GenerateExerciseResponse)
def generate_exercise(session: SessionDep, payload: GenerateExercisePayload) -> GenerateExerciseResponse:
    user_label = payload.user_label.strip().lower()
    if not user_label:
        raise HTTPException(status_code=400, detail="invalid_user_label")

    try:
        out = quiz_service.generate_for_user(session, user_label=user_label)
        return GenerateExerciseResponse(
            vocab_item_id=out.vocab_item_id,
            word=out.word,
            quiz=out.quiz,
        )
    except ValueError as e:
        if str(e) == "no_vocab":
            raise HTTPException(status_code=404, detail="no_vocab_for_user")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="llm_generation_failed")

@router.post("/submit", response_model=SubmitExerciseResponse)
def submit_exercise(session: SessionDep, payload: SubmitExercisePayload) -> SubmitExerciseResponse:
    user_label = payload.user_label.strip().lower()
    if not user_label:
        raise HTTPException(status_code=400, detail="invalid_user_label")

    is_correct = payload.user_choice == payload.correct_answer

    try:
        updated = progress_service.submit_attempt_by_id(
            session,
            user_label=user_label,
            vocab_item_id=payload.vocab_item_id,
            correct=is_correct,
        )
    except ValueError as e:
        if str(e) == "vocab_not_found":
            raise HTTPException(status_code=404, detail="vocab_not_found")
        raise HTTPException(status_code=400, detail=str(e))

    return SubmitExerciseResponse(
        correct=is_correct,
        correct_answer=payload.correct_answer,
        updated_vocab={
            "id": updated.id,
            "user_label": updated.user_label,
            "word": updated.word,
            "score": updated.score,
            "attempts": updated.attempts,
            "correct": updated.correct,
            "mastered": updated.mastered,
            "last_seen": updated.last_seen,
            "updated_at": updated.updated_at,
        },
    )