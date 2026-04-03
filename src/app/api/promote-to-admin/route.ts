import prisma from "@/lib/prisma";

/**
 * @summary 管理者への昇格API
 * @description 指定されたメールアドレスのユーザーを管理者に昇格させるAPI。最初の管理者が存在しない場合にのみ機能する。
 * @type {Object}
 * @returns {Response} APIのレスポンス
 */
export const POST = async (req: Request) => {
  const { email } = await req.json();
  if (!email) {
    return new Response("Email is required", { status: 400 });
  }
  try {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount !== 0) {
      return new Response("Admin already exists", { status: 400 });
    }
    await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });
    return new Response("User promoted to admin", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
