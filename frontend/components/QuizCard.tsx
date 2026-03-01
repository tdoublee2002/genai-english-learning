"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuizResponse, SubmitResponse } from "@/lib/api";

interface QuizCardProps {
  quiz: QuizResponse | null;
  result: SubmitResponse | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  onGenerate: () => Promise<void>;
  onAnswer: (choice: number) => Promise<void>;
}

export function QuizCard({ quiz, result, loading, submitting, error, onGenerate, onAnswer }: QuizCardProps) {
  const choices = quiz
    ? [quiz.quiz.choice_1, quiz.quiz.choice_2, quiz.quiz.choice_3, quiz.quiz.choice_4]
    : [];

  return (
    <Card className="bg-white/95">
      <CardHeader>
        <CardTitle>Quiz Arena</CardTitle>
        <CardDescription>Tap in and level up your vocab streak.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={onGenerate} disabled={loading || submitting} className="w-full">
          {loading ? "Generating..." : "Generate quiz"}
        </Button>

        {error && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{error}</p>}

        {quiz && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <p className="font-medium">{quiz.quiz.question}</p>
            <div className="grid gap-2">
              {choices.map((choice, index) => {
                const choiceNumber = index + 1;
                const isCorrect = result?.correct_answer === choiceNumber;
                const isSelectedWrong = result && !result.correct && result.correct_answer !== choiceNumber;

                return (
                  <motion.div whileHover={{ scale: 1.01 }} key={choiceNumber}>
                    <Button
                      variant={isCorrect ? "secondary" : isSelectedWrong ? "outline" : "outline"}
                      className="w-full justify-start"
                      onClick={() => onAnswer(choiceNumber)}
                      disabled={submitting || Boolean(result)}
                    >
                      {choiceNumber}. {choice}
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {result && (
              <p className={`rounded-xl p-3 text-sm ${result.correct ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {result.correct ? "Correct! Huge brain energy 🧠" : `Not quite. Correct answer: ${result.correct_answer}`}
              </p>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
