import { Badge } from "@/components/ui/badge";
import { type VocabItem } from "@/lib/api";

type ProgressMiniCardProps = {
  vocab?: VocabItem | null;
};

export function ProgressMiniCard({ vocab }: ProgressMiniCardProps) {
  if (!vocab) {
    return (
      <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
        Progress appears here after your first quiz answer.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/70 bg-secondary/40 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h4 className="font-semibold">{vocab.word}</h4>
        <Badge variant={vocab.mastered ? "success" : "secondary"}>{vocab.mastered ? "Mastered" : "In progress"}</Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <p>
          <span className="text-muted-foreground">Score</span>
          <br />
          {vocab.score.toFixed(2)}
        </p>
        <p>
          <span className="text-muted-foreground">Attempts</span>
          <br />
          {vocab.attempts}
        </p>
        <p>
          <span className="text-muted-foreground">Correct</span>
          <br />
          {vocab.correct}
        </p>
      </div>
    </div>
  );
}
