"use client";

import BookIcon from "mdi-react/BookIcon";
import ViewWeekIcon from "mdi-react/ViewWeekIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const data = [
  {
    href: "/dashboard",
    icon: (className: string) => (
      <ViewWeekIcon className={className} size={24} />
    ),
  },
  {
    href: "/dashboard/subject",
    icon: (className: string) => <BookIcon className={className} size={24} />,
  },
];

const UNSELECTED_LINK =
  "border border-sky-100 rounded-full p-2 transition-all group hover:bg-sky-100 active:scale-95 focus:outline-none focus:ring focus:ring-sky-100";
const SELECTED_LINK =
  "bg-sky-200 rounded-full p-2 transition-all group hover:bg-sky-300 active:scale-95 focus:outline-none focus:ring focus:ring-sky-100";

const UNSELECTED_ICON = "fill-sky-200 group-hover:fill-sky-300 transition-all";
const SELECTED_ICON = "fill-sky-500 group-hover:fill-sky-600 transition-all";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row items-center gap-2">
      {data.map(({ href, icon }) =>
        pathname == href ? (
          <Link
            tabIndex={1}
            aria-selected={true}
            key={href}
            href={href}
            className={SELECTED_LINK}
          >
            {icon(SELECTED_ICON)}
          </Link>
        ) : (
          <Link
            tabIndex={1}
            aria-selected={false}
            key={href}
            href={href}
            className={UNSELECTED_LINK}
          >
            {icon(UNSELECTED_ICON)}
          </Link>
        )
      )}
    </nav>
  );
}
