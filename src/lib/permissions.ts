import { createAccessControl } from "better-auth/plugins";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  book: ["create", "edit", "delete", "rent", "return", "forceReturn"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  ...adminAc.statements,
  book: ["create", "edit", "delete", "rent", "return", "forceReturn"],
});

export const student = ac.newRole({
  book: ["rent", "return"],
});
