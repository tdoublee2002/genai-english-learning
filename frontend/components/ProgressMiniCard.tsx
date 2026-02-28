import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { VocabItem } from "@/lib/api";

interface ProgressMiniCardProps {
  item: VocabItem;
}

export function ProgressMiniCard({ item }: ProgressMiniCardProps) {
  return (
    <Card className="bg-secondary/60">
      <CardContent className="grid grid-cols-2 gap-3 p-4 text-sm">
        <div>
          <p className="text-muted-foreground">Score</p>
          <p className="font-semibold">{item.score.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Attempts</p>
          <p className="font-semibold">{item.attempts}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Correct</p>
          <p className="font-semibold">{item.correct}</p>
        </div>
        <div className="flex items-end justify-end">
          {item.mastered ? <Badge variant="success">Mastered</Badge> : <Badge variant="secondary">In progress</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}
