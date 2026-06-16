import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ActivityEntityType } from "@/types/activity-log.types";
import { formatActivityLabel, getEntityClassName } from "../utils";

interface ActivityEntityBadgeProps {
  entityType: ActivityEntityType;
}

export function ActivityEntityBadge({ entityType }: ActivityEntityBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("border", getEntityClassName(entityType))}
    >
      {formatActivityLabel(entityType)}
    </Badge>
  );
}
