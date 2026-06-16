"use client";

import { Button } from "@/components/ui/button";

interface LoadTableErrorProps {
  title?: string;
  message?: string;
  refetch: () => void;
}

const LoadTableError = ({ title, message, refetch }: LoadTableErrorProps) => {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <h3 className="font-semibold text-red-700">{title}</h3>
      <p className="mt-1 text-sm text-red-600">
        {message || "Please check your backend API or authentication token."}
      </p>

      <Button variant="outline" className="mt-4" onClick={() => refetch()}>
        Retry
      </Button>
    </div>
  );
};

export default LoadTableError;
