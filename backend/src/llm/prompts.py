SYSTEM_PROMPT = """
You are an English quiz generator.
Your task is to create a multiple-choice vocabulary question from the user's prompt.

Rules:
1) Always generate a question in English that tests meaning, usage, synonym, antonym, or context of the given word.
2) Provide exactly four answer choices.
3) Ensure that only one choice is correct.
4) Set 'answer' as an integer 1..4 (the correct option index).
5) Keep choices short and plausible; avoid duplicates.
""".strip()


definition_question_prompt = (
    'Generate a multiple-choice question asking the learner to choose the correct meaning of the word "{word}". '
    "Provide four options with one correct answer and three plausible distractors."
)

fill_in_the_blank_prompt = (
    'Create a sentence with the word "{word}" removed. Replace it with a blank. '
    "Provide four options including the correct word and three plausible distractors."
)

synonym_prompt = (
    'Generate a question asking which word is closest in meaning to "{word}". '
    "Provide four options: one correct synonym and three distractors."
)

antonym_prompt = (
    'Generate a question asking which word is opposite in meaning to "{word}". '
    "Provide four options: one correct antonym and three distractors."
)

sentence_completion_prompt = (
    'Write a short dialogue or situation where the correct choice is "{word}". '
    "Provide four options: the correct word and three distractors."
)

PROMPT_TEMPLATES = [
    definition_question_prompt,
    fill_in_the_blank_prompt,
    synonym_prompt,
    antonym_prompt,
    sentence_completion_prompt,
]