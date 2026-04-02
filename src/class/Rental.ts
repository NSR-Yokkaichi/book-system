import prisma from "@/lib/prisma";
import { Book } from "./Book";

export class Rental {
  id: string;
  userId: string;
  bookId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    bookId: string,
    expiresAt: Date,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.bookId = bookId;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(data: {
    userId: string;
    bookId: string;
    expiresAt: Date;
  }): Promise<Rental> {
    const created = await prisma.rental.create({
      data: {
        userId: data.userId,
        bookId: data.bookId,
        expiresAt: data.expiresAt,
      },
    });
    return new Rental(
      created.id,
      created.userId,
      created.bookId,
      created.expiresAt,
      created.createdAt,
      created.updatedAt,
    );
  }

  static async getByUserAndISBN(
    userId: string,
    isbn: string,
  ): Promise<Rental | null> {
    const rental = await prisma.rental.findFirst({
      where: {
        userId,
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
      rental.userId,
      rental.bookId,
      rental.expiresAt,
      rental.createdAt,
      rental.updatedAt,
    );
  }

  static async getByUserId(userId: string): Promise<Rental[]> {
    const rentals = await prisma.rental.findMany({
      where: { userId },
    });
    return rentals.map(
      (rental) =>
        new Rental(
          rental.id,
          rental.userId,
          rental.bookId,
          rental.expiresAt,
          rental.createdAt,
          rental.updatedAt,
        ),
    );
  }

  async getBook(): Promise<Book> {
    const book = await prisma.book.findUnique({
      where: { id: this.bookId },
    });
    if (!book) {
      throw new Error("Book not found");
    }
    return new Book(book);
  }

  async save(): Promise<void> {
    await prisma.rental.update({
      where: { id: this.id },
      data: {
        userId: this.userId,
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
