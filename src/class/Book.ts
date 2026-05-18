import { headers } from "next/headers";
import { ulid } from "ulid";
import { auth } from "@/lib/auth";
import { validateBookOrMagazineJanCode } from "@/lib/barcode";
import { dbClient } from "@/lib/db";
import { CampusConfig } from "./Campus";
import { Rental } from "./Rental";
import { BookStatus } from "./types/Book";

export class Book {
  id: string;
  name: string;
  isbn?: string;
  jan?: string;
  author?: string | null;
  publisher?: string | null;
  publishedAt?: Date;
  stickerId?: string | null;
  rakutenLinked?: boolean | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;

  /**
   * @summary 本のステータスを確認する
   * @function getStatus
   * @async
   * @returns 本のステータス
   * @author yuito-it<yuito@yuito-it.jp>
   */
  async getStatus(): Promise<BookStatus> {
    const rental = await dbClient.rental.findFirst({
      where: { bookId: this.id },
    });
    if (rental?.returnedAt) return BookStatus.Available;
    return rental ? BookStatus.Rented : BookStatus.Available;
  }

  constructor(
    data: Omit<
      Book,
      "getStatus" | "create" | "save" | "delete" | "rent" | "return" | "getById"
    >,
  ) {
    this.id = data.id;
    this.name = data.name;
    this.isbn = data.isbn || undefined;
    this.jan = data.jan || undefined;
    this.author = data.author || undefined;
    this.publisher = data.publisher || undefined;
    this.publishedAt = data.publishedAt || undefined;
    this.stickerId = data.stickerId || undefined;
    this.rakutenLinked = data.rakutenLinked || false;
    this.imageUrl = data.imageUrl || undefined;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * @summary 本を登録する
   * @function create
   * @async
   * @param data 作成する本のデータ
   * @returns 作成された本のインスタンス
   * @author yuito-it<yuito@yuito-it.jp>
   */
  static async create(data: {
    name: string;
    isbn?: string;
    jan?: string;
    author?: string;
    publisher?: string;
    publishedAt?: Date;
    stickerId?: string;
    rakutenLinked?: boolean;
    imageUrl?: string;
  }): Promise<Book> {
    const created = await dbClient.book.create({
      data: {
        id: ulid(),
        name: data.name,
        isbn: data.isbn,
        jan: data.jan,
        author: data.author,
        publisher: data.publisher,
        publishedAt: data.publishedAt,
        stickerId: data.stickerId,
        rakutenLinked: data.rakutenLinked,
        imageUrl: data.imageUrl,
      },
    });
    return new Book(created);
  }

  /**
   * @summary クラス(インスタンス)の内容をデータベースに上書きする
   * @function save
   * @async
   * @returns 更新後のBookインスタンス
   * @author yuito-it<yuito@yuito-it.jp>
   */
  async save(): Promise<Book> {
    const updated = await dbClient.book.update({
      where: { id: this.id },
      data: {
        name: this.name,
        isbn: this.isbn,
        jan: this.jan,
        author: this.author,
        publisher: this.publisher,
        publishedAt: this.publishedAt,
        stickerId: this.stickerId,
        rakutenLinked: this.rakutenLinked,
        imageUrl: this.imageUrl,
      },
    });
    // プロパティを最新化
    Object.assign(this, {
      ...updated,
      publshedAt: new Date(updated.publishedAt),
      createdAt: new Date(updated.createdAt),
      updatedAt: new Date(updated.updatedAt),
    });
    return this;
  }

  /**
   * @summary 本の登録を削除する
   * @function delete
   * @async
   * @returns 削除された本の情報
   * @author yuito-it<yuito@yuito-it.jp>
   */
  async delete(): Promise<Book> {
    await dbClient.book.delete({ where: { id: this.id } });
    return this;
  }

  /**
   * @summary 本を貸し出す
   * @function rent
   * @async
   * @param userId 借りる人(学生のID)
   * @returns 貸出情報
   * @author yuito-it<yuito@yuito-it.jp>
   */
  async rent(userId: string): Promise<Rental> {
    const campusName = await CampusConfig.getByKey("name");
    const rentalDeadlineRaw = await CampusConfig.getByKey("rentalDeadline");
    let rentalDeadline = 14;
    if (
      rentalDeadlineRaw?.value &&
      Number.isSafeInteger(rentalDeadlineRaw?.value)
    ) {
      rentalDeadline = Number.parseInt(rentalDeadlineRaw?.value, 10);
    }
    if (!campusName) {
      throw new Error("Campus not found");
    }
    const user = await dbClient.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }
    const adminCanRent =
      (await CampusConfig.getByKey("adminCanRental"))?.value === "true";
    if (user.role !== "student" && !adminCanRent) {
      throw new Error("Only students can rent books");
    }
    const rental = await dbClient.rental.create({
      data: {
        id: ulid(),
        bookId: this.id,
        userId,
        expiresAt: new Date(Date.now() + rentalDeadline * 24 * 60 * 60 * 1000),
      },
    });
    return new Rental(
      rental.id,
      rental.userId,
      rental.bookId,
      rental.expiresAt,
      rental.returnedAt,
      rental.createdAt,
      rental.updatedAt,
    );
  }

