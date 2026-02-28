"use client";

import { useState } from "react";
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

const initialState = {
  word: "",
  meaning: "",
  example_sentence: "",
  level: "",
  tags: ""
};

export function VocabAddForm({ onSubmit, disabled }: VocabAddFormProps) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.word.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        word: form.word.trim(),
        meaning: form.meaning.trim() || undefined,
        example_sentence: form.example_sentence.trim() || undefined,
        level: form.level.trim() || undefined,
        tags: form.tags.trim() || undefined
      });
      setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        placeholder="Word (e.g., resilient)"
        value={form.word}
        onChange={(event) => setForm((prev) => ({ ...prev, word: event.target.value }))}
        required
      />
      <Input
        placeholder="Meaning"
        value={form.meaning}
        onChange={(event) => setForm((prev) => ({ ...prev, meaning: event.target.value }))}
      />
      <Input
        placeholder="Example sentence"
        value={form.example_sentence}
        onChange={(event) => setForm((prev) => ({ ...prev, example_sentence: event.target.value }))}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          placeholder="Level"
          value={form.level}
          onChange={(event) => setForm((prev) => ({ ...prev, level: event.target.value }))}
        />
        <Input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
        />
      </div>
      <Button type="submit" className="w-full" disabled={disabled || submitting}>
        {submitting ? "Adding..." : "Add vocab"}
      </Button>
    </form>
  );
}
