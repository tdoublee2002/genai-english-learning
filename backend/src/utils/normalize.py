import re

USER_LABEL_RE = re.compile(r"^[a-z0-9_-]{1,64}$")


def normalize_user_label(s: str) -> str:
    s = s.strip().lower()
    if not USER_LABEL_RE.match(s):
        raise ValueError("invalid_user_label")
    return s


def normalize_word(s: str) -> str:
    return s.strip()