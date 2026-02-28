from datetime import datetime, timezone

from sqlmodel import Session

from ..db.models import VocabItem
from ..db.repositories.vocab import VocabRepository


class VocabProgressService:

    SCORE_INC_WEIGHT = 0.20
    SCORE_DECAY_FACTOR = 0.90
    DECAY_AFTER_DAYS = 7

    def __init__(self, repo: VocabRepository) -> None:
        self.repo = repo

    def submit_attempt(
        self,
        session: Session,
        *,
        user_label: str,
        word: str,
        correct: bool,
        now: datetime | None = None,
    ) -> VocabItem:
        item = self.repo.get_by_user_and_word(session, user_label=user_label, word=word)
        if item is None:
            raise ValueError("vocab_not_found")

        now = now or datetime.now(timezone.utc)

        # update attempts/correct
        item.attempts += 1
        if correct:
            item.correct += 1

        # EWMA update
        outcome = 1.0 if correct else 0.0
        item.score = (self.SCORE_INC_WEIGHT * outcome) + ((1.0 - self.SCORE_INC_WEIGHT) * item.score)

        # time-based decay
        if item.last_seen is not None:
            last_seen = item.last_seen
            if last_seen.tzinfo is None:
                last_seen = last_seen.replace(tzinfo=timezone.utc)

            days_passed = (now - last_seen).days
            if days_passed >= self.DECAY_AFTER_DAYS:
                decay_steps = days_passed // self.DECAY_AFTER_DAYS
                item.score *= self.SCORE_DECAY_FACTOR**decay_steps

        # last_seen + mastery
        item.last_seen = now
        item.mastered = (item.attempts >= 5) and (item.score >= 0.80)

        # persist
        session.add(item)
        session.commit()
        session.refresh(item)
        return item
    
    def submit_attempt_by_id(
        self,
        session: Session,
        *,
        user_label: str,
        vocab_item_id: int,
        correct: bool,
        now: datetime | None = None,
    ) -> VocabItem:
        item = self.repo.get_by_user_and_id(session, user_label=user_label, vocab_item_id=vocab_item_id)
        if item is None:
            raise ValueError("vocab_not_found")

        now = now or datetime.now(timezone.utc)

        item.attempts += 1
        if correct:
            item.correct += 1

        outcome = 1.0 if correct else 0.0
        item.score = (self.SCORE_INC_WEIGHT * outcome) + ((1.0 - self.SCORE_INC_WEIGHT) * item.score)

        if item.last_seen is not None:
            last_seen = item.last_seen
            if last_seen.tzinfo is None:
                last_seen = last_seen.replace(tzinfo=timezone.utc)

            days_passed = (now - last_seen).days
            if days_passed >= self.DECAY_AFTER_DAYS:
                decay_steps = days_passed // self.DECAY_AFTER_DAYS
                item.score *= self.SCORE_DECAY_FACTOR**decay_steps

        item.last_seen = now
        item.mastered = (item.attempts >= 5) and (item.score >= 0.80)

        session.add(item)
        session.commit()
        session.refresh(item)
        return item