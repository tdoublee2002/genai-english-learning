import random
from dataclasses import dataclass

from sqlmodel import Session

from ..db.repositories.vocab import VocabRepository
from ..llm.client import LlmClient
from ..llm.prompts import PROMPT_TEMPLATES, SYSTEM_PROMPT
from ..schemas.quiz import QATemplate


@dataclass(frozen=True)
class GeneratedQuiz:
    vocab_item_id: int
    word: str
    quiz: QATemplate
    template_index: int


class QuizService:
    def __init__(self, *, vocab_repo: VocabRepository, llm: LlmClient) -> None:
        self.vocab_repo = vocab_repo
        self.llm = llm

    def generate_for_user(self, session: Session, *, user_label: str) -> GeneratedQuiz:
        item = self.vocab_repo.pick_next_for_practice(session, user_label=user_label)
        if item is None:
            raise ValueError("no_vocab")

        template_index = random.randrange(len(PROMPT_TEMPLATES))
        prompt_template = PROMPT_TEMPLATES[template_index]
        user_prompt = prompt_template.format(word=item.word)

        quiz = self.llm.chat_structured(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            response_model=QATemplate,
            temperature=0.2,
            max_tokens=400,
        )

        if item.id is None:
            raise ValueError("vocab_missing_id")

        return GeneratedQuiz(
            vocab_item_id=item.id,
            word=item.word,
            quiz=quiz,
            template_index=template_index,
        )