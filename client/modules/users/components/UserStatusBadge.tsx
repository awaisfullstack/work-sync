import { Badge } from "@/components/ui/badge";

interface UserStatusBadgeProps {
  isActive: boolean;
}

export function UserStatusBadge({ isActive }: UserStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={
        isActive
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-slate-200 bg-slate-50 text-slate-600"
      }
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}
