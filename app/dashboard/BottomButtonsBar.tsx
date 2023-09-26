"use client";

import { usePathname } from "next/navigation";
import LinkButton from "../../components/LinkButton";

const data: Record<string, () => JSX.Element> = {
  "/dashboard": () => <LinkButton href="/dashboard/study" text="Study" />,
  "/dashboard/subject": () => (
    <>
      <LinkButton href="/dashboard/subject/new" text="Create Subject" />
    </>
  ),
};

export default function BottomButtonsBar() {
  const pathname = usePathname();

  return data[pathname]();
}
