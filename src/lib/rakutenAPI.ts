"use server";

import ISBN from "isbn3";
import { validateBookOrMagazineJanCode } from "./barcode";

const RAKUTEN_BOOK_API_BASE =
  "https://openapi.rakuten.co.jp/services/api/BooksTotal/Search/20170404";

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID;
const RAKUTEN_APP_KEY = process.env.RAKUTEN_APP_KEY;

/**
 * @summary RakutenBooks APIから返ってくるデータの型
 * @interface RakutenBookInfo
 * @see https://webservice.rakuten.co.jp/documentation/books-total-search
 * @author yuito-it<yuito@yuito-it.jp>
 */
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

/**
 * @summary RakutenBooks APIから返ってくるデータの型
 * @interface RakutenBookItem
 * @see https://webservice.rakuten.co.jp/documentation/books-total-search
 * @author yuito-it<yuito@yuito-it.jp>
 */
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
    jan: string;
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
/* TODO: これを"use server";でexportしてはならない。
async以外のobjectと判定されてエラーが発生する
 const RakutenBooksGenreIds = {
   "001004008": "日本の小説",
   "001004009": "外国の小説",
   "001004001": "ミステリー・サスペンス",
   "001004002": "SF・ホラー",
   "001004003": "エッセイ",
   "001004004": "ノンフィクション",
   "001004016": "ロマンス",
   "001004015": "その他",
   "001017005": "少年",
   "001017006": "少女",
   "001017004": "その他",
   "001021001": "小説",
   "001021002": "コミック",
   "001021003": "その他",
   "001029001": "小説",
   "001029002": "コミック",
   "001019001": "小説・エッセイ",
   "001019002": "美容・暮らし・健康・料理",
   "001019003": "ホビー・スポーツ・美術",
   "001019005": "語学・学習参考書",
   "001019006": "旅行・留学・アウトドア",
   "001019007": "人文・思想・社会",
   "001019008": "ビジネス・経済・就職",
   "001019009": "パソコン・システム開発",
   "001019010": "科学・医学・技術",
   "001019011": "漫画（コミック）",
   "001019012": "ライトノベル",
   "001019013": "エンタメ",
   "001019014": "写真集・タレント",
   "001019015": "その他",
   "001020001": "小説・エッセイ",
   "001020002": "美容・暮らし・健康・料理",
   "001020003": "ホビー・スポーツ・美術",
   "001020004": "絵本・児童書・図鑑",
   "001020005": "語学・学習参考書",
   "001020006": "旅行・留学・アウトドア",
   "001020007": "人文・思想・社会",
   "001020008": "ビジネス・経済・就職",
   "001020009": "パソコン・システム開発",
   "001020010": "科学・医学・技術",
   "001020011": "エンタメ",
   "001020014": "その他",
   "001010001": "恋愛",
   "001010002": "妊娠・出産・子育て",
   "001010003": "ペット",
   "001010004": "住まい・インテリア",
   "001010005": "ガーデニング・フラワー",
   "001010006": "生活の知識",
   "001010008": "冠婚葬祭・マナー",
   "001010009": "手芸",
   "001010010": "健康",
   "001010011": "料理",
   "001010012": "ドリンク・お酒",
   "001010013": "生き方・リラクゼーション",
   "001010007": "占い",
   "001010014": "ファッション・美容",
   "001010016": "雑貨",
   "001010015": "その他",
 };
*/

/**
 * @summary RakutenBooks APIから返ってくるデータを加工した型
 * @interface ConvertedBookInfo
 * @author yuito-it<yuito@yuito-it.jp>
 */
export interface ConvertedBookInfo {
  title: string;
  author: string;
  publisherName: string;
  publishedAt: string;
  isbn: string;
  jan: string;
  itemUrl: string;
  itemImage: {
    small: string;
    medium: string;
    large: string;
  };
}

/**
 * @summary Rakuten Books APIからISBNもしくはJANで書籍データを取得する関数
 * @async
 * @function getBookInfoFromISBNorJAN
 * @returns 書籍情報
 * @param isbnjan ISBNもしくはJANコード
 * @see https://webservice.rakuten.co.jp/documentation/books-total-search
 * @author yuito-it<yuito@yuito-it.jp>
 */
export const getBookInfoFromISBNorJAN = async (
  isbnjan: string,
): Promise<ConvertedBookInfo> => {
  if (
    ISBN.audit(isbnjan).validIsbn === false &&
    validateBookOrMagazineJanCode(isbnjan) === false
  ) {
    throw new Error("Invalid Barcode", { cause: "INVALID_BARCODE" });
  }
  const params = new URLSearchParams({
    applicationId: RAKUTEN_APP_ID!,
    accessKey: RAKUTEN_APP_KEY!,
    isbnjan,
  });

  const response = await fetch(`${RAKUTEN_BOOK_API_BASE}?${params.toString()}`);
  console.log(`${RAKUTEN_BOOK_API_BASE}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(
      `Rakuten API Error: ${response.status} ${response.statusText}`,
    );
  }
  const data: RakutenBookInfo = await response.json();
  if (data.Items.length === 0) {
    throw new Error("Book not found", { cause: "NOT_FOUND" });
  }
  const res: ConvertedBookInfo = {
    title:
      `${data.Items[0].Item.title}${data.Items[0].Item.subTitle ? ` ${data.Items[0].Item.subTitle}` : ""}`.trim(),
    author: data.Items[0].Item.author,
    publisherName: data.Items[0].Item.publisherName,
    isbn: data.Items[0].Item.isbn,
    jan: data.Items[0].Item.jan,
    itemUrl: data.Items[0].Item.itemUrl,
    publishedAt: new Date(
      data.Items[0].Item.salesDate
        .replaceAll("頃", "")
        .replace("年", "/")
        .replace("月", "/")
        .replace("日", "/"),
    ).toLocaleDateString(),
    itemImage: {
      small: data.Items[0].Item.smallImageUrl,
      medium: data.Items[0].Item.mediumImageUrl,
      large: data.Items[0].Item.largeImageUrl,
    },
  };
  return res;
};
