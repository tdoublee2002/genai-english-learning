"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { upsertVocab, type VocabItem } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type VocabAddFormProps = {
  userLabel: string;
  onAdded: (item: VocabItem) => void;
};

const initialForm = {
  word: "",
  meaning: "",
  example_sentence: "",
  level: "",
  tags: "",
};

export function VocabAddForm({ userLabel, onAdded }: VocabAddFormProps) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.word.trim()) {
      toast.error("Word is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const item = await upsertVocab({
        user_label: userLabel,
        ...Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim() || undefined])),
        word: form.word.trim(),
      });
      onAdded(item);
      setForm(initialForm);
      toast.success(`✨ Added \"${item.word}\" to your vocab list`);
    } catch {
      toast.error("Could not add vocab right now. Try again?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <Input placeholder="Word (e.g. ubiquitous)" value={form.word} onChange={(event) => update("word", event.target.value)} />
      <Input placeholder="Meaning" value={form.meaning} onChange={(event) => update("meaning", event.target.value)} />
      <Input
        placeholder="Example sentence"
        value={form.example_sentence}
        onChange={(event) => update("example_sentence", event.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Level" value={form.level} onChange={(event) => update("level", event.target.value)} />
        <Input placeholder="Tags (comma)" value={form.tags} onChange={(event) => update("tags", event.target.value)} />
      </div>
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add vocab"}
      </Button>
    </form>
  );
}
