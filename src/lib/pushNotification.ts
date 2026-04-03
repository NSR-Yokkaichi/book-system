"use server";

import { headers } from "next/headers";
import { forbidden, unauthorized } from "next/navigation";
import webpush, { WebPushError } from "web-push";
import { auth } from "./auth";
import prisma from "./prisma";

webpush.setVapidDetails(
  "mailto:webmaster@uniproject.jp",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

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

  await prisma.pushSubscription.upsert({
    where: {
      endpoint, // ←ユニーク扱いにする
    },
    update: {
      p256dh: p256dhKey,
      auth: authKey,
    },
    create: {
      id: crypto.randomUUID(),
      userId,
      endpoint,
      p256dh: p256dhKey,
      auth: authKey,
    },
  });

  return { success: true };
}

export async function unsubscribeUser(endpoint: string) {
  await prisma.pushSubscription.delete({
    where: { endpoint },
  });

  return { success: true };
}

export async function sendEveryone(message: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) unauthorized();
  if (session.user.role !== "admin") forbidden();
  const subs = await prisma.pushSubscription.findMany();

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
        await prisma.pushSubscription.delete({
          where: { id: sub.id },
        });
      }
    }
  }

  return { success: true };
}

export async function sendToUser(
  userId: string,
  title: string,
  message: string,
) {
  const subs = await prisma.pushSubscription.findMany({
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