  /**
   * @summary 本の返却申請もしくは強制返却を行う
   * @function return
   * @async
   * @param [force=false] 強制的に返却するか
   * @author yuito-it<yuito@yuito-it.jp>
   */
  async return(force: boolean = false) {
    const rentalList = await Rental.getByBookId(this.id);
    const rental = rentalList.find(
      (rental) =>
        rental.returnedAt === null || rental.returnedAt === undefined || force,
    );
    if (!rental) {
      throw new Error("This book is not currently rented");
    }
    if (!force) await rental.applyReturn();
    else {
      const session = await auth.api.getSession({ headers: await headers() });
      const user = session?.user;
      if (user?.role === "admin") rental.delete();
      else throw new Error("Only admin can force return");
    }
  }

  /**
   * @summary IDを指定して本の情報を取得する
   * @function getById
   * @async
   * @static
   * @param id 本のid
   * @returns 本の情報
   * @author yuito-it<yuito@yuito-it.jp>
   */
  static async getById(id: string): Promise<Book | null> {
    const found = await dbClient.book.findUnique({ where: { id } });
    return found ? new Book(found) : null;
  }

  /**
   * @summary 本の一覧を取得する
   * @async
   * @static
   * @function getAll
   * @returns 本の情報の配列
   * @author yuito-it<yuito@yuito-it.jp>
   */
  static async getAll({
    take,
    skip,
  }: {
    take?: number;
    skip?: number;
  } = {}): Promise<Book[]> {
    const books = await dbClient.book.findMany({ take, skip });
    return books.map((b) => new Book(b));
  }

  static async count(): Promise<number> {
    return await dbClient.book.count();
  }

  /**
   * @summary ISBNコードを指定して本の情報を取得する
   * @function getByISBNorJAN
   * @async
   * @static
   * @param isbnjan ISBNコード
   * @returns 本の情報の配列
   * @author yuito-it<yuito@yuito-it.jp>
   */
  static async getByISBNorJAN(isbnjan: string): Promise<Book[]> {
    const isJAN = validateBookOrMagazineJanCode(isbnjan);
    const books = await dbClient.book.findMany({
      where: {
        isbn: isJAN ? undefined : isbnjan,
        jan: isJAN ? isbnjan : undefined,
      },
    });
    return books.map((b) => new Book(b));
  }

  /**
   * @summary シールに紐つく本の情報を取得する
   * @function getByStickerId
   * @async
   * @static
   * @param stickerId シールの番号
   * @returns 本の情報もしくはnull
   * @author yuito-it<yuito@yuito-it.jp>
   */
  static async getByStickerId(stickerId: string): Promise<Book | null> {
    const found = await dbClient.book.findFirst({ where: { stickerId } });
    return found ? new Book(found) : null;
  }

  /**
   * @summary 本を検索する
   * @function search
   * @async
   * @static
   * @param query 検索データ(詳細検索もしくは簡易検索)
   * @returns 検索結果の本の配列
   * @author yuito-it<yuito@yuito-it.jp>
   */
  static async search(
    query:
      | {
          name?: string;
          isbn?: string;
          jan?: string;
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
          { jan: { contains: query, mode: "insensitive" } },
          { author: { contains: query, mode: "insensitive" } },
          { publisher: { contains: query, mode: "insensitive" } },
        ],
      };
    } else {
      where = Object.fromEntries(
        Object.entries(query).filter(([_, value]) => value !== undefined),
      );
    }
    const books = await dbClient.book.findMany({ where });
    return books.map((b) => new Book(b));
  }
}
