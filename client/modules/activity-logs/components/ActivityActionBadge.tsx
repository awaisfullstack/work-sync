import { Badge } from "@/components/ui/badge";
import type { ActivityAction } from "@/types/activity-log.types";
import { formatActivityLabel, getActionTone } from "../utils";

interface ActivityActionBadgeProps {
  action: ActivityAction;
}

export function ActivityActionBadge({ action }: ActivityActionBadgeProps) {
  return <Badge variant={getActionTone(action)}>{formatActivityLabel(action)}</Badge>;
}
