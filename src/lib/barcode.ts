/**
 * @summary 正しい書籍もしくは定期刊行物JANコードかをチェックする
 * @function validateBookOrMagazineJanCode
 * @returns 正しい書籍もしくは定期刊行物JANコードか
 * @param barcode バーコードの文字列
 * @author yuito-it<yuito@yuito-it.jp>
 */
export function validateBookOrMagazineJanCode(barcode: string): boolean {
  // 書籍 / 定期刊行物JAN チェック
  if (!(barcode.startsWith("192") || barcode.startsWith("491"))) return false;
  // 桁数チェック
  if (barcode.length !== 13 && barcode.length !== 8) return false;

  // チェックディジット等の確認
  const fullBarcode = barcode.padStart(13, "0");
  let oddDigitSum = 0;
  let evenDigitSum = 0;

  for (let i = 0; i < fullBarcode.length - 1; i++) {
    if (i % 2 === 0) {
      oddDigitSum += parseInt(fullBarcode[i], 10);
    } else {
      evenDigitSum += parseInt(fullBarcode[i], 10);
    }
  }

  const lastDigit = parseInt(
    String(evenDigitSum * 3 + oddDigitSum).slice(-1),
    10,
  );
  const expectCheckDigit = lastDigit === 0 ? 0 : 10 - lastDigit;

  return expectCheckDigit === parseInt(fullBarcode.slice(-1), 10);
}
