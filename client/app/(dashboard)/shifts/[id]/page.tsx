import ShiftViewPageClient from "@/features/shifts/components/ShiftViewPageClient";

interface ShiftViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ShiftViewPage({ params }: ShiftViewPageProps) {
  const { id } = await params;

  return <ShiftViewPageClient shiftId={id} />;
}
