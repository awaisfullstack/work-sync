import PageHeader from "@/components/shared/PageHeader";
import ShiftsPageClient from "@/features/shifts/components/ShiftsPageClient";

export default function ShiftsPage() {
  return (
    <>
      <PageHeader
        title="Shifts"
        description="Review clock-in, clock-out, and worked time records."
        href="/shifts/create"
        buttonText="Add Shift"
      />

      <ShiftsPageClient />
    </>
  );
}
