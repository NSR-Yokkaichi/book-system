import prisma from "@/lib/prisma";
import { Book as PrismaBook, Rental } from "../generated/prisma/client";
import { v4 as uuidv4 } from "uuid";

export class Book {
  id: string;
  name: string;
  isbn: string;
  author?: string;
  publisher?: string;
  sticker_id?: string;
  createdAt: Date;
  updatedAt: Date;

  async getStatus(): Promise<"available" | "rented"> {
    const rental = await prisma.rental.findFirst({
      where: { bookId: this.id },
    });
    return rental ? "rented" : "available";
  }

  constructor(data: PrismaBook) {
    this.id = data.id;
    this.name = data.name;
    this.isbn = data.isbn;
    this.author = data.author || undefined;
    this.publisher = data.publisher || undefined;
    this.sticker_id = data.sticker_id || undefined;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static async create(data: {
    id: string;
    name: string;
    isbn: string;
    author?: string;
    publisher?: string;
    sticker_id?: string;
  }): Promise<Book> {
    const created = await prisma.book.create({
      data: {
        id: data.id,
        name: data.name,
        isbn: data.isbn,
        author: data.author,
        publisher: data.publisher,
        sticker_id: data.sticker_id,
      },
    });
    return new Book(created);
  }

  /**
   * Bookインスタンスの内容でDBを更新するよ！
   * @returns 更新後のBookインスタンス
   */
  async save(): Promise<Book> {
    const updated = await prisma.book.update({
      where: { id: this.id },
      data: {
        name: this.name,
        isbn: this.isbn,
        author: this.author,
        publisher: this.publisher,
        sticker_id: this.sticker_id,
      },
    });
    // プロパティを最新化
    Object.assign(this, updated);
    return this;
  }

  /**
   * BookインスタンスをDBから削除するよ！
   * @returns 削除したBookインスタンス
   */
  async delete(): Promise<Book> {
    const deleted = await prisma.book.delete({ where: { id: this.id } });
    return new Book(deleted);
  }

  async rent(user_id: string): Promise<Rental> {
    const campus = await prisma.campus.findFirst();
    if (!campus) {
      throw new Error("Campus not found");
    }
    const rental = await prisma.rental.create({
      data: {
        id: uuidv4(),
        bookId: this.id,
        userId: user_id,
        expiresAt: new Date(
          Date.now() + campus.rentalDeadline * 24 * 60 * 60 * 1000,
        ),
      },
    });
    return rental;
  }

  async return() {
    const rental = await prisma.rental.findFirst({
      where: { bookId: this.id },
    });
    if (!rental) {
      throw new Error("This book is not currently rented");
    }
    await prisma.rental.delete({ where: { id: rental.id } });
  }

  static async findById(id: string): Promise<Book | null> {
    const found = await prisma.book.findUnique({ where: { id } });
    return found ? new Book(found) : null;
  }

  static async findAll(): Promise<Book[]> {
    const books = await prisma.book.findMany();
    return books.map((b) => new Book(b));
  }

  static async findByISBN(isbn: string): Promise<Book[]> {
    const books = await prisma.book.findMany({ where: { isbn } });
    return books.map((b) => new Book(b));
  }

  static async findByStickerId(sticker_id: string): Promise<Book | null> {
    const found = await prisma.book.findFirst({ where: { sticker_id } });
    return found ? new Book(found) : null;
  }
}
