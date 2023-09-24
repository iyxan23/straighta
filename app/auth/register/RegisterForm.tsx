"use client";

import { authRegisterResponse } from "@/app/api/schema";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function LoginForm() {
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { push } = useRouter();

  return (
    <motion.div layout>
      <motion.section
        layout
        initial={{
          scale: 0.75,
          transform: "translateY(1rem)",
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
          transform: "translateY(0)",
        }}
        exit={{
          scale: 0.9,
          opacity: 0,
        }}
        className="px-8 py-6 bg-white rounded-lg shadow-md flex flex-col gap-6"
      >
        <h1 className="text-2xl text-slate-700 font-bold">Register</h1>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();

            setSubmitting(true);
            setError(null);

            fetch("/api/auth/register", {
              method: "POST",
              body: JSON.stringify({ username, password }),
            })
              .then((response) => response.json())
              .then((response) => authRegisterResponse.safeParseAsync(response))
              .then((response) => {
                setSubmitting(false);
                if (!response.success) {
                  setError(
                    "server mengirim respon yang tidak valid, lihat logs"
                  );
                  console.error(response);
                  return;
                }

                if (response.data.status === "err") {
                  setError(response.data.reason);
                  console.error("server memberikan error dengan alasan");
                  console.error(response);
                  return;
                }

                push(response.data.payload.redirect);
              });
          }}
          className="flex flex-col gap-2"
        >
          <input
            className={`
          py-2 px-4 bg-white border border-slate-200 rounded-md hover:bg-slate-50
          hover:border-slate-300 focus:outline-none focus:ring focus:ring-sky-200 transition-all
          ${submitting && "opacity-75"}`}
            type="text"
            name="username"
            id="username"
            disabled={submitting}
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            placeholder="Username"
          />

          <input
            className={`
          py-2 px-4 bg-white border border-slate-200 rounded-md hover:bg-slate-50
          hover:border-slate-300 focus:outline-none focus:ring focus:ring-sky-200 transition-all
          ${submitting && "opacity-75"}`}
            type="password"
            name="password"
            id="password"
            disabled={submitting}
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            placeholder="Password"
          />

          <input
            className={`
          cursor-pointer rounded-lg mt-4 shadow-md bg-sky-500 active:bg-sky-600
          active:scale-[97%] px-8 py-3 align-middle text-center text-white font-bold
          hover:bg-sky-400 focus:outline-none focus:ring focus:ring-sky-200 hover:shadow-lg
          transition-all
          ${submitting && "opacity-75 scale-95 animate-pulse cursor-wait"}`}
            type="submit"
            disabled={submitting}
            value="Register"
          />
          <Link className="text-sm text-sky-500 text-center" href="/auth/login">
            Sudah punya akun?
          </Link>
        </form>
      </motion.section>
      {error && (
        <motion.div
          layout
          className="mt-4 text-red-500 cursor-pointer font-semibold max-w-sm text-center px-4 py-2 bg-red-100 rounded-md"
          initial={{
            transform: "translateY(100%)",
            scale: 0.9,
            opacity: 0,
          }}
          animate={{ transform: "translateY(0)", scale: 1, opacity: 1 }}
          exit={{ transform: "translateY(100%)", scale: 0.9, opacity: 0 }}
          onClick={() => setError(null)}
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}
