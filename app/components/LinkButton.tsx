import Link from "next/link";

export default function LinkButton({ text, href }: { text: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg text-lg shadow-md bg-sky-500 active:bg-sky-600 active:scale-[97%] px-8 py-3 align-middle text-center text-white font-bold hover:bg-sky-400 focus:outline-none focus:ring focus:ring-sky-200 hover:shadow-lg transition-all"
    >
      {text}
    </Link>
  );
}
