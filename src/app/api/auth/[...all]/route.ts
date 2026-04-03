import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth"; // path to your auth file

/**
 * @summary 認証APIのエンドポイント
 * @description 認証APIのエンドポイントを定義する。これにより、認証関連のリクエストを処理することができる。
 * @type {Object}
 * @see https://better-auth.com/docs/installation#mount-handler
 */
export const { POST, GET } = toNextJsHandler(auth);
