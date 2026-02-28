"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VocabAddFormProps {
  onSubmit: (payload: {
    word: string;
    meaning?: string;
    example_sentence?: string;
    level?: string;
    tags?: string;
  }) => Promise<void>;
  disabled?: boolean;
}

export function VocabAddForm({ onSubmit, disabled }: VocabAddFormProps) {
  const [word, setWord] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedWord = word.trim();
    if (!normalizedWord) return;

    setSubmitting(true);
    try {
      await onSubmit({ word: normalizedWord });
      setWord("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Type a word (e.g., resilient)"
          value={word}
          onChange={(event) => setWord(event.target.value)}
          required
        />
        <Button
          type="submit"
          disabled={disabled || submitting}
          className="shrink-0"
        >
          <Sparkles className="mr-1 h-4 w-4" />
          {submitting ? "Adding..." : "Add"}
        </Button>
      </div>
    </form>
  );
}
