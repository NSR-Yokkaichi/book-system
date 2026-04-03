/**
 * @summary アクセス制御の定義
 * @description アクセス制御の定義を行う。これにより、ユーザーの役割に応じたアクセス制御を行うことができる。
 * @author yuito-it <yuito@yuito-it.jp>
 * @see https://better-auth.com/docs/plugins/admin#access-control
 */

import { createAccessControl } from "better-auth/plugins";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

/**
 * @summary アクセス制御タイプの定義
 * @description アクセス制御するために、どのような行為ができるかを定義する。
 * @type {Object}
 * @author yuito-it <yuito@yuito-it.jp>
 */
const statement = {
  ...defaultStatements,
  book: ["create", "edit", "delete", "rent", "return", "forceReturn"],
} as const;

/**
 * @summary アクセス制御のインスタンス
 * @description アクセス制御のインスタンスを作成する。これにより、ユーザーの役割に応じたアクセス制御を行うことができる。
 * @type {Object}
 * @author yuito-it <yuito@yuito-it.jp>
 */
export const ac = createAccessControl(statement);

/**
 * @summary 管理者の役割
 * @description 管理者の役割を定義する。管理者は、すべての行為ができる。
 * @type {Object}
 * @author yuito-it <yuito@yuito-it.jp>
 */
export const admin = ac.newRole({
  ...adminAc.statements,
  book: ["create", "edit", "delete", "rent", "return", "forceReturn"],
});

/**
 * @summary 学生の役割
 * @description 学生の役割を定義する。学生は、本の貸出と返却のみができる。
 * @type {Object}
 * @author yuito-it <yuito@yuito-it.jp>
 */
export const student = ac.newRole({
  book: ["rent", "return"],
});
