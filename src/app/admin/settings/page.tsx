import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // お使いの認証ライブラリ
import prisma from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // セッションがない場合はリダイレクト
  if (!session) {
    redirect("/signin");
  }

  // サーバーアクション（このファイル内で定義可能）
  async function updateUsername(formData: FormData) {
    "use server";

    const newName = formData.get("username") as string;

    if (!newName || newName.length < 2) return;

    // --- ここでDB更新処理 ---
    await prisma.user.update({
      where: { id: session!.user.id },
      data: { name: newName },
    });

    console.log("名前を更新しました:", newName);

    // キャッシュを更新して、サイドバーなどの表示を最新にする
    revalidatePath("/", "layout");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-6">プロフィール設定</h1>

      <form action={updateUsername} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ユーザーネーム
          </label>
          <input
            name="username"
            type="text"
            defaultValue={session.user.name} // 現在の値を初期表示
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          保存する
        </button>
      </form>
    </div>
  );
}
