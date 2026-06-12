import { Badge } from "@/components/ui/badge";
import type { Role } from "@/enums";

interface RoleBadgeProps {
  role: Role;
}

export function RoleBadge({ role }: RoleBadgeProps) {
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
