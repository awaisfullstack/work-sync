import UserViewPageClient from "@/modules/users/components/UserViewPageClient";

interface UserViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserViewPage({
  params,
}: UserViewPageProps) {
  const { id } = await params;

  return <UserViewPageClient userId={id} />;
}
