"use server";

import ISBN from "isbn3";

const RAKUTEN_BOOK_API_BASE =
  "https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404";

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID;
const RAKUTEN_APP_KEY = process.env.RAKUTEN_APP_KEY;

export interface RakutenBookInfo {
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

export interface RakutenBookItem {
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

export interface ComvertedBookInfo {
  title: string;
  author: string;
  publisherName: string;
  isbn: string;
  itemUrl: string;
  itemImage: {
    small: string;
    medium: string;
    large: string;
  };
}

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

    const response = await fetch(
      `${RAKUTEN_BOOK_API_BASE}?${params.toString()}`,
    );
    if (!response.ok) {
      throw new Error(
        `Rakuten API Error: ${response.status} ${response.statusText}`,
      );
    }
    const data: RakutenBookInfo = await response.json();
    if (data.Items.length === 0) {
      throw new Error("Book not found", { cause: "NOT_FOUND" });
    }
    const res: ComvertedBookInfo = {
      title:
        `${data.Items[0].Item.title} ${data.Items[0].Item.subTitle}`.trim(),
      author: data.Items[0].Item.author,
      publisherName: data.Items[0].Item.publisherName,
      isbn: data.Items[0].Item.isbn,
      itemUrl: data.Items[0].Item.itemUrl,
      itemImage: {
        small: data.Items[0].Item.smallImageUrl,
        medium: data.Items[0].Item.mediumImageUrl,
        large: data.Items[0].Item.largeImageUrl,
      },
    };
    return res;
  } catch (error) {
    console.error("Error fetching book info:", error);
    throw error;
  }
};
