import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * @summary Prismaクライアントのインスタンス
 * @description Prismaクライアントのインスタンスを作成する。これにより、データベースへのクエリを実行することができる。
 * @type {Object}
 * @author yuito-it <yuito@yuito-it.jp>
 */
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

/**
 * @summary Prismaクライアントのインスタンス
 * @description Prismaクライアントのインスタンスを作成する。これにより、データベースへのクエリを実行することができる。
 * @type {Object}
 * @author yuito-it <yuito@yuito-it.jp>
 * @see https://www.prisma.io/docs/v6/orm/prisma-client/setup-and-configuration/instantiate-prisma-client
 */
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

/**
 * @summary Prismaクライアントのインスタンス
 * @description Prismaクライアントのインスタンスを作成する。これにより、データベースへのクエリを実行することができる。
 * @type {Object}
 * @author yuito-it <yuito@yuito-it.jp>
 * @see https://www.prisma.io/docs/v6/orm/prisma-client/setup-and-configuration/instantiate-prisma-client
 */
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
