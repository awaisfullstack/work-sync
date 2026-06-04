import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function UserViewSkeleton() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-md bg-slate-100" />
        <div>
          <div className="h-7 w-40 animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100" />
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse rounded-full bg-slate-100" />
            <div>
              <div className="h-7 w-48 animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="h-px bg-slate-100" />

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
        </CardHeader>

        <CardContent>
          <div className="h-40 animate-pulse rounded bg-slate-100" />
        </CardContent>
      </Card>
    </section>
  );
}
