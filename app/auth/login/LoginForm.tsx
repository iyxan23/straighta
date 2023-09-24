"use client";

import { authLoginResponse } from "@/app/api/schema";
import { redirect } from "next/navigation";
import React from "react";

export default function LoginForm() {
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<null | string>(null);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        setSubmitting(true);
        fetch("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        })
          .then((response) => response.json())
          .then((response) => authLoginResponse.safeParseAsync(response))
          .then((response) => {
            setSubmitting(false);
            if (!response.success) {
              setError("server mengirim respon yang tidak valid, lihat logs");
              console.error(response);
              return;
            }

            if (response.data.status === "err") {
              setError(response.data.reason);
              console.error("server memberikan error dengan alasan");
              console.error(response);
              return;
            }

            redirect(response.data.payload.redirect);
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
          ${submitting && "opacity-75 scale-95 animate-pulse"}`}
        type="submit"
        disabled={submitting}
        value="Login"
      />

      {error && (
        <p className="mt-4 text-red-500 font-semibold max-w-sm text-center px-4 py-2 bg-red-100 rounded-md">
          {error}
        </p>
      )}
    </form>
  );
}
