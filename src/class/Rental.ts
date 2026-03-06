import prisma from "@/lib/prisma";

export class Rental {
  id: string;
  studentId: string;
  bookId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    studentId: string,
    bookId: string,
    expiresAt: Date,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.studentId = studentId;
    this.bookId = bookId;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(data: {
    studentId: string;
    bookId: string;
    expiresAt: Date;
  }): Promise<Rental> {
    const created = await prisma.rental.create({
      data: {
        studentId: data.studentId,
        bookId: data.bookId,
        expiresAt: data.expiresAt,
      },
    });
    return new Rental(
      created.id,
      created.studentId,
      created.bookId,
      created.expiresAt,
      created.createdAt,
      created.updatedAt,
    );
  }

  static async getByUserAndISBN(
    studentId: string,
    isbn: string,
  ): Promise<Rental | null> {
    const rental = await prisma.rental.findFirst({
      where: {
        studentId,
        book: {
          isbn,
        },
      },
    });
    if (!rental) {
      return null;
    }
    return new Rental(
      rental.id,
      rental.studentId,
      rental.bookId,
      rental.expiresAt,
      rental.createdAt,
      rental.updatedAt,
    );
  }

  async save(): Promise<void> {
    await prisma.rental.update({
      where: { id: this.id },
      data: {
        studentId: this.studentId,
        bookId: this.bookId,
        expiresAt: this.expiresAt,
      },
    });
  }

  async delete(): Promise<void> {
    await prisma.rental.delete({
      where: { id: this.id },
    });
  }
}
