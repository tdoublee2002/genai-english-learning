from sqlmodel import Session, select

from ..models import VocabItem


class VocabRepository:
    def get_by_user_and_word(self, session: Session, *, user_label: str, word: str) -> VocabItem | None:
        stmt = select(VocabItem).where(
            VocabItem.user_label == user_label,
            VocabItem.word == word,
        )
        return session.exec(stmt).first()

    def upsert(self, session: Session, *, item: VocabItem) -> VocabItem:
        existing = self.get_by_user_and_word(session, user_label=item.user_label, word=item.word)
        if existing:
            existing.meaning = item.meaning
            existing.example_sentence = item.example_sentence
            existing.level = item.level
            existing.tags = item.tags
            session.add(existing)
            session.commit()
            session.refresh(existing)
            return existing

        session.add(item)
        session.commit()
        session.refresh(item)
        return item

    def list_by_user(self, session: Session, *, user_label: str, limit: int = 200) -> list[VocabItem]:
        stmt = (
            select(VocabItem)
            .where(VocabItem.user_label == user_label)
            .order_by(VocabItem.updated_at.desc())
            .limit(limit)
        )
        return session.exec(stmt).all()