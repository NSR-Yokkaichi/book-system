import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import {
  admin as adminPlugin,
  haveIBeenPwned,
  username,
} from "better-auth/plugins";
import { phpCrudApiAdapter } from "./authDbPlugin"; // ← 先ほど作成したアダプター
import { transporter } from "./email";
import { admin, student } from "./permissions";

export const auth = betterAuth({
  // 1. Prismaの代わりに php-crud-api アダプターを指定
  database: phpCrudApiAdapter({
    baseURL: process.env.PHP_CRUD_API_URL || "http://localhost/api.php/records",
    fetchOptions: process.env.PHP_CRUD_API_APIKEY
      ? {
          headers: {
            "X-API-KEY": process.env.PHP_CRUD_API_APIKEY,
          },
        }
      : undefined,
    usePlural: false, // テーブル名が複数形なら true に変更
  }),

  // 以下、元の設定をそのまま引き継ぎ
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
        // ※注意: better-authの仕様上、ここは "string" にしておくのが安全です
        type: "string",
        required: false,
        input: true,
      },
      expiresByGraduateAt: {
        type: "number",
        required: false,
        input: true,
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await transporter.sendMail({
        from: `四日市キャンパス 図書管理システム <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: user.email,
        subject: "【四日市キャンパス 図書管理システム】メール認証のお願い",
        html: `...（省略）...`,
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
});
