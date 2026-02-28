export interface VocabItem {
  id: number;
  user_label: string;
  word: string;
  meaning?: string;
  example_sentence?: string;
  level?: string;
  tags?: string;
  score: number;
  attempts: number;
  correct: number;
  mastered: boolean;
  last_seen?: string;
  updated_at?: string;
}

export interface QuizResponse {
  vocab_item_id: number;
  word: string;
  quiz: {
    question: string;
    choice_1: string;
    choice_2: string;
    choice_3: string;
    choice_4: string;
    answer: number;
  };
}

export interface SubmitResponse {
  correct: boolean;
  correct_answer: number;
  updated_vocab: VocabItem;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const error = new Error(`Request failed: ${response.status}`) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json() as Promise<T>;
}

export function getVocab(userLabel: string) {
  const params = new URLSearchParams({ user_label: userLabel });
  return apiFetch<VocabItem[]>(`/api/v1/vocab?${params.toString()}`);
}

export function upsertVocab(payload: {
  user_label: string;
  word: string;
  meaning?: string;
  example_sentence?: string;
  level?: string;
  tags?: string;
}) {
  return apiFetch<VocabItem>("/api/v1/vocab", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function generateQuiz(userLabel: string) {
  return apiFetch<QuizResponse>("/api/v1/exercises/generate", {
    method: "POST",
    body: JSON.stringify({ user_label: userLabel })
  });
}

export function submitAnswer(payload: {
  user_label: string;
  vocab_item_id: number;
  user_choice: number;
  correct_answer: number;
}) {
  return apiFetch<SubmitResponse>("/api/v1/exercises/submit", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
