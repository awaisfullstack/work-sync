import { EditUserPageClient } from "@/modules/users/components/EditUserPageClient";

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;

  return <EditUserPageClient userId={id} />;
}
