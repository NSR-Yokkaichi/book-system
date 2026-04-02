"use server";

import ISBN from "isbn3";
import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { Book } from "@/class/Book";
import { Rental } from "@/class/Rental";
import { auth } from "@/lib/auth";

export const borrowAction = async (isbn: string) => {
  try {
    if (ISBN.audit(isbn).validIsbn === false) {
      return;
    }
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      unauthorized();
    }
    const book = await Book.getByISBN(isbn);
    if (!book || book.length === 0) {
      throw new Error("本が見つかりません");
    }
    redirect(`/borrow/${isbn}`);
  } catch (error) {
    console.error("Error borrowing book:", error);
    throw error;
  }
};

export const returnAction = async (isbn: string) => {
  try {
    if (ISBN.audit(isbn).validIsbn === false) {
      return;
    }
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      unauthorized();
    }
    const rental = await Rental.getByUserAndISBN(session.user.id, isbn);
    if (!rental) {
      throw new Error("貸し出し情報が見つかりません");
    }
    redirect(`/return/${isbn}`);
  } catch (error) {
    console.error("Error returning book:", error);
    throw error;
  }
};

const RAKUTEN_BOOK_API_BASE =
  "https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404";

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID;
const RAKUTEN_APP_KEY = process.env.RAKUTEN_APP_KEY;

export const getBookInfoFromISBN = async (isbn: string) => {
  try {
    if (ISBN.audit(isbn).validIsbn === false) {
      return null;
    }
    const params = new URLSearchParams({
      applicationId: RAKUTEN_APP_ID!,
      accessKey: RAKUTEN_APP_KEY!,
      isbn,
    });
    const headers = new Headers({
      Referer: "https://book.unipro-n.com",
      Origin: "https://book.unipro-n.com",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    });

    const response = await fetch(
      `${RAKUTEN_BOOK_API_BASE}?${params.toString()}`,
      { headers },
    );
    if (!response.ok) {
      throw new Error(
        `楽天APIエラー: ${response.status} ${response.statusText}`,
      );
    }
    const data: RakutenBookInfo = await response.json();
    if (data.Items.length === 0) {
      throw new Error("書籍情報が見つかりません", { cause: "NOT_FOUND" });
    }
    const res: ComvertedBookInfo = {
      title:
        `${data.Items[0].Item.title} ${data.Items[0].Item.subTitle}`.trim(),
      author: data.Items[0].Item.author,
      publisherName: data.Items[0].Item.publisherName,
      isbn: data.Items[0].Item.isbn,
    };
    return res;
  } catch (error) {
    console.error("Error fetching book info:", error);
    throw error;
  }
};

interface RakutenBookInfo {
  count: number;
  page: number;
  first: number;
  last: number;
  hits: number;
  carrier: number;
  pageCount: number;
  Items: RakutenBookItem[];
  GenreInformation: [];
}

interface RakutenBookItem {
  Item: {
    title: string;
    titleKana: string;
    subTitle: string;
    subTitleKana: string;
    seriesName: string;
    seriesNameKana: string;
    contents: string;
    author: string;
    authorKana: string;
    publisherName: string;
    size: string;
    isbn: string;
    itemCaption: string;
    salesDate: string;
    itemPrice: number;
    listPrice: number;
    discountRate: number;
    discountPrice: number;
    itemUrl: string;
    affiliateUrl: string;
    smallImageUrl: string;
    mediumImageUrl: string;
    largeImageUrl: string;
    chirayomiUrl: string;
    availability: string;
    postageFlag: number;
    limitedFlag: number;
    reviewCount: number;
    reviewAverage: string;
    booksGenreId: string;
  };
}

interface ComvertedBookInfo {
  title: string;
  author: string;
  publisherName: string;
  isbn: string;
}
