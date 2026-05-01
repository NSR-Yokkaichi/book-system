import { ulid } from "ulid";
import { dbClient } from "@/lib/db";
import { Book } from "./Book";
import { validateBookOrMagazineJanCode } from "@/lib/barcode";

export class Rental {
  id: string;
  userId: string;
  bookId: string;
  expiresAt: Date;
  returnedAt: Date | undefined | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    bookId: string,
    expiresAt: Date,
    returnedAt: Date | undefined | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.bookId = bookId;
    this.expiresAt = expiresAt;
    this.returnedAt = returnedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(data: {
    userId: string;
    bookId: string;
    expiresAt: Date;
  }): Promise<Rental> {
    const created = await dbClient.rental.create({
      data: {
        id: ulid(),
        userId: data.userId,
        bookId: data.bookId,
        expiresAt: data.expiresAt,
      },
    });
    return new Rental(
      created.id,
      created.userId,
      created.bookId,
      new Date(created.expiresAt),
      created.returnedAt ? new Date(created.returnedAt) : null,
      new Date(created.createdAt),
      new Date(created.updatedAt),
    );
  }

  static async getById(id: string): Promise<Rental | null> {
    const rental = await dbClient.rental.findUnique({
      where: {
        id,
      },
    });
    if (!rental) {
      return null;
    }
    return new Rental(
      rental.id,
      rental.userId,
      rental.bookId,
      new Date(rental.expiresAt),
      rental.returnedAt ? new Date(rental.returnedAt) : null,
      new Date(rental.createdAt),
      new Date(rental.updatedAt),
    );
  }

  static async getByUserAndISBNorJAN(
    userId: string,
    isbnjan: string,
  ): Promise<Rental | null> {
    const isJAN = validateBookOrMagazineJanCode(isbnjan);
    const rental = await dbClient.rental.findFirst({
      where: {
        userId,
        book: {
          isbn: isJAN ? undefined : isbnjan,
          jan: isJAN ? isbnjan : undefined,
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
      new Date(rental.expiresAt),
      rental.returnedAt ? new Date(rental.returnedAt) : null,
      new Date(rental.createdAt),
      new Date(rental.updatedAt),
    );
  }

  static async getByUserId(userId: string): Promise<Rental[]> {
    const rentals = await dbClient.rental.findMany({
      where: { userId },
    });
    return rentals.map(
      (rental) =>
        new Rental(
          rental.id,
          rental.userId,
          rental.bookId,
          new Date(rental.expiresAt),
          rental.returnedAt ? new Date(rental.returnedAt) : null,
          new Date(rental.createdAt),
          new Date(rental.updatedAt),
        ),
    );
  }

  static async getByBookId(bookId: string): Promise<Rental[]> {
    const rentals = await dbClient.rental.findMany({
      where: { bookId },
    });
    return rentals.map(
      (rental) =>
        new Rental(
          rental.id,
          rental.userId,
          rental.bookId,
          new Date(rental.expiresAt),
          rental.returnedAt ? new Date(rental.returnedAt) : null,
          new Date(rental.createdAt),
          new Date(rental.updatedAt),
        ),
    );
  }

  static async getAll(): Promise<Rental[]> {
    const rentals = await dbClient.rental.findMany();
    return rentals.map(
      (rental) =>
        new Rental(
          rental.id,
          rental.userId,
          rental.bookId,
          new Date(rental.expiresAt),
          rental.returnedAt ? new Date(rental.returnedAt) : null,
          new Date(rental.createdAt),
          new Date(rental.updatedAt),
        ),
    );
  }

  async getBook(): Promise<Book> {
    const book = await dbClient.book.findUnique({
      where: { id: this.bookId },
    });
    if (!book) {
      throw new Error("Book not found");
    }
    return new Book(book);
  }

  async getUser() {
    const student = await dbClient.user.findUnique({
      where: { id: this.userId },
    });
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  }

  async save(): Promise<void> {
    await dbClient.rental.update({
      where: { id: this.id },
      data: {
        userId: this.userId,
        bookId: this.bookId,
        expiresAt: this.expiresAt,
      },
    });
  }

  async applyReturn(): Promise<Rental> {
    this.returnedAt = new Date();
    await this.save();
    return this;
  }

  async delete(): Promise<void> {
    await dbClient.rental.delete({
      where: { id: this.id },
    });
  }
}
