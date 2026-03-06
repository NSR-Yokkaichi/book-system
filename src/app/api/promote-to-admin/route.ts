import prisma from "@/lib/prisma";

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
