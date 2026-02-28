from dataclasses import dataclass
from typing import Any, TypeVar

from litellm import completion
from pydantic import BaseModel

from ..core.config import settings

T = TypeVar("T", bound=BaseModel)


@dataclass(frozen=True)
class LlmConfig:
    model: str
    api_key: str
    timeout_s: int


class LlmClient:
    """
    Thin wrapper over LiteLLM SDK.
    - Always passes api_key explicitly (no hidden global state).
    - Offers 2 methods:
      1) chat_text() -> str
      2) chat_structured() -> Pydantic model (via response_format)
    """

    def __init__(self, cfg: LlmConfig) -> None:
        self.cfg = cfg

    @classmethod
    def from_settings(cls) -> "LlmClient":
        return cls(
            LlmConfig(
                model=settings.llm_model,
                api_key=settings.openai_api_key,
                timeout_s=settings.llm_timeout_s,
            )
        )

    def chat_text(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
        max_tokens: int = 500,
        extra: dict[str, Any] | None = None,
    ) -> str:
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        response = completion(
            model=self.cfg.model,
            messages=messages,
            api_key=self.cfg.api_key,
            timeout=self.cfg.timeout_s,
            temperature=temperature,
            max_tokens=max_tokens,
            **(extra or {}),
        )

        return (response.choices[0].message.content or "").strip()

    def chat_structured(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        response_model: type[T],
        temperature: float = 0.2,
        max_tokens: int = 500,
        extra: dict[str, Any] | None = None,
    ) -> T:
        """
        Uses LiteLLM Structured Outputs by passing `response_format=response_model`.
        For OpenAI models, the response is JSON in message.content; validate it with Pydantic.
        :contentReference[oaicite:1]{index=1}
        """
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        response = completion(
            model=self.cfg.model,
            messages=messages,
            response_format=response_model,
            api_key=self.cfg.api_key,
            timeout=self.cfg.timeout_s,
            temperature=temperature,
            max_tokens=max_tokens,
            **(extra or {}),
        )

        content = response.choices[0].message.content or ""
        return response_model.model_validate_json(content)