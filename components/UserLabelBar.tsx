"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type UserLabelBarProps = {
  userLabel: string;
  onChange: (value: string) => void;
};

export function UserLabelBar({ userLabel, onChange }: UserLabelBarProps) {
  const [value, setValue] = useState(userLabel);

  useEffect(() => {
    setValue(userLabel);
  }, [userLabel]);

  return (
    <div className="rounded-2xl border border-border/70 bg-card/90 p-4 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Squad mode</p>
          <h2 className="text-lg font-semibold">Who&apos;s practicing today?</h2>
        </div>
        <Badge variant="secondary" className="w-fit">
          Saved locally
        </Badge>
      </div>
      <div className="mt-3 flex gap-2">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="internal"
          onBlur={() => onChange(value.trim() || "internal")}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onChange(value.trim() || "internal");
            }
          }}
        />
      </div>
    </div>
  );
}
