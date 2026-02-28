from fastapi import APIRouter, HTTPException

from ...db.models import VocabItem
from ...db.repositories.vocab import VocabRepository
from ...services.progress import VocabProgressService
from ..deps import SessionDep
from ..schemas import SubmitAttemptPayload

router = APIRouter(prefix="/progress", tags=["progress"])

repo = VocabRepository()
service = VocabProgressService(repo)


@router.post("/vocab-attempt", response_model=VocabItem)
def submit_vocab_attempt(session: SessionDep, payload: SubmitAttemptPayload) -> VocabItem:
    user_label = payload.user_label.strip().lower()
    word = payload.word.strip()

    if not user_label:
        raise HTTPException(status_code=400, detail="invalid_user_label")
    if not word:
        raise HTTPException(status_code=400, detail="invalid_word")

    try:
        return service.submit_attempt(
            session,
            user_label=user_label,
            word=word,
            correct=payload.correct,
        )
    except ValueError as e:
        if str(e) == "vocab_not_found":
            raise HTTPException(status_code=404, detail="vocab_not_found")
        raise HTTPException(status_code=400, detail=str(e))      