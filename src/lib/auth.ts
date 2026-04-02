import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  admin as adminPlugin,
  haveIBeenPwned,
  username,
} from "better-auth/plugins";
// If your Prisma file is located elsewhere, you can change the path
import prisma from "@/lib/prisma";
import { transporter } from "./email";
import { admin, student } from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      hd: "nnn.ed.jp",
      disableImplicitSignUp: true,
      disableSignUp: false,
      overrideUserInfoOnSignIn: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    additionalFields: {
      course: {
        type: ["1days", "3days", "5days", "online"],
        required: false,
        input: true,
        index: true,
      },
      expiresByGraduateAt: {
        type: "number",
        required: false,
        input: true,
        index: true,
      },
    },
  },
  emailVerification: {
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
    username(),
    adminPlugin({
      defaultRole: "student",
      roles: {
        admin,
        student,
      },
    }),
    haveIBeenPwned({
      customPasswordCompromisedMessage:
        "パスワードが過去に漏洩している可能性があります。別のパスワードを選択してください。",
    }),
    passkey(),
  ],
  experimental: { joins: true },
});
