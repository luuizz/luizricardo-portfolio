"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TableHeaderActionsProps {
  title: string;
  newButtonLink: string;
}

export default function TableHeaderActions({
  title,
  newButtonLink,
}: TableHeaderActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-inter text-xl font-semibold">{title}</h2>
      <Button asChild>
        <Link href={newButtonLink} className="flex items-center gap-2">
          Novo
        </Link>
      </Button>
    </div>
  );
}
