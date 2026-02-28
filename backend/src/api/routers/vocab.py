from fastapi import APIRouter, Query

from ...db.models import VocabItem
from ...db.repositories.vocab import VocabRepository
from ...utils.normalize import normalize_user_label, normalize_word
from ..deps import SessionDep
from ..schemas.vocab import VocabUpsert

router = APIRouter(prefix="/vocab", tags=["vocab"])
repo = VocabRepository()

@router.post("", response_model=VocabItem)
def upsert_vocab(session: SessionDep, payload: VocabUpsert) -> VocabItem:
    user_label = normalize_user_label(payload.user_label)
    word = normalize_word(payload.word)

    item = VocabItem(
        user_label=user_label,
        word=word,
        meaning=payload.meaning,
        example_sentence=payload.example_sentence,
        level=payload.level,
        tags=payload.tags,
    )
    return repo.upsert(session, item=item)


@router.get("", response_model=list[VocabItem])
def list_vocab(
    session: SessionDep,
    user_label: str = Query(...),
    limit: int = Query(default=200, ge=1, le=500),
) -> list[VocabItem]:
    user_label = normalize_user_label(user_label)
    return repo.list_by_user(session, user_label=user_label, limit=limit)    