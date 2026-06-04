import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DepartmentViewSkeleton() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-md bg-slate-100" />
        <div>
          <div className="h-7 w-52 animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100" />
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="h-7 w-56 animate-pulse rounded bg-slate-100" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="h-px bg-slate-100" />

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
