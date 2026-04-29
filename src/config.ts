"use server";

import { CampusConfig } from "./class/Campus";

/**
 * @summary キャンパスの位置コードを取得する
 * @description すべての値が正しく取得でき、かつ数値である場合のみオブジェクトを返す。
 * 一つでも欠けている、または数値でない場合は null を返す。
 */
export const getPosCodes = async () => {
  const keys = [
    "minLatitude",
    "maxLatitude",
    "minLongitude",
    "maxLongitude",
  ] as const;

  // 1. 全てのデータを並列で取得
  const results = await Promise.all(
    keys.map((key) => CampusConfig.getByKey(key)),
  );

  // 2. 数値に変換し、パースに失敗（NaN）またはデータ欠損があれば null を含める
  const values = results.map((res) => {
    const val = parseFloat(res?.value ?? "");
    return Number.isNaN(val) ? null : val;
  });

  // 3. 一つでも null が含まれていれば、関数全体として null を返す
  if (values.includes(null)) {
    return null;
  }

  // 4. 全て有効な数値であればオブジェクトを構成して返す
  const [minLatitude, maxLatitude, minLongitude, maxLongitude] =
    values as number[];

  return {
    minLatitude,
    maxLatitude,
    minLongitude,
    maxLongitude,
  };
};
