import prisma from "@/lib/prisma";
import type { Book as PrismaBook } from "../generated/prisma/client";
import { Rental } from "./Rental";
import { BookStatus } from "./types/Book";

export class Book {
  id: string;
  name: string;
  isbn: string;
  author?: string;
  publisher?: string;
  stickerId?: string;
  rakutenLinked?: boolean;
  imageUrl?: string;
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
    this.stickerId = data.stickerId || undefined;
    this.rakutenLinked = data.rakutenLinked || false;
    this.imageUrl = data.imageUrl || undefined;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * 本を登録する
   * @param data 作成する本のデータ
   * @returns 作成された本のインスタンス
   */
  static async create(data: {
    name: string;
    isbn: string;
    author?: string;
    publisher?: string;
    stickerId?: string;
    rakutenLinked?: boolean;
    imageUrl?: string;
  }): Promise<Book> {
    const created = await prisma.book.create({
      data: {
        name: data.name,
        isbn: data.isbn,
        author: data.author,
        publisher: data.publisher,
        stickerId: data.stickerId,
        rakutenLinked: data.rakutenLinked,
        imageUrl: data.imageUrl,
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
        stickerId: this.stickerId,
        rakutenLinked: this.rakutenLinked,
        imageUrl: this.imageUrl,
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
   * @param userId 借りる人(学生のID)
   * @returns 貸出情報
   */
  async rent(userId: string): Promise<Rental> {
    const campus = await prisma.campus.findFirst();
    if (!campus) {
      throw new Error("Campus not found");
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.role !== "student") {
      throw new Error("Only students can rent books");
    }
    const rental = await prisma.rental.create({
      data: {
        bookId: this.id,
        userId,
        expiresAt: new Date(
          Date.now() + campus.rentalDeadline * 24 * 60 * 60 * 1000,
        ),
      },
    });
    return new Rental(
      rental.id,
      rental.userId,
      rental.bookId,
      rental.expiresAt,
      rental.createdAt,
      rental.updatedAt,
    );
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
  static async getById(id: string): Promise<Book | null> {
    const found = await prisma.book.findUnique({ where: { id } });
    return found ? new Book(found) : null;
  }

  /**
   * 本の一覧を取得する
   * @returns 本の情報の配列
   */
  static async getAll(): Promise<Book[]> {
    const books = await prisma.book.findMany();
    return books.map((b) => new Book(b));
  }

  /**
   * ISBNコードを指定して本の情報を取得する
   * @param isbn ISBNコード
   * @returns 本の情報の配列
   */
  static async getByISBN(isbn: string): Promise<Book[]> {
    const books = await prisma.book.findMany({ where: { isbn } });
    return books.map((b) => new Book(b));
  }

  /**
   * シールに紐つく本の情報を取得する
   * @param stickerId シールの番号
   * @returns 本の情報もしくはnull
   */
  static async getByStickerId(stickerId: string): Promise<Book | null> {
    const found = await prisma.book.findFirst({ where: { stickerId } });
    return found ? new Book(found) : null;
  }

  /**
   * 本を検索する
   * @param query 検索データ(詳細検索もしくは簡易検索)
   * @returns 検索結果の本の配列
   */
  static async search(
    query:
      | {
          name?: string;
          isbn?: string;
          author?: string;
          publisher?: string;
        }
      | string,
  ): Promise<Book[]> {
    let where = {};
    if (typeof query === "string") {
      where = {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { isbn: { contains: query, mode: "insensitive" } },
          { author: { contains: query, mode: "insensitive" } },
          { publisher: { contains: query, mode: "insensitive" } },
        ],
      };
    } else {
      where = Object.fromEntries(
        Object.entries(query).filter(([_, value]) => value !== undefined),
      );
    }
    const books = await prisma.book.findMany({ where });
    return books.map((b) => new Book(b));
  }
}
