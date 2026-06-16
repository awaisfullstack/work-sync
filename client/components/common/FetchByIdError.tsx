"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface FetchByIdErrorProps {
  title?: string;
  message?: string;
  refetch?: () => void;
  backLink?: string;
  backLinkText?: string;
}
const FetchByIdError = ({
  title = "Item not found",
  message = "This item does not exist or you do not have permission to access it.",
  refetch,
  backLink,
  backLinkText,
}: FetchByIdErrorProps) => {
  return (
    <section className="space-y-6">
      {backLink && backLinkText && (
        <Button variant="outline" asChild>
          <Link href={backLink}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLinkText}
          </Link>
        </Button>
      )}

      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="text-lg font-semibold text-red-700">{title}</h1>

        <p className="mt-1 text-sm text-red-600">{message}</p>

        {refetch && (
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        )}
      </div>
    </section>
  );
};

export default FetchByIdError;
