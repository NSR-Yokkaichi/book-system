import prisma from "@/lib/prisma";
import { Rental } from "./Rental";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export class Student {
  id: string;
  userId: string;
  course: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    course: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.course = course;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async findBySession(): Promise<Student | null> {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return null;
    }
    return Student.findByUserId(session.user.id);
  }

  static async findByUserId(userId: string): Promise<Student | null> {
    return prisma.student
      .findUnique({
        where: { userId },
      })
      .then((student) =>
        student
          ? new Student(
              student.id,
              student.userId,
              student.course,
              student.createdAt,
              student.updatedAt,
            )
          : null,
      );
  }

  static async findAll(): Promise<Student[]> {
    return prisma.student
      .findMany()
      .then((students) =>
        students.map(
          (student) =>
            new Student(
              student.id,
              student.userId,
              student.course,
              student.createdAt,
              student.updatedAt,
            ),
        ),
      );
  }

  static async create(data: {
    userId: string;
    course: string;
  }): Promise<Student> {
    return prisma.student
      .create({
        data: {
          userId: data.userId,
          course: data.course,
        },
      })
      .then(
        (student) =>
          new Student(
            student.id,
            student.userId,
            student.course,
            student.createdAt,
            student.updatedAt,
          ),
      );
  }

  async save(): Promise<void> {
    await prisma.student.update({
      where: { id: this.id },
      data: {
        userId: this.userId,
        course: this.course,
      },
    });
  }

  async delete(): Promise<void> {
    await prisma.student.delete({
      where: { id: this.id },
    });
  }

  async getRentals(): Promise<Rental[]> {
    return prisma.rental
      .findMany({
        where: { studentId: this.id },
      })
      .then((rentals) =>
        rentals.map(
          (rental) =>
            new Rental(
              rental.id,
              rental.studentId,
              rental.bookId,
              rental.expiresAt,
              rental.createdAt,
              rental.updatedAt,
            ),
        ),
      );
  }
}
