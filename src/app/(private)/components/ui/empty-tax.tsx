import React from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { ArrowUpRightIcon } from "lucide-react";

type EmptyProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  linkButton: string;
  labelButton: string;
};

export default function EmptyTax({
  title,
  linkButton,
  labelButton,
  description,
  icon: Icon,
}: EmptyProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon size={24} />
        </EmptyMedia>
        <EmptyTitle
          className={
            "mb-2 text-4xl/short font-semibold text-black dark:text-white"
          }
        >
          {title}
        </EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant={"default"}>
          <Link href={linkButton}>{labelButton}</Link>
        </Button>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="default"
      >
        <Link href={ROUTES.videos.tutoriais}>
          Saiba mais <ArrowUpRightIcon />
        </Link>
      </Button>
    </Empty>
  );
}
