import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { VocabItem } from "@/lib/api";

interface VocabListProps {
  items: VocabItem[];
  loading?: boolean;
}

export function VocabList({ items, loading }: VocabListProps) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading your words...</p>;
  }

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No vocab yet. Add your first word and let’s cook 🔥</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className="bg-white/90">
          <CardContent className="flex items-start justify-between gap-3 p-4">
            <div>
              <p className="font-semibold">{item.word}</p>
              {item.meaning && <p className="text-sm text-muted-foreground">{item.meaning}</p>}
              <p className="mt-1 text-xs text-muted-foreground">Score: {item.score.toFixed(2)}</p>
            </div>
            {item.mastered ? <Badge variant="success">Mastered</Badge> : <Badge variant="outline">Learning</Badge>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
