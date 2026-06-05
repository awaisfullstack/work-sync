import { ManualShiftForm } from "@/features/shifts/components/ManualShiftForm";

export default function CreateShiftPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create Manual Shift
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a completed shift record for an employee.
        </p>
      </div>

      <ManualShiftForm />
    </section>
  );
}
