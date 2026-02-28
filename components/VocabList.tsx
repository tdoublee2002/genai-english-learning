import { Badge } from "@/components/ui/badge";
import { type VocabItem } from "@/lib/api";

type VocabListProps = {
  items: VocabItem[];
  loading?: boolean;
};

export function VocabList({ items, loading }: VocabListProps) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading your vocab stash...</p>;
  }

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No words yet. Add your first word to start the streak.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="rounded-xl border border-border/70 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium">{item.word}</p>
              {item.meaning ? <p className="text-sm text-muted-foreground">{item.meaning}</p> : null}
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant={item.mastered ? "success" : "secondary"}>{item.mastered ? "Mastered" : "Learning"}</Badge>
              <span className="text-xs text-muted-foreground">Score {item.score.toFixed(2)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
