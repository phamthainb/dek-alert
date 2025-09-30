import { cn } from "@/lib/utils";
import type { MonitorStatus } from "@/lib/types";

const statusClasses: Record<MonitorStatus, string> = {
  normal: "bg-status-normal",
  alert: "bg-status-alert",
  pending: "bg-yellow-500",
};

export function StatusIndicator({ status }: { status: MonitorStatus }) {
  return (
    <div
      className={cn("h-3 w-3 rounded-full", statusClasses[status])}
      aria-label={`Status: ${status}`}
      title={`Status: ${status}`}
    />
  );
}
