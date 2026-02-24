"use server";

import { Book } from "@/class/Book";
import { Campus } from "@/class/Campus";
import prisma from "@/lib/prisma";

export const createSampleData = async () => {
  const user = await prisma.user.findFirst();
  if (!user) {
    return false;
  }
  await prisma.student.create({
    data: {
      userId: user!.id,
      course: "週3日コース",
    },
  });
  await Book.create({
    name: "サンプルブック",
    isbn: "1234567890123",
    author: "サンプル著者",
    publisher: "サンプル出版社",
  });
  await Campus.create({
    name: "サンプルキャンパス",
    rentalDeadline: 14,
  });
  return true;
};
