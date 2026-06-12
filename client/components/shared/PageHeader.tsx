"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { Role } from "@/enums";

type Props = {
  title: string;
  description?: string;
  href?: string;
  buttonText?: string;
};

const PageHeader = ({ title, description, href, buttonText }: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {user?.role === Role.ADMIN && href && (
        <Link href={href} className={buttonVariants()}>
          <PlusIcon />
          {buttonText ?? "Create"}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
