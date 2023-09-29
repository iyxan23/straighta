"use client";

import { AnimatePresence } from "framer-motion";

export default function DashboardAnimatePresence({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <AnimatePresence key="dashboardAnimatePresence" mode="wait">
      {children}
    </AnimatePresence>
  );
}
