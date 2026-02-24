import prisma from "@/lib/prisma";
import { Book as PrismaBook, Rental } from "../generated/prisma/client";
import { v4 as uuidv4 } from "uuid";

export enum BookStatus {
  Available = "available",
  Rented = "rented",
}

export class Book {
  id: string;
  name: string;
  isbn: string;
  author?: string;
  publisher?: string;
  sticker_id?: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * 本のステータスを確認する
   * @returns 本のステータス
   */
  async getStatus(): Promise<BookStatus> {
    const rental = await prisma.rental.findFirst({
      where: { bookId: this.id },
    });
    return rental ? BookStatus.Rented : BookStatus.Available;
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

  /**
   * 本を登録する
   * @param data 作成する本のデータ
   * @returns 作成された本のインスタンス
   */
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
   * クラス(インスタンス)の内容をデータベースに上書きする
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
   * 本の登録を削除する
   * @returns 削除された本の情報
   */
  async delete(): Promise<Book> {
    const deleted = await prisma.book.delete({ where: { id: this.id } });
    return new Book(deleted);
  }

  /**
   * 本を貸し出す
   * @param user_id 借りる人(ユーザーID)
   * @returns 貸出情報
   */
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

  /**
   * 本を返却する
   */
  async return() {
    const rental = await prisma.rental.findFirst({
      where: { bookId: this.id },
    });
    if (!rental) {
      throw new Error("This book is not currently rented");
    }
    await prisma.rental.delete({ where: { id: rental.id } });
  }

  /**
   * IDを指定して本の情報を取得する
   * @param id 本のid
   * @returns 本の情報
   */
  static async findById(id: string): Promise<Book | null> {
    const found = await prisma.book.findUnique({ where: { id } });
    return found ? new Book(found) : null;
  }

  /**
   * 本の一覧を取得する
   * @returns 本の情報の配列
   */
  static async findAll(): Promise<Book[]> {
    const books = await prisma.book.findMany();
    return books.map((b) => new Book(b));
  }

  /**
   * ISBNコードを指定して本の情報を取得する
   * @param isbn ISBNコード
   * @returns 本の情報の配列
   */
  static async findByISBN(isbn: string): Promise<Book[]> {
    const books = await prisma.book.findMany({ where: { isbn } });
    return books.map((b) => new Book(b));
  }

  /**
   * シールに紐つく本の情報を取得する
   * @param sticker_id シールの番号
   * @returns 本の情報もしくはnull
   */
  static async findByStickerId(sticker_id: string): Promise<Book | null> {
    const found = await prisma.book.findFirst({ where: { sticker_id } });
    return found ? new Book(found) : null;
  }
}
