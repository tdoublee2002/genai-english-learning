"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { generateQuiz, submitAnswer, type QuizPayload, type SubmitAnswerResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type QuizCardProps = {
  userLabel: string;
  onProgressUpdate: (progress: SubmitAnswerResponse["updated_vocab"]) => void;
};

export function QuizCard({ userLabel, onProgressUpdate }: QuizCardProps) {
  const [quizData, setQuizData] = useState<QuizPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [result, setResult] = useState<SubmitAnswerResponse | null>(null);

  const choices = useMemo(() => {
    if (!quizData) {
      return [];
    }
    return [quizData.quiz.choice_1, quizData.quiz.choice_2, quizData.quiz.choice_3, quizData.quiz.choice_4];
  }, [quizData]);

  const loadQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSelectedChoice(null);
    try {
      const payload = await generateQuiz(userLabel);
      setQuizData(payload);
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      if (status === 404) {
        setError("Add some vocab first ✍️");
      } else {
        setError("Could not generate quiz. Network vibes are off.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const answer = async (choice: number) => {
    if (!quizData || selectedChoice) {
      return;
    }

    setSelectedChoice(choice);
    setError(null);

    try {
      const submission = await submitAnswer({
        user_label: userLabel,
        vocab_item_id: quizData.vocab_item_id,
        user_choice: choice,
        correct_answer: quizData.quiz.answer,
      });
      setResult(submission);
      onProgressUpdate(submission.updated_vocab);
    } catch {
      setError("Failed to submit answer. Try another round.");
      setSelectedChoice(null);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={loadQuiz} className="w-full" disabled={isLoading}>
        {isLoading ? "Spinning up your next challenge..." : "Generate quiz"}
      </Button>

      {error ? <p className="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      {quizData ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-3 rounded-2xl border border-border/80 bg-white p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold">{quizData.word}</h4>
            <Badge variant="outline">Quiz Arena</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{quizData.quiz.question}</p>
          <div className="grid gap-2">
            {choices.map((choiceLabel, idx) => {
              const option = idx + 1;
              const isCorrect = result && option === result.correct_answer;
              const isWrongSelected = result && selectedChoice === option && !result.correct;
              return (
                <motion.div key={option} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="button"
                    variant={isCorrect ? "secondary" : isWrongSelected ? "outline" : "outline"}
                    className="w-full justify-start"
                    onClick={() => answer(option)}
                    disabled={Boolean(selectedChoice)}
                  >
                    {option}. {choiceLabel}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {result ? (
            <p className={`text-sm font-medium ${result.correct ? "text-emerald-600" : "text-rose-600"}`}>
              {result.correct ? "Correct! You&apos;re cooking 🔥" : `Not quite. Correct answer: ${result.correct_answer}`}
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </div>
  );
}
