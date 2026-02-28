"use client";

import { Input } from "@/components/ui/input";

interface UserLabelBarProps {
  userLabel: string;
  onChange: (value: string) => void;
}

export function UserLabelBar({ userLabel, onChange }: UserLabelBarProps) {
  return (
    <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Simulated user session</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={userLabel}
          onChange={(event) => onChange(event.target.value)}
          placeholder="internal"
          className="sm:max-w-xs"
        />
        <p className="text-sm text-muted-foreground">Switch label to test multi-user vocab and quizzes ✨</p>
      </div>
    </div>
  );
}
