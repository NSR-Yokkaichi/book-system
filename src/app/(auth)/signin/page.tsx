"use client";
import { authClient } from "@/lib/auth-client";

export default async function Home() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await authClient.signIn.social({
          provider: "google",
        });
      }}
    >
      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
      >
        Sign in with Google
      </button>
    </form>
  );
}
