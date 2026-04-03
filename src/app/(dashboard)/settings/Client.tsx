"use client";

import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import type { User } from "better-auth";
import { unauthorized } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import StudentCourseSelector from "@/components/StudentCourseSelector";
import { authClient } from "@/lib/auth-client";
import {
  sendToUser,
  subscribeUser,
  unsubscribeUser,
} from "@/lib/pushNotification";
import { updateUsername } from "./actions";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}

export default function SettingsPageClient({
  user,
}: {
  user: User & { role?: string | string[] | null } & {
    course?: string | null;
    expiresByGraduateAt?: number | null;
  } & {
    displayUsername?: string | null;
  };
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [isUpdating, setIsUpdating] = useState(false);
  const [username, setUsername] = useState(
    user.displayUsername || user.name || "",
  );
  const [expiresByGraduateAt, setExpiresByGraduateAt] = useState(
    user.expiresByGraduateAt?.toString() || "2027",
  );

  // Push関連
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: 起動時に1度だけ実行したい
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (e) {
      console.error("Service Workerの登録に失敗:", e);
      enqueueSnackbar("Service Workerの登録に失敗しました", {
        variant: "error",
      });
    }
  }

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
      if (!vapidKey) return;

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      setSubscription(sub);

      // DB保存
      const serializedSub = JSON.parse(JSON.stringify(sub));

      const session = await authClient.getSession();
      if (!session.data) {
        unauthorized();
      }
      await subscribeUser(serializedSub);
      enqueueSnackbar("Push通知の購読に成功しました", { variant: "success" });
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Push通知の購読に失敗しました", { variant: "error" });
    }
  }

  async function unsubscribe() {
    try {
      await subscription?.unsubscribe();
      setSubscription(null);

      await unsubscribeUser(subscription?.endpoint || "");
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Push通知の購読解除に失敗しました", {
        variant: "error",
      });
    }
  }

  async function handleSendTest() {
    try {
      if (!subscription) return;

      const session = await authClient.getSession();
      if (!session.data) {
        unauthorized();
      }

      await sendToUser(
        session.data.user.id,
        `テスト通知`,
        `テスト通知: ${new Date().toLocaleTimeString()}`,
      );
      enqueueSnackbar("テスト通知を送信しました", { variant: "success" });
    } catch (e) {
      console.error(e);
      enqueueSnackbar("テスト通知の送信に失敗しました", { variant: "error" });
    }
  }

  return (
    <Stack spacing={2} component={"main"} justifyContent={"center"}>
      <Typography variant="h4">ユーザー設定</Typography>

      <Stack
        component="form"
        action={async (formdata: FormData) => {
          setIsUpdating(true);
          try {
            await updateUsername(formdata);
            enqueueSnackbar("ユーザー情報を更新しました", {
              variant: "success",
            });
          } catch (e) {
            console.error(e);
            enqueueSnackbar("ユーザー名の更新に失敗しました", {
              variant: "error",
            });
          } finally {
            setIsUpdating(false);
          }
        }}
        spacing={2}
        padding={2}
        maxWidth="400px"
        bgcolor={"background.paper"}
        borderRadius={2}
        border={"1px solid #ccc"}
      >
        <TextField
          name="username"
          label="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
        />
        <StudentCourseSelector defaultValue={user.course || "1days"} />
        <TextField
          id="expiresByGraduateAt"
          name="expiresByGraduateAt"
          label="卒業予定年"
          type="number"
          value={expiresByGraduateAt}
          onChange={(e) => setExpiresByGraduateAt(e.target.value)}
          fullWidth
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isUpdating}
        >
          更新
        </Button>
      </Stack>
      <Divider />
      <Stack
        spacing={2}
        padding={2}
        maxWidth="400px"
        bgcolor={"background.paper"}
        borderRadius={2}
        border={"1px solid #ccc"}
      >
        <Typography variant="h6">Push通知設定</Typography>
        {subscription ? (
          <>
            <Typography>通知を受信中</Typography>
            <Button variant="outlined" onClick={unsubscribe}>
              通知の受信を停止
            </Button>

            <Button variant="contained" onClick={handleSendTest}>
              テスト通知を送る
            </Button>
          </>
        ) : (
          <>
            <Typography>通知を受信していません</Typography>
            <Button variant="contained" onClick={subscribeToPush}>
              通知を受信する
            </Button>
          </>
        )}
      </Stack>
    </Stack>
  );
}
