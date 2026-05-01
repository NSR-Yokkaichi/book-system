"use server";

import { headers } from "next/headers";
import { forbidden, unauthorized } from "next/navigation";
import { ulid } from "ulid";
import webpush, { WebPushError } from "web-push";
import { auth } from "./auth";
import { dbClient } from "./db";

webpush.setVapidDetails(
  "mailto:webmaster@uniproject.jp",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

/**
 * @summary 通知を受け取る端末を追加する
 * @async
 * @function subscribeUser
 * @param sub ブラウザから出てくるPushSubscriptionJSON
 * @returns 成功可否
 * @author yuito-it<yuito@yuito-it.jp>
 */
export async function subscribeUser(sub: PushSubscriptionJSON) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) unauthorized();
  const userId = session.user.id;
  const { endpoint } = sub;
  const authKey = sub.keys?.auth;
  const p256dhKey = sub.keys?.p256dh;

  if (!authKey || !p256dhKey) {
    throw new Error("Invalid subscription keys");
  }
  if (!endpoint) {
    throw new Error("Invalid subscription endpoint");
  }

  await dbClient.pushSubscription.upsert({
    where: {
      endpoint, // ←ユニーク扱いにする
    },
    update: {
      p256dh: p256dhKey,
      auth: authKey,
    },
    create: {
      id: ulid(),
      userId,
      endpoint,
      p256dh: p256dhKey,
      auth: authKey,
    },
  });

  return { success: true };
}

/**
 * @summary 通知の購読を解除する
 * @param endpoint VAPエンドポイント
 * @returns 成功可否
 * @function unsubscribeUser
 * @async
 * @author yuito-it<yuito@yuito-it.jp>
 */
export async function unsubscribeUser(endpoint: string) {
  await dbClient.pushSubscription.delete({
    where: { endpoint },
  });

  return { success: true };
}

/**
 * @summary 通知を全員に対して送信する
 * @param message メッセージ
 * @returns 成功可否
 * @function sendEveryone
 * @async
 * @author yuito-it<yuito@yuito-it.jp>
 */
export async function sendEveryone(message: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) unauthorized();
  if (session.user.role !== "admin") forbidden();
  const subs = await dbClient.pushSubscription.findMany();

  for (const sub of subs) {
    const pushSub = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    };

    try {
      await webpush.sendNotification(
        pushSub,
        JSON.stringify({
          title: "通知",
          body: message,
        }),
      );
    } catch (err) {
      console.error("Push失敗:", err);

      if (
        err instanceof WebPushError &&
        (err.statusCode === 410 || err.statusCode === 404)
      ) {
        await dbClient.pushSubscription.delete({
          where: { id: sub.id },
        });
      }
    }
  }

  return { success: true };
}

/**
 * @summary 一人のユーザーに通知を送る
 * @param userId 送信先のユーザーID
 * @param title タイトル
 * @param message メッセージ
 * @async
 * @function sendToUser
 * @author yuito-it<yuito@yuito-it.jp>
 */
export async function sendToUser(
  userId: string,
  title: string,
  message: string,
) {
  const subs = await dbClient.pushSubscription.findMany({
    where: { userId },
  });

  for (const sub of subs) {
    const pushSub = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    };

    await webpush.sendNotification(
      pushSub,
      JSON.stringify({
        title,
        body: message,
      }),
    );
  }
}
