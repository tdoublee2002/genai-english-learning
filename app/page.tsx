"use client";

import { useEffect, useState } from "react";
import { getVocab, type VocabItem } from "@/lib/api";
import { UserLabelBar } from "@/components/UserLabelBar";
import { VocabAddForm } from "@/components/VocabAddForm";
import { VocabList } from "@/components/VocabList";
import { QuizCard } from "@/components/QuizCard";
import { ProgressMiniCard } from "@/components/ProgressMiniCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DEFAULT_USER_LABEL = "internal";

export default function HomePage() {
  const [userLabel, setUserLabel] = useState(DEFAULT_USER_LABEL);
  const [vocabItems, setVocabItems] = useState<VocabItem[]>([]);
  const [loadingVocab, setLoadingVocab] = useState(false);
  const [vocabError, setVocabError] = useState<string | null>(null);
  const [latestProgress, setLatestProgress] = useState<VocabItem | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("user_label");
    if (stored?.trim()) {
      setUserLabel(stored.trim());
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("user_label", userLabel);
    const load = async () => {
      setLoadingVocab(true);
      setVocabError(null);
      try {
        const list = await getVocab(userLabel);
        setVocabItems(list);
      } catch {
        setVocabError("Could not load vocab list. Please refresh.");
        setVocabItems([]);
      } finally {
        setLoadingVocab(false);
      }
    };

    void load();
  }, [userLabel]);

  const handleAdded = (item: VocabItem) => {
    setVocabItems((current) => {
      const withoutWord = current.filter((existing) => existing.word.toLowerCase() !== item.word.toLowerCase());
      return [item, ...withoutWord];
    });
  };

  const handleProgressUpdate = (updated: VocabItem) => {
    setLatestProgress(updated);
    setVocabItems((current) => current.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)));
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:py-10">
      <header className="rounded-2xl border border-border/70 bg-gradient-to-r from-white via-purple-50 to-indigo-50 p-6 shadow-soft">
        <p className="text-sm font-medium text-primary">genai-english-learning</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">Level up your English, one word at a time ✨</h1>
        <p className="mt-2 text-sm text-muted-foreground">Build your own vocab bank and challenge yourself in Quiz Arena.</p>
      </header>

      <UserLabelBar
        userLabel={userLabel}
        onChange={(nextLabel) => {
          setUserLabel(nextLabel);
          setLatestProgress(null);
        }}
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Vocabulary</CardTitle>
            <CardDescription>Drop words you meet in docs, chats, or meetings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <VocabAddForm userLabel={userLabel} onAdded={handleAdded} />
            <Separator />
            {vocabError ? <p className="text-sm text-rose-600">{vocabError}</p> : null}
            <VocabList items={vocabItems} loading={loadingVocab} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Arena</CardTitle>
            <CardDescription>Tap an answer and see your mastery stats evolve.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <QuizCard userLabel={userLabel} onProgressUpdate={handleProgressUpdate} />
            <Separator />
            <ProgressMiniCard vocab={latestProgress} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
