"use server";

import type { AlertColor } from "@mui/material";
import { Book } from "@/class/Book";
import { getBookInfoFromISBNorJAN } from "@/lib/rakutenAPI";

// データ取得のためのヘルパー
// 必須項目がなければエラーを投げる
const getRequired = (key: string, formData: FormData) => {
  const v = formData.get(key);
  if (typeof v !== "string" || v.trim() === "") {
    throw new Error(`${key} is required`);
  }
  return v.trim();
};
const getOptional = (key: string, formData: FormData) => {
  const v = formData.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
};

/**
 * @function regist
 * @summary 本を登録する
 * @param formData FormData型の書籍情報
 * @author yuito-it<yuito@yuito-it.jp>
 */
export const regist = async (formData: FormData) => {
  // 画像取得
  const rakutenLinked = getOptional("rakutenLinked", formData) === "on";
  let imageUrl: string | undefined;
  if (rakutenLinked) {
    if (
      getOptional("isbn", formData) === undefined &&
      getOptional("jan", formData) === undefined
    ) {
      throw new Error("ISBN・JANがないため楽天APIで問い合わせられません。");
    }
    const bookInfo = await getBookInfoFromISBNorJAN(
      (getOptional("isbn", formData) || getOptional("jan", formData))!,
    );
    if (bookInfo) {
      imageUrl = bookInfo.itemImage.large;
    }
  }

  // 登録
  await Book.create({
    name: getRequired("name", formData),
    isbn: getOptional("isbn", formData),
    jan: getOptional("jan", formData),
    author: getOptional("author", formData),
    publisher: getOptional("publisher", formData),
    publishedAt: getOptional("publishedAt", formData)
      ? new Date(getOptional("publishedAt", formData)!)
      : undefined,
    stickerId: getOptional("stickerId", formData),
    rakutenLinked,
    imageUrl,
  });
};

export const isNeedWarn = async (
  formData: FormData,
): Promise<{
  message: string;
  severity: AlertColor;
} | null> => {
  const isbn = getOptional("isbn", formData);
  const jan = getOptional("jan", formData);
  const stickerId = getOptional("stickerId", formData);
  if (!(isbn || jan)) {
    if (stickerId)
      return {
        message:
          "ISBNもJANも登録しない場合はバーコードによる貸借処理が行えません。\nそれでも登録しますか？",
        severity: "warning",
      };
    else
      return {
        message:
          "ISBN・JAN、ステッカーID全てを登録しない場合は管理者が手動で貸借処理を行う必要があります。\nそれでも登録しますか？",
        severity: "warning",
      };
  } else if (!stickerId) {
    const existingBook = await Book.getByISBNorJAN((isbn || jan)!);
    if (existingBook)
      return {
        message:
          "すでに同じ本が登録されています。ステッカーIDを入力し区別することを強く推奨します。\nそれでも登録しますか？",
        severity: "warning",
      };
  }
  return null;
};
