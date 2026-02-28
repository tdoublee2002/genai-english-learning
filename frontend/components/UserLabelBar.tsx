"use client";

import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserLabelBarProps {
  userLabel: string;
  onChange: (value: string) => void;
}

export function UserLabelBar({ userLabel, onChange }: UserLabelBarProps) {
  return (
    <div className="rounded-2xl border bg-white/85 p-4 shadow-sm backdrop-blur md:p-5">
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Users className="h-3.5 w-3.5" /> Simulated user session
      </p>
      <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <Input
          value={userLabel}
          onChange={(event) => onChange(event.target.value)}
          placeholder="internal"
          className="lg:max-w-sm"
        />
        <p className="text-sm text-muted-foreground">Switch label to test multi-user vocab and quizzes ✨</p>
      </div>
    </div>
  );
}
