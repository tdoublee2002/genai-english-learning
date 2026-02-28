const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export type VocabItem = {
  id: number;
  user_label: string;
  word: string;
  meaning?: string | null;
  example_sentence?: string | null;
  level?: string | null;
  tags?: string | null;
  score: number;
  attempts: number;
  correct: number;
  mastered: boolean;
  last_seen?: string | null;
  updated_at?: string;
};

export type QuizPayload = {
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
};

export type SubmitAnswerResponse = {
  correct: boolean;
  correct_answer: number;
  updated_vocab: VocabItem;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const error = new Error("Request failed") as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json() as Promise<T>;
}

export function getVocab(userLabel: string) {
  return request<VocabItem[]>(`/api/v1/vocab?user_label=${encodeURIComponent(userLabel)}`);
}

export function upsertVocab(payload: {
  user_label: string;
  word: string;
  meaning?: string;
  example_sentence?: string;
  level?: string;
  tags?: string;
}) {
  return request<VocabItem>("/api/v1/vocab", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function generateQuiz(userLabel: string) {
  return request<QuizPayload>("/api/v1/exercises/generate", {
    method: "POST",
    body: JSON.stringify({ user_label: userLabel }),
  });
}

export function submitAnswer(payload: {
  user_label: string;
  vocab_item_id: number;
  user_choice: number;
  correct_answer: number;
}) {
  return request<SubmitAnswerResponse>("/api/v1/exercises/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
