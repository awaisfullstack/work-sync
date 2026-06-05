import { Badge } from "@/components/ui/badge";
import type { ShiftStatus } from "../shiftTypes";

interface ShiftStatusBadgeProps {
  status: ShiftStatus;
}

export function ShiftStatusBadge({ status }: ShiftStatusBadgeProps) {
  if (status === "ACTIVE") {
    return <Badge className="bg-green-100 text-green-700">Active</Badge>;
  }

  return <Badge variant="secondary">Completed</Badge>;
}
