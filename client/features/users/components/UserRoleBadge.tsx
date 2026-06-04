
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/features/auth/authTypes";

interface UserRoleBadgeProps {
  role: UserRole;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const className =
    role === "ADMIN"
      ? "border-purple-200 bg-purple-50 text-purple-700"
      : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <Badge variant="outline" className={className}>
      {role === "ADMIN" ? "Admin" : "Employee"}
    </Badge>
  );
}