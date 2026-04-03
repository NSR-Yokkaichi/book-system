import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  admin as adminPlugin,
  haveIBeenPwned,
  username,
} from "better-auth/plugins";
import prisma from "@/lib/prisma";
import { transporter } from "./email";
import { admin, student } from "./permissions";

/**
 * @summary BetterAuthクラスのインスタンス
 * @description BetterAuthクラスのインスタンスを作成する。サーバーコンポーネントやAPIルートでこれを用いることができる。
 * @type {Object}
 * @author yuito-it <yuito@yuito-it.jp>
 * @see https://better-auth.com/docs/concepts/api
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    // Google OAuth / OIDCの設定
    // hdで、nnn.ed.jpに制限する
    // 暗黙的なサインアップは位置情報を確認するため、無効にする
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      hd: "nnn.ed.jp",
      disableImplicitSignUp: true,
      disableSignUp: false,
      overrideUserInfoOnSignIn: true,
    },
  },
  // 管理者用にメールアドレスとパスワードでのサインインを有効にする
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    // メールアドレスの変更を有効にする
    changeEmail: {
      enabled: true,
    },
    additionalFields: {
      // コースの選択肢を追加する
      course: {
        type: ["1days", "3days", "5days", "online"],
        required: false,
        input: true,
        index: true,
      },
      // 卒業予定年月を追加する
      expiresByGraduateAt: {
        type: "number",
        required: false,
        input: true,
        index: true,
      },
    },
  },
  emailVerification: {
    // メール認証のメールを送信する関数を定義する
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await transporter.sendMail({
        from: `四日市キャンパス 図書管理システム <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: user.email,
        subject: "【四日市キャンパス 図書管理システム】メール認証のお願い",
        html: `
          <header style="text-align: left; padding: 2rem;">
            <h1 style="margin: 0; text-align: left;">四日市キャンパス 図書管理システム</h1>
          </header>
          <main style="padding: 2rem;">
            <p>こんにちは、${user.name || "ユーザー"}さん！</p>
            <p>以下のリンクをクリックして、メールアドレスの認証を完了してください。</p>
            <a href="${url}" style="display: inline-block; padding: 0.75rem 1.5rem; background-color: #0070f3; color: white; text-decoration: none; border-radius: 4px;">メールアドレスを認証する</a>
            <p style="margin-top: 1rem;">もしこのメールに心当たりがない場合は、このメールを無視してください。</p>
          </main>
          <footer style="text-align: left; padding: 2rem; font-size: 0.875rem; color: #666;">
            <p style="text-align: left;">&copy; ${new Date().getFullYear()} N/S/R 高等学校 四日市キャンパス 図書管理システム</p>
          </footer>
        `,
      });
    },
  },
  plugins: [
    // ユーザー名とパスワードでのサインインを有効にする
    username(),
    // 管理者プラグインを有効化し、ロールで権限を管理する
    adminPlugin({
      defaultRole: "student",
      roles: {
        admin,
        student,
      },
    }),
    // パスワードが過去に漏洩していないかを確認するプラグインを有効にする
    haveIBeenPwned({
      customPasswordCompromisedMessage:
        "パスワードが過去に漏洩している可能性があります。別のパスワードを選択してください。",
    }),
    // パスキー認証を有効にする
    passkey(),
  ],
  experimental: { joins: true },
});
