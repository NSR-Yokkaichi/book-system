import { passkeyClient } from "@better-auth/passkey/client";
import { adminClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, admin, student } from "./permissions";

/**
 * @summary BetterAuthクライアントのインスタンス
 * @description BetterAuthクライアントのインスタンスを作成する。"use client"があるファイルではこれを用いることができる。
 * @type {Object}
 * @author yuito-it <yuito@yuito-it.jp>
 * @see https://better-auth.com/docs/concepts/client
 */
export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    adminClient({
      ac,
      roles: {
        admin,
        student,
      },
    }),
    passkeyClient(),
  ],
});
