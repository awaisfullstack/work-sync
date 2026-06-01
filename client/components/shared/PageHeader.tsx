"use client"

import { PlusIcon } from "@phosphor-icons/react";
import { buttonVariants } from "../ui/button";
import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  href?: string;
  buttonText?: string;
};

const PageHeader = ({ title, description, href, buttonText }: Props) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {href && (
        <Link href={href} className={buttonVariants()}>
          <PlusIcon />
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
