
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function TaskViewSkeleton() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-96 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
            </CardHeader>
            <CardContent>
              <div className="h-6 w-28 animate-pulse rounded bg-slate-100" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="h-40 animate-pulse rounded bg-slate-100" />
        </CardContent>
      </Card>
    </section>
  );
}