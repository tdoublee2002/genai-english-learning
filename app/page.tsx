"use client";

import { useEffect, useMemo, useState } from "react";
import { UserLabelBar } from "@/components/UserLabelBar";
import { VocabAddForm } from "@/components/VocabAddForm";
import { VocabList } from "@/components/VocabList";
import { QuizCard } from "@/components/QuizCard";
import { ProgressMiniCard } from "@/components/ProgressMiniCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { generateQuiz, getVocab, submitAnswer, upsertVocab, type QuizResponse, type SubmitResponse, type VocabItem } from "@/lib/api";

const DEFAULT_LABEL = "internal";

export default function HomePage() {
  const { toast } = useToast();
  const [userLabel, setUserLabel] = useState(DEFAULT_LABEL);
  const [vocab, setVocab] = useState<VocabItem[]>([]);
  const [vocabLoading, setVocabLoading] = useState(true);
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [quizResult, setQuizResult] = useState<SubmitResponse | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("user_label");
    if (stored && stored.trim()) {
      setUserLabel(stored);
    }
  }, []);

  useEffect(() => {
    const normalized = userLabel.trim() || DEFAULT_LABEL;
    window.localStorage.setItem("user_label", normalized);
    if (normalized !== userLabel) {
      setUserLabel(normalized);
      return;
    }

    const loadVocab = async () => {
      setVocabLoading(true);
      try {
        const items = await getVocab(normalized);
        setVocab(items);
      } catch {
        setVocab([]);
      } finally {
        setVocabLoading(false);
      }
    };

    void loadVocab();
  }, [userLabel]);

  const currentProgress = useMemo(() => {
    if (quizResult?.updated_vocab) return quizResult.updated_vocab;
    if (!quiz) return null;
    return vocab.find((item) => item.id === quiz.vocab_item_id) ?? null;
  }, [quiz, quizResult, vocab]);

  const handleAddVocab = async (payload: {
    word: string;
    meaning?: string;
    example_sentence?: string;
    level?: string;
    tags?: string;
  }) => {
    try {
      const item = await upsertVocab({ ...payload, user_label: userLabel.trim() || DEFAULT_LABEL });
      setVocab((prev) => {
        const withoutExisting = prev.filter((v) => v.id !== item.id);
        return [item, ...withoutExisting];
      });
      toast({ title: "Saved", description: `Added ${item.word} to your vocab.` });
    } catch {
      toast({ title: "Could not save", description: "Try again in a sec.", variant: "destructive" });
      throw new Error("add vocab failed");
    }
  };

  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setQuizError(null);
    setQuizResult(null);
    try {
      const response = await generateQuiz(userLabel.trim() || DEFAULT_LABEL);
      setQuiz(response);
    } catch (error) {
      const status = (error as Error & { status?: number }).status;
      if (status === 404) {
        setQuizError("Add some vocab first.");
      } else {
        setQuizError("Network issue while generating quiz. Please retry.");
      }
      setQuiz(null);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswer = async (choice: number) => {
    if (!quiz) return;
    setQuizSubmitting(true);
    setQuizError(null);
    try {
      const response = await submitAnswer({
        user_label: userLabel.trim() || DEFAULT_LABEL,
        vocab_item_id: quiz.vocab_item_id,
        user_choice: choice,
        correct_answer: quiz.quiz.answer
      });
      setQuizResult(response);
      setVocab((prev) => prev.map((item) => (item.id === response.updated_vocab.id ? { ...item, ...response.updated_vocab } : item)));
    } catch {
      setQuizError("Could not submit answer right now.");
    } finally {
      setQuizSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">genai-english-learning</h1>
        <p className="text-muted-foreground">Learn words, run quizzes, and flex that vocabulary glow-up ✨</p>
      </header>

      <UserLabelBar userLabel={userLabel} onChange={setUserLabel} />

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>My Vocabulary</CardTitle>
            <CardDescription>Add new words and keep your stack fresh.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <VocabAddForm onSubmit={handleAddVocab} />
            <Separator />
            <VocabList items={vocab} loading={vocabLoading} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <QuizCard
            quiz={quiz}
            result={quizResult}
            loading={quizLoading}
            submitting={quizSubmitting}
            error={quizError}
            onGenerate={handleGenerateQuiz}
            onAnswer={handleAnswer}
          />
          {currentProgress && <ProgressMiniCard item={currentProgress} />}
        </div>
      </section>
    </main>
  );
}
